import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";

/**
 * 按手机号精确搜索用户（仅平台管理员，用于授权弹窗）
 * GET /api/admin/users/search?mobile=13800138000
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const payload = HasuraJwtToken.verifyToken(token);
    const claims = payload?.["https://hasura.io/jwt/claims"] as
      | { "x-hasura-default-role"?: string; "x-hasura-allowed-roles"?: string[] }
      | undefined;
    const defaultRole = claims?.["x-hasura-default-role"];
    const allowedRoles = claims?.["x-hasura-allowed-roles"] ?? [];
    if (defaultRole !== "admin" && !allowedRoles.includes("admin")) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const mobile = req.nextUrl.searchParams.get("mobile") ?? "";
    if (!mobile.trim()) {
      return NextResponse.json({ error: "请填写手机号" }, { status: 400 });
    }

    const client = getHasuraClient();
    const query = `
      query SearchUserByMobile($mobile: String!) {
        users(where: { mobile: { _eq: $mobile } }, limit: 1) {
          id mobile nickname avatar_url role
        }
      }
    `;
    const res = await client.execute({ query, variables: { mobile: mobile.trim() } }) as {
      users?: { id: number; mobile?: string | null; nickname?: string | null; avatar_url?: string | null; role?: string | null }[];
    };
    const user = res?.users?.[0] ?? null;
    return NextResponse.json(user);
  } catch (e: unknown) {
    console.error("admin users search", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
