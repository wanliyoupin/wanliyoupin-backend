import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";

/** 从 config value（json）解析出系统配置公司 ID */
function parseSystemCompanyId(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? null : n;
  }
  if (typeof value === "object" && value !== null) {
    const o = value as Record<string, unknown>;
    if (typeof o.content === "number") return o.content;
    if (typeof o.companyId === "number") return o.companyId;
    if (typeof o.id === "number") return o.id;
  }
  return null;
}

/**
 * 获取当前用户的 company_users（关联的公司及角色）+ config 表系统配置公司ID（总部）
 * 后续查询商品、分类、套餐等需同时带当前公司 id 与系统配置公司 id
 * GET /api/admin/company-users
 * Header: Authorization: Bearer <token>
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const payload = HasuraJwtToken.verifyToken(token);
    const userId = payload?.userId ?? payload?.sub;
    if (!userId) {
      return NextResponse.json({ error: "无效 token" }, { status: 401 });
    }

    const client = getHasuraClient();
    const uid = Number(userId);

    const query = `
      query CompanyUsersAndSystemCompany($userId: bigint!) {
        company_users(where: { user_users: { _eq: $userId } }) {
          id
          role
          permissions
          company {
            id
            name
            logo_url
          }
        }
        configs(where: { name: { _eq: "default_company_id" } }, limit: 1) {
          value
        }
      }
    `;
    const res = await client.execute({
      query,
      variables: { userId: uid },
    });

    const data = res as {
      company_users?: {
        id: number;
        role: string;
        permissions?: string | null;
        company: { id: number; name: string; logo_url?: string | null };
      }[];
      configs?: { value?: unknown }[];
    };
    const rows = data?.company_users ?? [];
    const company_users = rows.map((row) => ({
      id: row.id,
      company: row.company,
      role: row.role,
      permissions: row.permissions ?? null,
    }));

    let system_company_id: number | null = null;
    if (data?.configs?.length && data.configs[0].value != null) {
      system_company_id = parseSystemCompanyId(data.configs[0].value);
    }

    return NextResponse.json({ company_users, system_company_id });
  } catch (e: unknown) {
    console.error("admin company-users", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
