import { NextRequest, NextResponse } from "next/server";
import { normalizeCompanyUserPermissionsStorage } from "@/app/api/admin/lib/leadAuth";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../lib/auth";

const LEVEL_VALUES = ["A", "B", "C", "D", "E"];

/**
 * PATCH /api/admin/company/users/[id]
 * Body: { role?, level?, can_view_price?, price_factor?, permissions? }
 * permissions: string（如 track_lead、admin_lead&track_lead）、null 或 "" 表示清空
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "无效的用户 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetCompanyUserCompany($id: bigint!) {
      company_users_by_pk(id: $id) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { id } });
  const companyId = (fetchRes as { company_users_by_pk?: { company_companies?: number } })?.company_users_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的 JSON" }, { status: 400 });
  }

  const set: Record<string, unknown> = {};
  if (body.role === "admin" || body.role === "user") set.role = body.role;
  if (body.level && LEVEL_VALUES.includes(String(body.level))) set.level = body.level;
  if (typeof body.can_view_price === "boolean") set.can_view_price = body.can_view_price;
  if (body.price_factor != null) {
    const v = Number(body.price_factor);
    if (!Number.isNaN(v) && v > 0) set.price_factor = v;
  }
  if ("permissions" in body) {
    set.permissions = normalizeCompanyUserPermissionsStorage(body.permissions);
  }
  if (Object.keys(set).length === 0) {
    return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
  }

  try {
    const mutation = `
      mutation UpdateCompanyUser($id: bigint!, $set: company_users_set_input!) {
        update_company_users_by_pk(pk_columns: { id: $id }, _set: $set) {
          id
          role
          level
          can_view_price
          price_factor
          permissions
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { id, set },
    });
    const updated = (res as { update_company_users_by_pk?: unknown })?.update_company_users_by_pk;
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin company user patch", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/company/users/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "无效的用户 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetCompanyUserCompany($id: bigint!) {
      company_users_by_pk(id: $id) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { id } });
  const companyId = (fetchRes as { company_users_by_pk?: { company_companies?: number } })?.company_users_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const mutation = `
      mutation DeleteCompanyUser($id: bigint!) {
        delete_company_users_by_pk(id: $id) {
          id
        }
      }
    `;
    await client.execute({ query: mutation, variables: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("admin company user delete", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
