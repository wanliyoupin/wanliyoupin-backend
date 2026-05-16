import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../lib/auth";

/**
 * PATCH /api/admin/company/product-skus/[id]
 * Body: name?, image_url?, price?, stock?, sort_order?, is_shelved?
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const skuId = Number(id);
  if (!Number.isInteger(skuId) || skuId <= 0) {
    return NextResponse.json({ error: "无效的规格 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetSkuCompany($skuId: bigint!) {
      product_skus_by_pk(id: $skuId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { skuId } });
  const companyId = (fetchRes as { product_skus_by_pk?: { company_companies?: number } })?.product_skus_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "规格不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const body = await req.json();
    const payload: Record<string, unknown> = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.image_url !== undefined) payload.image_url = body.image_url ? String(body.image_url).trim() : null;
    if (body.price !== undefined) payload.price = Number(body.price);
    if (body.stock !== undefined) payload.stock = Number(body.stock);
    if (body.sort_order !== undefined) payload.sort_order = Number(body.sort_order);
    if (body.is_shelved !== undefined) payload.is_shelved = Boolean(body.is_shelved);

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
    }

    const mutation = `
      mutation UpdateProductSku($skuId: bigint!, $sku: product_skus_set_input!) {
        update_product_skus_by_pk(pk_columns: { id: $skuId }, _set: $sku) {
          id
          name
          price
          stock
          updated_at
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { skuId, sku: payload },
    });
    const updated = (res as { update_product_skus_by_pk?: unknown })?.update_product_skus_by_pk;
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin product-skus update", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/company/product-skus/[id]
 * 软删除：is_deleted = true
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const skuId = Number(id);
  if (!Number.isInteger(skuId) || skuId <= 0) {
    return NextResponse.json({ error: "无效的规格 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetSkuCompany($skuId: bigint!) {
      product_skus_by_pk(id: $skuId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { skuId } });
  const companyId = (fetchRes as { product_skus_by_pk?: { company_companies?: number } })?.product_skus_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "规格不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const mutation = `
      mutation DeleteProductSku($skuId: bigint!) {
        update_product_skus_by_pk(
          pk_columns: { id: $skuId }
          _set: { is_deleted: true }
        ) {
          id
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { skuId },
    });
    const deleted = (res as { update_product_skus_by_pk?: unknown })?.update_product_skus_by_pk;
    return NextResponse.json(deleted);
  } catch (e: unknown) {
    console.error("admin product-skus delete", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
