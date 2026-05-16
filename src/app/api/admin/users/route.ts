import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";

/**
 * 平台用户列表（仅平台管理员）
 * GET /api/admin/users?keyword=&role=user|admin|wx_guest_user&limit=20&offset=0
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

    const keyword = req.nextUrl.searchParams.get("keyword") ?? "";
    const roleParam = req.nextUrl.searchParams.get("role");
    const role =
      roleParam === "user" || roleParam === "admin" || roleParam === "wx_guest_user"
        ? roleParam
        : undefined;
    const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit")) || 20, 1), 200);
    const offset = Math.max(Number(req.nextUrl.searchParams.get("offset")) || 0, 0);

    const hasKeyword = keyword.trim() !== "";
    const keywordPattern = hasKeyword ? `%${keyword.trim()}%` : "";
    const client = getHasuraClient();

    const conditions: string[] = [];
    if (hasKeyword) {
      conditions.push(
        "_or: [{ mobile: { _ilike: $keyword } }, { nickname: { _ilike: $keyword } }, { wx_mini_openid: { _ilike: $keyword } }]"
      );
    }
    if (role) {
      conditions.push("role: { _eq: $role }");
    }
    const whereBody =
      conditions.length === 0
        ? ""
        : conditions.length === 1
          ? conditions[0]
          : `_and: [ ${conditions.map((c) => `{ ${c} }`).join(", ")} ]`;
    const whereArg = whereBody ? `where: { ${whereBody} }` : "";

    const varDecls = ["$limit: Int!", "$offset: Int!"];
    if (hasKeyword) varDecls.push("$keyword: String!");
    if (role) varDecls.push("$role: String!");

    const usersArgs = whereBody
      ? `${whereArg}, limit: $limit, offset: $offset, order_by: { created_at: desc }`
      : "limit: $limit, offset: $offset, order_by: { created_at: desc }";
    const aggregateArgs = whereBody ? `(${whereArg})` : "";

    const query = `
      query GetUserList(${varDecls.join(", ")}) {
        users(${usersArgs}) {
          id mobile nickname avatar_url role created_at wx_mini_openid
          company_users(order_by: { company: { name: asc } }) {
            company {
              id
              name
            }
          }
        }
        users_aggregate${aggregateArgs} { aggregate { count } }
      }
    `;
    const variables: Record<string, unknown> = { limit, offset };
    if (hasKeyword) variables.keyword = keywordPattern;
    if (role) variables.role = role;

    const res = await client.execute({ query, variables }) as {
      users?: {
        id: number;
        mobile?: string | null;
        nickname?: string | null;
        avatar_url?: string | null;
        role?: string | null;
        created_at?: string;
        wx_mini_openid?: string | null;
        company_users?: { company?: { id: number; name?: string | null } | null }[];
      }[];
      users_aggregate?: { aggregate?: { count?: number } };
    };
    const users = res?.users ?? [];
    const total = res?.users_aggregate?.aggregate?.count ?? 0;
    return NextResponse.json({ users, total });
  } catch (e: unknown) {
    console.error("admin users GET", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
