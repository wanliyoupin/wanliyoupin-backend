import { NextRequest, NextResponse } from "next/server";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export function getAuthFromRequest(req: NextRequest): { userId: number } | NextResponse {
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
    return { userId: Number(userId) };
  } catch {
    return NextResponse.json({ error: "无效 token" }, { status: 401 });
  }
}

/** 从 JWT 解析出用户角色（平台 admin 或 user） */
function getRoleFromToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  try {
    const payload = HasuraJwtToken.verifyToken(token);
    const claims = payload?.["https://hasura.io/jwt/claims"] as
      | { "x-hasura-default-role"?: string }
      | undefined;
    return claims?.["x-hasura-default-role"] ?? null;
  } catch {
    return null;
  }
}

/**
 * 校验当前用户是否有权访问指定公司
 * 平台管理员可访问任意公司；公司管理员仅可访问自己管理的公司
 * 返回 true 表示有权限，返回 NextResponse 表示无权限需直接返回
 */
export async function requireCompanyAccess(
  req: NextRequest,
  companyId: number
): Promise<true | NextResponse> {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const role = getRoleFromToken(req);
  if (role === "admin") return true;

  const client = getHasuraClient();
  const query = `
    query CheckCompanyAccess($userId: bigint!, $companyId: bigint!) {
      company_users(
        where: {
          user_users: { _eq: $userId }
          company_companies: { _eq: $companyId }
          role: { _eq: "admin" }
        }
        limit: 1
      ) { id }
    }
  `;
  const res = await client.execute({
    query,
    variables: { userId: auth.userId, companyId },
  });
  const rows = (res as { company_users?: { id: number }[] })?.company_users ?? [];
  if (rows.length > 0) return true;
  return NextResponse.json({ error: "无权限访问该公司" }, { status: 403 });
}

/**
 * 校验当前用户是否有权访问多个公司（需对每个公司都有权限）
 */
export async function requireCompaniesAccess(
  req: NextRequest,
  companyIds: number[]
): Promise<true | NextResponse> {
  const unique = [...new Set(companyIds)].filter((id) => id > 0);
  for (const id of unique) {
    const result = await requireCompanyAccess(req, id);
    if (result !== true) return result;
  }
  return true;
}

function parseSystemCompanyIdFromConfigValue(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
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

async function fetchSystemCompanyIdFromConfig(): Promise<number | null> {
  const client = getHasuraClient();
  const res = await client.execute({
    query: `
      query CatalogMergeSystemCompany {
        configs(where: { name: { _eq: "default_company_id" } }, limit: 1) {
          value
        }
      }
    `,
    variables: {},
  });
  const val = (res as { configs?: { value?: unknown }[] })?.configs?.[0]?.value;
  return parseSystemCompanyIdFromConfigValue(val);
}

/**
 * 公司后台「当前公司 + 系统总部商品库」合并查询的鉴权。
 *
 * 原先对 `companyIds` 逐个 `requireCompanyAccess`，会要求公司管理员也必须是**总部公司**的 admin，
 * 导致仅能管理自己公司的成员在拉商品/分类/套餐列表时 403（小程序走 Hasura 无此问题）。
 *
 * 规则：平台管理员放行；否则必须已是 `currentCompanyId` 的公司管理员，且请求中出现的公司 id
 * 只能属于 { 当前公司, config.default_company_id 总部 }。
 */
export async function requireCompanyCatalogMergeAccess(
  req: NextRequest,
  allCompanyIds: number[],
  currentCompanyId: number
): Promise<true | NextResponse> {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  if (getRoleFromToken(req) === "admin") return true;

  if (!Number.isInteger(currentCompanyId) || currentCompanyId <= 0) {
    return NextResponse.json({ error: "参数无效" }, { status: 400 });
  }

  const main = await requireCompanyAccess(req, currentCompanyId);
  if (main !== true) return main;

  const systemId = await fetchSystemCompanyIdFromConfig();
  const allowed = new Set<number>([currentCompanyId]);
  if (systemId != null && systemId > 0) allowed.add(systemId);

  const unique = [...new Set(allCompanyIds.filter((id) => Number.isInteger(id) && id > 0))];
  for (const id of unique) {
    if (!allowed.has(id)) {
      return NextResponse.json(
        { error: "公司范围不合法（仅可查询当前公司与系统配置总部）" },
        { status: 403 }
      );
    }
  }
  return true;
}
