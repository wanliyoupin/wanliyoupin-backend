import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getWxAuthSingleton } from "@/config-lib/weixin/miniprogram/wxAuthSingleton";
import { issueUserJwt } from "../lib/issueUserJwt";

const wxAuth = getWxAuthSingleton();

/**
 * 微信授权登录 API（仅支持微信手机号授权登录）
 * POST /api/auth/phone-login
 *
 * Body: { code: string, codeSource: string }
 *
 * 私域模型（与「退出后再要手机号」一致）：
 * - `wx_mini_openid` 只挂在 **wx_guest_user** 行上，**不向 role=user/admin 的账号写入 openid**。
 * - 手机号登录只做：校验已登记手机号 → 对**目标用户**签发 JWT，**不合并**访客购物车/订单/地址等数据。
 * - 访客行保留 openid；退出登录后静默登录仍命中访客，再授权手机号即可切回正式用户。
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const client = getHasuraClient();

    let phone: string | undefined;
    let userId: number | undefined;

    if (body.code && body.codeSource) {
      if (body.codeSource === "phone") {
        const phoneRes = await wxAuth.getUserPhoneNumber(String(body.code));
        phone = phoneRes?.phone_info?.phoneNumber;
        if (!phone) {
          return NextResponse.json({ error: "获取手机号失败" }, { status: 400 });
        }
      } else if (body.codeSource === "login") {
        return NextResponse.json({ error: "请用手机号开发标签code登录" }, { status: 400 });
      } else {
        return NextResponse.json({ error: "codeSource不合法" }, { status: 400 });
      }

      const queryResult = (await client.execute({
        query: `
          query QueryUserByMobile($mobile: String!) {
            users(where: { mobile: { _eq: $mobile } }, limit: 1) {
              id
              mobile
              nickname
              avatar_url
              role
            }
          }
        `,
        variables: { mobile: phone },
      })) as {
        users?: Array<{
          id: number;
          mobile?: string | null;
          nickname?: string | null;
          avatar_url?: string | null;
          role: string;
        }>;
      };

      const existingMobile = queryResult?.users?.[0];

      if (existingMobile) {
        userId = Number(existingMobile.id);
      } else {
        // 私域：仅允许后台已登记的手机号，禁止自动注册、禁止访客用未登记手机号直接升级为 user
        return NextResponse.json(
          {
            error:
              "该手机号尚未开通。请联系公司管理员在后台添加您的账号后，再使用本机微信授权手机号。",
          },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json({ error: "参数错误：需要 code 和 codeSource" }, { status: 400 });
    }

    if (userId == null) {
      return NextResponse.json({ error: "注册或登录失败" }, { status: 500 });
    }

    const userResult = (await client.execute({
      query: `
        query GetUser($userId: bigint!) {
          users_by_pk(id: $userId) {
            id
            mobile
            nickname
            avatar_url
            role
            wx_mini_openid
          }
        }
      `,
      variables: { userId },
    })) as {
      users_by_pk?: {
        id: number;
        mobile?: string | null;
        nickname?: string | null;
        avatar_url?: string | null;
        role: string;
        wx_mini_openid?: string | null;
      } | null;
    };

    const user = userResult?.users_by_pk;
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 500 });
    }

    const token = issueUserJwt(user);

    return NextResponse.json({
      userId: Number(userId),
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
    console.error("手机号登录失败:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
