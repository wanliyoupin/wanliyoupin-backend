import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";

/**
 * 将用户加入公司（仅平台管理员）
 * POST /api/admin/companies/[id]/authorize
 * Body: { mobile, role?: "admin" | "user" }，默认 admin
 * 按手机号查找或创建用户后加入该公司；role=user 时为普通公司成员（默认可看价、等级 A）
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const companyId = id ? parseInt(id, 10) : NaN;
    if (Number.isNaN(companyId) || companyId < 1) {
      return NextResponse.json({ error: "无效的公司 ID" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const mobile = typeof body.mobile === "string" ? body.mobile.trim().replace(/\D/g, "") : "";
    if (mobile.length !== 11) {
      return NextResponse.json({ error: "请填写 11 位手机号" }, { status: 400 });
    }

    const companyRole = body.role === "user" || body.role === "admin" ? body.role : "admin";

    const client = getHasuraClient();
    const searchQuery = `
      query SearchUserByMobile($mobile: String!) {
        users(where: { mobile: { _eq: $mobile } }, limit: 1) {
          id mobile nickname avatar_url
        }
      }
    `;
    const searchRes = await client.execute({ query: searchQuery, variables: { mobile } });
    const users = (searchRes as { users?: { id: number; mobile?: string; nickname?: string; avatar_url?: string }[] })?.users ?? [];
    let user = users[0];
    if (!user) {
      // 未找到用户时创建默认账号并授权（与用户列表添加用户逻辑一致）
      const createMutation = `
        mutation CreateUserByMobile($mobile: String!) {
          insert_users_one(object: { mobile: $mobile, role: "user" }) {
            id mobile nickname avatar_url
          }
        }
      `;
      const createRes = await client.execute({ query: createMutation, variables: { mobile } });
      user = (createRes as { insert_users_one?: { id: number; mobile?: string; nickname?: string; avatar_url?: string } })?.insert_users_one ?? null;
      if (!user?.id) {
        return NextResponse.json({ error: "创建用户失败" }, { status: 500 });
      }
    }

    const mutation = `
      mutation AuthorizeCompanyMember($user: company_users_insert_input!) {
        insert_company_users_one(
          object: $user
          on_conflict: {
            constraint: company_users_company_companies_user_users_key
            update_columns: [role, level, can_view_price, price_factor]
          }
        ) {
          id role level can_view_price price_factor
          user { id mobile nickname }
        }
      }
    `;
    const insertRes = await client.execute({
      query: mutation,
      variables: {
        user: {
          user_users: user.id,
          company_companies: companyId,
          role: companyRole,
          level: "A",
          can_view_price: true,
          price_factor: 1,
        },
      },
    });
    const row = (insertRes as { insert_company_users_one?: unknown })?.insert_company_users_one;
    return NextResponse.json(row);
  } catch (e: unknown) {
    console.error("admin companies authorize", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
