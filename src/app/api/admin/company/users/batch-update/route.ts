import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { requireCompanyAccess } from "../../../lib/auth";

const LEVEL_VALUES = ["A", "B", "C", "D", "E"] as const;

/**
 * POST /api/admin/company/users/batch-update
 * Body: { companyId, level, updates: { can_view_price?, price_factor? } }
 * 按等级批量更新公司用户（显隐价格 或 价格系数）
 */
export async function POST(req: NextRequest) {
  let body: { companyId?: number; level?: string; updates?: { can_view_price?: boolean; price_factor?: number } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的 JSON" }, { status: 400 });
  }
  const companyId = body.companyId != null ? Number(body.companyId) : NaN;
  const level = body.level && LEVEL_VALUES.includes(body.level as (typeof LEVEL_VALUES)[number]) ? body.level : undefined;
  const updates = body.updates ?? {};

  if (!Number.isInteger(companyId) || companyId <= 0 || !level) {
    return NextResponse.json({ error: "缺少或无效的 companyId / level" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  const set: Record<string, unknown> = {};
  if (updates.can_view_price !== undefined) set.can_view_price = updates.can_view_price;
  if (updates.price_factor !== undefined) {
    const v = Number(updates.price_factor);
    if (Number.isNaN(v) || v <= 0) {
      return NextResponse.json({ error: "价格系数必须大于 0" }, { status: 400 });
    }
    set.price_factor = v;
  }
  if (Object.keys(set).length === 0) {
    return NextResponse.json({ updated: 0 });
  }

  try {
    const client = getHasuraClient();
    const listQuery = `
      query ListCompanyUserIdsByLevel($companyId: bigint!, $level: String!) {
        company_users(
          where: {
            company_companies: { _eq: $companyId }
            level: { _eq: $level }
          }
        ) {
          id
        }
      }
    `;
    const listRes = await client.execute<{ company_users: Array<{ id: number }> }>({
      query: listQuery,
      variables: { companyId, level },
    });
    const ids = (listRes?.company_users ?? []).map((r) => r.id);

    const updateMutation = `
      mutation BatchUpdateCompanyUsers($ids: [bigint!]!, $updates: company_users_set_input!) {
        update_company_users(
          where: { id: { _in: $ids } }
          _set: $updates
        ) {
          affected_rows
        }
      }
    `;
    const updateRes = await client.execute({
      query: updateMutation,
      variables: { ids, updates: set },
    });
    const affected = (updateRes as { update_company_users?: { affected_rows?: number } })?.update_company_users?.affected_rows ?? 0;
    return NextResponse.json({ updated: affected });
  } catch (e: unknown) {
    console.error("admin company users batch-update", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
