import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../lib/auth";

/**
 * GET /api/admin/company/[companyId]
 * 返回公司详情（用于公司设置表单）
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const companyId = Number((await params).companyId);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return NextResponse.json({ error: "无效的公司 ID" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const client = getHasuraClient();
    const query = `
      query GetCompanyDetail($companyId: bigint!) {
        companies_by_pk(id: $companyId) {
          id
          name
          logo_url
          banner_top
          banner_bottom
          description
          contact_code
          wechat_code
          wx_scan_code
          resource_file_url
          default_for_can_view_price
          default_for_price_factor
          mode_for_price
          hidden_category_ids
          hidden_product_ids
          hidden_package_ids
        }
      }
    `;
    const res = await client.execute({ query, variables: { companyId } });
    const company = (res as { companies_by_pk?: unknown })?.companies_by_pk;
    if (!company) return NextResponse.json({ error: "公司不存在" }, { status: 404 });
    return NextResponse.json(company);
  } catch (e: unknown) {
    console.error("admin company get", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/company/[companyId]
 * Body: 可选 hidden_category_ids?, hidden_product_ids?, hidden_package_ids?
 *       或公司设置: name?, logo_url?, banner_top?, banner_bottom?, description?,
 *       contact_code?, wechat_code?, resource_file_url?, default_for_can_view_price?, default_for_price_factor?
 * 用于更新隐藏列表或公司设置
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { companyId: companyIdStr } = await params;
  const companyId = Number(companyIdStr);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return NextResponse.json({ error: "无效的公司 ID" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const body = await req.json();
    const payload: Record<string, unknown> = {};
    if (body.hidden_category_ids !== undefined) {
      payload.hidden_category_ids = Array.isArray(body.hidden_category_ids)
        ? body.hidden_category_ids.map((id: unknown) => Number(id))
        : [];
    }
    if (body.hidden_product_ids !== undefined) {
      payload.hidden_product_ids = Array.isArray(body.hidden_product_ids)
        ? body.hidden_product_ids.map((id: unknown) => Number(id))
        : [];
    }
    if (body.hidden_package_ids !== undefined) {
      payload.hidden_package_ids = Array.isArray(body.hidden_package_ids)
        ? body.hidden_package_ids.map((id: unknown) => Number(id))
        : [];
    }
    if (body.name !== undefined) payload.name = String(body.name);
    if (body.logo_url !== undefined) payload.logo_url = body.logo_url == null ? null : String(body.logo_url);
    if (body.banner_top !== undefined) payload.banner_top = Array.isArray(body.banner_top) ? body.banner_top : [];
    if (body.banner_bottom !== undefined) payload.banner_bottom = Array.isArray(body.banner_bottom) ? body.banner_bottom : [];
    if (body.description !== undefined) payload.description = body.description == null ? null : String(body.description);
    if (body.contact_code !== undefined) payload.contact_code = body.contact_code == null ? null : String(body.contact_code);
    if (body.wechat_code !== undefined) payload.wechat_code = body.wechat_code == null ? null : String(body.wechat_code);
    if (body.resource_file_url !== undefined) payload.resource_file_url = body.resource_file_url == null ? null : String(body.resource_file_url);
    if (body.default_for_can_view_price !== undefined) payload.default_for_can_view_price = Boolean(body.default_for_can_view_price);
    if (body.default_for_price_factor !== undefined) {
      const v = Number(body.default_for_price_factor);
      payload.default_for_price_factor = Number.isNaN(v) ? 1 : v;
    }
    const modeRaw = body.mode_for_price;
    if (modeRaw !== undefined) {
      const m = String(modeRaw).trim().toLowerCase();
      if (m === "company" || m === "user") {
        payload.mode_for_price = m;
      }
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
    }

    const client = getHasuraClient();
    const mutation = `
      mutation UpdateCompany($companyId: bigint!, $company: companies_set_input!) {
        update_companies_by_pk(pk_columns: { id: $companyId }, _set: $company) {
          id
          name
          logo_url
          hidden_category_ids
          hidden_product_ids
          hidden_package_ids
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { companyId, company: payload },
    });
    const updated = (res as { update_companies_by_pk?: unknown })?.update_companies_by_pk;
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin company update", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
