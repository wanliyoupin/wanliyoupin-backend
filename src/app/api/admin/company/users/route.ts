import { NextRequest, NextResponse } from "next/server";
import { normalizeCompanyUserPermissionsStorage } from "@/app/api/admin/lib/leadAuth";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../lib/auth";

const LEVEL_VALUES = ["A", "B", "C", "D", "E"] as const;

/**
 * GET /api/admin/company/users
 * Query: companyId, role? (admin|user|wx_guest_user), level?, keyword?, limit?, offset?, forLeadAssignee?
 * - admin|user：company_users.role
 * - wx_guest_user：关联 users.role（微信访客；须已有 company_users 行才会出现）
 * - forLeadAssignee=1：线索分配跟进人用；排除微信访客、按昵称/手机号排序，limit 默认 500、上限 500
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = Number(searchParams.get("companyId") ?? 0);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return NextResponse.json({ error: "缺少或无效的 companyId" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;
  const forLeadAssignee = searchParams.get("forLeadAssignee") === "1";
  const roleParam = searchParams.get("role");
  const companyRoleFilter = roleParam === "admin" || roleParam === "user" ? roleParam : undefined;
  const filterPlatformGuest = roleParam === "wx_guest_user";
  const level = searchParams.get("level");
  const levelFilter = level && LEVEL_VALUES.includes(level as (typeof LEVEL_VALUES)[number]) ? level : undefined;
  const keyword = searchParams.get("keyword")?.trim() || undefined;
  const limit = forLeadAssignee
    ? Math.min(Math.max(Number(searchParams.get("limit")) || 500, 1), 500)
    : Math.min(Number(searchParams.get("limit")) || 20, 100);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

  const andParts: string[] = ["{ company_companies: { _eq: $companyId } }"];
  const variables: Record<string, unknown> = { companyId, limit, offset };
  const varDecls = ["$companyId: bigint!", "$limit: Int", "$offset: Int"];

  if (companyRoleFilter) {
    andParts.push("{ role: { _eq: $companyRole } }");
    variables.companyRole = companyRoleFilter;
    varDecls.push("$companyRole: String!");
  }
  if (levelFilter) {
    andParts.push("{ level: { _eq: $level } }");
    variables.level = levelFilter;
    varDecls.push("$level: String!");
  }

  const userPredicates: string[] = [];
  if (filterPlatformGuest) {
    userPredicates.push("{ role: { _eq: $userPlatformRole } }");
    variables.userPlatformRole = "wx_guest_user";
    varDecls.push("$userPlatformRole: String!");
  }
  if (keyword) {
    variables.keywordPattern = `%${keyword}%`;
    varDecls.push("$keywordPattern: String!");
    userPredicates.push(
      "{ _or: [ { nickname: { _ilike: $keywordPattern } }, { mobile: { _ilike: $keywordPattern } } ] }"
    );
  }
  if (userPredicates.length === 1) {
    andParts.push(`{ user: ${userPredicates[0]} }`);
  } else if (userPredicates.length > 1) {
    andParts.push(`{ user: { _and: [ ${userPredicates.join(", ")} ] } }`);
  }

  if (forLeadAssignee) {
    andParts.push('{ user: { _not: { role: { _eq: "wx_guest_user" } } } }');
  }

  const whereBody = `{ _and: [ ${andParts.join(", ")} ] }`;

  const orderByClause = forLeadAssignee
    ? "[{ user: { nickname: asc_nulls_last } }, { user: { mobile: asc } }, { id: asc }]"
    : "{ created_at: desc }";

  const query = `
    query GetCompanyUserList(${varDecls.join(", ")}) {
      company_users(
        where: ${whereBody}
        limit: $limit
        offset: $offset
        order_by: ${orderByClause}
      ) {
        id
        role
        level
        can_view_price
        price_factor
        permissions
        created_at
        user {
          id
          mobile
          nickname
          avatar_url
          role
        }
      }
      company_users_aggregate(where: ${whereBody}) {
        aggregate { count }
      }
    }
  `;

  try {
    const client = getHasuraClient();
    const res = await client.execute({ query, variables });
    const data = res as {
      company_users?: unknown[];
      company_users_aggregate?: { aggregate?: { count?: number } };
    };
    return NextResponse.json({
      users: data?.company_users ?? [],
      total: data?.company_users_aggregate?.aggregate?.count ?? 0,
    });
  } catch (e: unknown) {
    console.error("admin company users list", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/company/users
 * Body: { companyId, mobile, role?, level?, can_view_price?, price_factor?, permissions? }
 * 按手机号查找或创建用户，并加入公司（若已在则更新角色/等级等）
 */
export async function POST(req: NextRequest) {
  let body: {
    companyId?: number;
    mobile?: string;
    role?: string;
    level?: string;
    can_view_price?: boolean;
    price_factor?: number;
    permissions?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的 JSON" }, { status: 400 });
  }
  const companyId = body.companyId != null ? Number(body.companyId) : NaN;
  const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
  if (!Number.isInteger(companyId) || companyId <= 0 || mobile.length !== 11) {
    return NextResponse.json({ error: "缺少或无效的 companyId / mobile（需 11 位）" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  const role = body.role === "admin" || body.role === "user" ? body.role : "user";
  const level = body.level && ["A", "B", "C", "D", "E"].includes(body.level) ? body.level : "A";
  const can_view_price = typeof body.can_view_price === "boolean" ? body.can_view_price : true;
  const price_factor = body.price_factor != null && !Number.isNaN(Number(body.price_factor)) && Number(body.price_factor) > 0
    ? Number(body.price_factor) : 1;
  const permissionsPatch =
    "permissions" in body ? normalizeCompanyUserPermissionsStorage(body.permissions) : undefined;

  try {
    const client = getHasuraClient();
    const searchQuery = `
      query SearchUserByMobile($mobile: String!) {
        users(where: { mobile: { _eq: $mobile } }, limit: 1) {
          id
        }
      }
    `;
    const searchRes = await client.execute({ query: searchQuery, variables: { mobile } });
    let userId: number | undefined = (searchRes as { users?: { id: number }[] })?.users?.[0]?.id;
    if (!userId) {
      const createMutation = `
        mutation CreateUserByMobile($mobile: String!) {
          insert_users_one(object: { mobile: $mobile, role: "user" }) {
            id
          }
        }
      `;
      const createRes = await client.execute({ query: createMutation, variables: { mobile } });
      userId = (createRes as { insert_users_one?: { id: number } })?.insert_users_one?.id;
      if (!userId) {
        return NextResponse.json({ error: "创建用户失败" }, { status: 500 });
      }
    }
    const insertMutation = `
      mutation AddCompanyUser($object: company_users_insert_input!) {
        insert_company_users_one(
          object: $object
          on_conflict: {
            constraint: company_users_company_companies_user_users_key
            update_columns: [role, level, can_view_price, price_factor, permissions]
          }
        ) {
          id
          role
          level
          can_view_price
          price_factor
          permissions
          user { id mobile nickname }
        }
      }
    `;
    const insertRes = await client.execute({
      query: insertMutation,
      variables: {
        object: {
          user_users: userId,
          company_companies: companyId,
          role,
          level,
          can_view_price,
          price_factor,
          ...(permissionsPatch !== undefined ? { permissions: permissionsPatch } : {}),
        },
      },
    });
    const row = (insertRes as { insert_company_users_one?: unknown })?.insert_company_users_one;
    return NextResponse.json(row);
  } catch (e: unknown) {
    console.error("admin company user add", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
