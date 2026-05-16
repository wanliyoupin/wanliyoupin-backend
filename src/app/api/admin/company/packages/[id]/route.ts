import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../lib/auth";

const PACKAGE_DETAIL_FIELDS = `
  id
  name
  cover_image_url
  description
  tags
  category_categories
  company_companies
  is_shelved
  sort_order
  created_at
  updated_at
  category {
    id
    name
    category { id name category { id name } }
  }
  package_product_skus(order_by: [{ sort_order: asc }, { id: asc }]) {
    id
    quantity
    sort_order
    product_sku {
      id
      name
      price
      image_url
      product { id name cover_image_url }
    }
  }
`;

/**
 * GET /api/admin/company/packages/[id]
 * 获取套餐详情（编辑用）
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const packageId = Number(id);
  if (!Number.isInteger(packageId) || packageId <= 0) {
    return NextResponse.json({ error: "无效的套餐 ID" }, { status: 400 });
  }

  try {
    const client = getHasuraClient();
    const query = `
      query GetPackageDetail($packageId: bigint!) {
        packages_by_pk(id: $packageId) {
          ${PACKAGE_DETAIL_FIELDS}
        }
      }
    `;
    const res = await client.execute({
      query,
      variables: { packageId },
    });
    const pkg = (res as { packages_by_pk?: { company_companies?: number } })?.packages_by_pk;
    if (!pkg) return NextResponse.json(null);
    const companyId = pkg.company_companies;
    if (companyId != null) {
      const access = await requireCompanyAccess(req, companyId);
      if (access !== true) return access;
    }
    return NextResponse.json(pkg);
  } catch (e: unknown) {
    console.error("admin package detail", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/company/packages/[id]
 * Body: name?, cover_image_url?, description?, category_categories?, tags?, is_shelved?, sort_order?
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const packageId = Number(id);
  if (!Number.isInteger(packageId) || packageId <= 0) {
    return NextResponse.json({ error: "无效的套餐 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetPackageCompany($packageId: bigint!) {
      packages_by_pk(id: $packageId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { packageId } });
  const companyId = (fetchRes as { packages_by_pk?: { company_companies?: number } })?.packages_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "套餐不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const body = await req.json();
    const payload: Record<string, unknown> = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.cover_image_url !== undefined) payload.cover_image_url = String(body.cover_image_url).trim();
    if (body.description !== undefined) payload.description = body.description;
    if (body.category_categories !== undefined)
      payload.category_categories = body.category_categories != null ? Number(body.category_categories) : null;
    if (body.tags !== undefined) payload.tags = body.tags;
    if (body.is_shelved !== undefined) payload.is_shelved = Boolean(body.is_shelved);
    if (body.sort_order !== undefined) payload.sort_order = Number(body.sort_order);

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
    }

    const mutation = `
      mutation UpdatePackage($packageId: bigint!, $package: packages_set_input!) {
        update_packages_by_pk(pk_columns: { id: $packageId }, _set: $package) {
          id
          name
          updated_at
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { packageId, package: payload },
    });
    const updated = (res as { update_packages_by_pk?: unknown })?.update_packages_by_pk;
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin packages update", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/company/packages/[id]
 * 先删 package_product_skus 再删套餐主记录
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const packageId = Number(id);
  if (!Number.isInteger(packageId) || packageId <= 0) {
    return NextResponse.json({ error: "无效的套餐 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetPackageCompany($packageId: bigint!) {
      packages_by_pk(id: $packageId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { packageId } });
  const companyId = (fetchRes as { packages_by_pk?: { company_companies?: number } })?.packages_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "套餐不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const listQuery = `
      query ListPackageProductSkus($packageId: bigint!) {
        package_product_skus(where: { package_packages: { _eq: $packageId } }, limit: 5000) {
          id
        }
      }
    `;
    const listRes = await client.execute({
      query: listQuery,
      variables: { packageId },
    });
    const skuRows = (listRes as { package_product_skus?: { id: number }[] })?.package_product_skus ?? [];
    for (const row of skuRows) {
      await client.execute({
        query: `mutation DeletePackageSku($skuId: bigint!) {
          delete_package_product_skus_by_pk(id: $skuId) { id }
        }`,
        variables: { skuId: row.id },
      });
    }
    const mutation = `
      mutation DeletePackage($packageId: bigint!) {
        delete_packages_by_pk(id: $packageId) {
          id
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { packageId },
    });
    const deleted = (res as { delete_packages_by_pk?: unknown })?.delete_packages_by_pk;
    return NextResponse.json(deleted);
  } catch (e: unknown) {
    console.error("admin packages delete", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
