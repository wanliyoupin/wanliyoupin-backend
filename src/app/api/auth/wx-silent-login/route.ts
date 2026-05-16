import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getWxAuthSingleton } from "@/config-lib/weixin/miniprogram/wxAuthSingleton";
import { issueUserJwt } from "../lib/issueUserJwt";

const wxAuth = getWxAuthSingleton();

type UserRow = {
  id: number;
  mobile?: string | null;
  nickname?: string | null;
  avatar_url?: string | null;
  role: string;
  wx_mini_openid?: string | null;
};

async function fetchUserByOpenid(client: ReturnType<typeof getHasuraClient>, openid: string): Promise<UserRow | null> {
  const res = (await client.execute({
    query: `
      query UserByWxOpenid($oid: String!) {
        users(where: { wx_mini_openid: { _eq: $oid } }, limit: 1) {
          id
          mobile
          nickname
          avatar_url
          role
          wx_mini_openid
        }
      }
    `,
    variables: { oid: openid },
  })) as { users?: UserRow[] };

  const u = res?.users?.[0];
  return u ? { ...u, id: Number(u.id) } : null;
}

/**
 * 小程序静默登录：wx.login code → openid，查询或插入 **wx_guest_user**，签发访客 JWT。
 * 不使用 insert on_conflict（Hasura 若未跟踪 users_wx_mini_openid_key 则枚举里没有该 constraint，会报错）。
 * 并发双请求：先查再插，插入若唯一冲突则再查一次即可。
 * POST /api/auth/wx-silent-login  Body: { code: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!code) {
      return NextResponse.json({ error: "缺少 code" }, { status: 400 });
    }

    const session = await wxAuth.getSession(code);
    const openid = session.openid;
    if (!openid) {
      return NextResponse.json({ error: "未获取到 openid" }, { status: 400 });
    }

    const client = getHasuraClient();

    let user: UserRow | null = await fetchUserByOpenid(client, openid);

    if (!user?.id) {
      try {
        const ins = (await client.execute({
          query: `
            mutation InsertWxGuest($oid: String!) {
              insert_users_one(object: { role: "wx_guest_user", wx_mini_openid: $oid }) {
                id
                mobile
                nickname
                avatar_url
                role
                wx_mini_openid
              }
            }
          `,
          variables: { oid: openid },
        })) as { insert_users_one?: UserRow | null };
        const row = ins?.insert_users_one;
        user = row ? { ...row, id: Number(row.id) } : null;
      } catch {
        user = await fetchUserByOpenid(client, openid);
      }
    }

    if (!user?.id) {
      return NextResponse.json({ error: "创建或查询访客用户失败" }, { status: 500 });
    }

    const token = issueUserJwt(user);

    return NextResponse.json({
      userId: Number(user.id),
      token,
      user: {
        id: user.id,
        mobile: user.mobile ?? null,
        nickname: user.nickname ?? null,
        avatar_url: user.avatar_url ?? null,
        role: user.role,
        wx_mini_openid: user.wx_mini_openid ?? null,
      },
    });
  } catch (e: unknown) {
    console.error("wx-silent-login", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
