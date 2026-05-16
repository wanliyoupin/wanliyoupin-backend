import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";

type CompanyUser = {
  id: number;
  user: { id: number; mobile?: string | null; nickname?: string | null };
};
type CompanyRow = {
  id: number;
  name: string;
  logo_url?: string | null;
  wx_scan_code?: string | null;
  company_users?: CompanyUser[];
  company_users_total?: { aggregate?: { count?: number } };
  company_users_admin?: { aggregate?: { count?: number } };
  company_users_regular?: { aggregate?: { count?: number } };
};

const ADMIN_FILTERS = new Set(["all", "has_admin", "no_admin"]);
const SORT_KEYS = new Set(["created_desc", "created_asc", "name_asc", "name_desc"]);

function sanitizeSearchKeyword(raw: string): string {
  return raw.trim().slice(0, 100).replace(/[%_]/g, "");
}

/** 平台管理员公司列表 where 条件 */
function buildAdminCompaniesWhere(q: string, filterKey: string): Record<string, unknown> {
  const parts: Record<string, unknown>[] = [];
  const keyword = sanitizeSearchKeyword(q);
  if (keyword) {
    parts.push({ name: { _ilike: `%${keyword}%` } });
  }
  if (filterKey === "has_admin") {
    parts.push({ company_users: { role: { _eq: "admin" } } });
  } else if (filterKey === "no_admin") {
    parts.push({ _not: { company_users: { role: { _eq: "admin" } } } });
  }
  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0] as Record<string, unknown>;
  return { _and: parts };
}

