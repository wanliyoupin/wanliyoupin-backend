import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../lib/auth";

/**
 * PATCH /api/admin/company/package-product-skus/[id]
 * Body: quantity?, sort_order?
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
    return NextResponse.json({ error: "无效的 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetPackageSkuCompany($skuId: bigint!) {
      package_product_skus_by_pk(id: $skuId) {
        package { company_companies }
      }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { skuId } });
  const row = (fetchRes as { package_product_skus_by_pk?: { package?: { company_companies?: number } } })?.package_product_skus_by_pk;
  const companyId = row?.package?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const body = await req.json();
    const set: Record<string, number> = {};
    if (body.quantity !== undefined) set.quantity = Number(body.quantity);
    if (body.sort_order !== undefined) set.sort_order = Number(body.sort_order);
    if (Object.keys(set).length === 0) {
      return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
    }

    const mutation = `
      mutation UpdatePackageSku($skuId: bigint!, $set: package_product_skus_set_input!) {
        update_package_product_skus_by_pk(pk_columns: { id: $skuId }, _set: $set) {
          id
          quantity
          sort_order
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { skuId, set },
    });
    const updated = (res as { update_package_product_skus_by_pk?: unknown })?.update_package_product_skus_by_pk;
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin package-product-skus update", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/company/package-product-skus/[id]
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
    return NextResponse.json({ error: "无效的 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetPackageSkuCompany($skuId: bigint!) {
      package_product_skus_by_pk(id: $skuId) {
        package { company_companies }
      }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { skuId } });
  const row = (fetchRes as { package_product_skus_by_pk?: { package?: { company_companies?: number } } })?.package_product_skus_by_pk;
  const companyId = row?.package?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const mutation = `
      mutation DeletePackageSku($skuId: bigint!) {
        delete_package_product_skus_by_pk(id: $skuId) { id }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { skuId },
    });
    const deleted = (res as { delete_package_product_skus_by_pk?: unknown })?.delete_package_product_skus_by_pk;
    return NextResponse.json(deleted);
  } catch (e: unknown) {
    console.error("admin package-product-skus delete", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