/**
 * 获取当前用户可管理的公司列表（平台管理员看全部+分页+管理员信息，公司管理员看自己管理的）
 * GET /api/admin/companies?limit=20&offset=0&q=关键词&filter=all|has_admin|no_admin&sort=created_desc|created_asc|name_asc|name_desc
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
    const claims = payload["https://hasura.io/jwt/claims"] as
      | { "x-hasura-default-role"?: string; "x-hasura-allowed-roles"?: string[] }
      | undefined;
    const defaultRole = claims?.["x-hasura-default-role"];
    const allowedRoles = claims?.["x-hasura-allowed-roles"] ?? [];
    const isAdmin = defaultRole === "admin" || allowedRoles.includes("admin");

    const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit")) || 20, 1), 200);
    const offset = Math.max(Number(req.nextUrl.searchParams.get("offset")) || 0, 0);
    const qParam = req.nextUrl.searchParams.get("q") ?? "";
    const filterRaw = req.nextUrl.searchParams.get("filter") ?? "all";
    const filterKey = ADMIN_FILTERS.has(filterRaw) ? filterRaw : "all";
    const sortRaw = req.nextUrl.searchParams.get("sort") ?? "created_desc";
    const sortKey = SORT_KEYS.has(sortRaw) ? sortRaw : "created_desc";

    const orderByCompanies: Array<Record<string, string>> =
      sortKey === "created_asc"
        ? [{ created_at: "asc" }]
        : sortKey === "name_asc"
          ? [{ name: "asc" }]
          : sortKey === "name_desc"
            ? [{ name: "desc" }]
            : [{ created_at: "desc" }];

    const orderByCompanyUsers: Array<Record<string, Record<string, string>>> =
      sortKey === "created_asc"
        ? [{ company: { created_at: "asc" } }]
        : sortKey === "name_asc"
          ? [{ company: { name: "asc" } }]
          : sortKey === "name_desc"
            ? [{ company: { name: "desc" } }]
            : [{ company: { created_at: "desc" } }];

    if (isAdmin) {
      const where = buildAdminCompaniesWhere(qParam, filterKey);
      const query = `
        query AdminCompanies($limit: Int!, $offset: Int!, $order_by: [companies_order_by!]!, $where: companies_bool_exp!) {
          companies(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
            id
            name
            logo_url
            wx_scan_code
            company_users(where: { role: { _eq: "admin" } }) {
              id
              user { id mobile nickname }
            }
            company_users_total: company_users_aggregate {
              aggregate { count }
            }
            company_users_admin: company_users_aggregate(where: { role: { _eq: "admin" } }) {
              aggregate { count }
            }
            company_users_regular: company_users_aggregate(where: { role: { _eq: "user" } }) {
              aggregate { count }
            }
          }
          companies_aggregate(where: $where) { aggregate { count } }
        }
      `;
      const res = await client.execute({
        query,
        variables: { limit, offset, order_by: orderByCompanies, where },
      }) as {
        companies?: CompanyRow[];
        companies_aggregate?: { aggregate?: { count?: number } };
      };
      const companies = res?.companies ?? [];
      const total = res?.companies_aggregate?.aggregate?.count ?? 0;
      return NextResponse.json({ companies, total });
    }

    const keyword = sanitizeSearchKeyword(qParam);
    const cuWhere: Record<string, unknown> = {
      user_users: { _eq: uid },
      role: { _eq: "admin" },
    };
    if (keyword) {
      cuWhere.company = { name: { _ilike: `%${keyword}%` } };
    }

    const query = `
      query MyCompanies($limit: Int!, $offset: Int!, $order_by: [company_users_order_by!]!, $where: company_users_bool_exp!) {
        company_users(
          where: $where
          limit: $limit
          offset: $offset
          order_by: $order_by
        ) {
          company {
            id
            name
            logo_url
            wx_scan_code
            company_users(where: { role: { _eq: "admin" } }) {
              id
              user { id mobile nickname }
            }
            company_users_total: company_users_aggregate {
              aggregate { count }
            }
            company_users_admin: company_users_aggregate(where: { role: { _eq: "admin" } }) {
              aggregate { count }
            }
            company_users_regular: company_users_aggregate(where: { role: { _eq: "user" } }) {
              aggregate { count }
            }
          }
        }
        company_users_aggregate(where: $where) {
          aggregate { count }
        }
      }
    `;
    const res = await client.execute({
      query,
      variables: { limit, offset, order_by: orderByCompanyUsers, where: cuWhere },
    }) as {
      company_users?: { company: CompanyRow }[];
      company_users_aggregate?: { aggregate?: { count?: number } };
    };
    const rows = res?.company_users ?? [];
    const companies = rows.map((r) => r.company).filter((c) => c != null);
    const total = res?.company_users_aggregate?.aggregate?.count ?? 0;
    return NextResponse.json({ companies, total });
  } catch (e: unknown) {
    console.error("admin companies", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * 创建公司（仅平台管理员）
 * POST /api/admin/companies
 * Body: { name, logo_url?, description?, contact_code?, wechat_code?, resource_file_url? }
 */
export async function POST(req: NextRequest) {
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

    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "公司名称不能为空" }, { status: 400 });
    }

    const client = getHasuraClient();
    const insertInput: Record<string, unknown> = {
      name,
      logo_url: body.logo_url ?? null,
      description: body.description ?? null,
      contact_code: body.contact_code ?? null,
      wechat_code: body.wechat_code ?? null,
      resource_file_url: body.resource_file_url ?? null,
      banner_top: body.banner_top ?? [],
      banner_bottom: body.banner_bottom ?? [],
      hidden_category_ids: body.hidden_category_ids ?? [],
      hidden_product_ids: body.hidden_product_ids ?? [],
      hidden_package_ids: body.hidden_package_ids ?? [],
    };
    const mutation = `
      mutation CreateCompany($company: companies_insert_input!) {
        insert_companies_one(object: $company) {
          id name logo_url created_at
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { company: insertInput },
    }) as { insert_companies_one?: { id: number; name: string; logo_url?: string | null; created_at: string } };
    const company = res?.insert_companies_one;
    if (!company) {
      return NextResponse.json({ error: "创建失败" }, { status: 500 });
    }
    return NextResponse.json(company);
  } catch (e: unknown) {
    console.error("admin companies POST", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
