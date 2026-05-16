import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../lib/auth";

const PRODUCT_DETAIL_FIELDS = `
  id
  name
  cover_image_url
  description
  tags
  detail_medias
  scene_medias
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
  product_skus(where: { is_deleted: { _eq: false } }, order_by: [{ sort_order: asc }, { id: asc }]) {
    id
    name
    image_url
    price
    stock
    is_shelved
    sort_order
  }
`;

/**
 * GET /api/admin/company/products/[id]
 * 获取商品详情（编辑用）
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "无效的商品 ID" }, { status: 400 });
  }

  try {
    const client = getHasuraClient();
    const query = `
      query GetProductDetail($productId: bigint!) {
        products_by_pk(id: $productId) {
          ${PRODUCT_DETAIL_FIELDS}
        }
      }
    `;
    const res = await client.execute({
      query,
      variables: { productId },
    });
    const product = (res as { products_by_pk?: { company_companies?: number } })?.products_by_pk;
    if (!product) return NextResponse.json(null);
    const companyId = product.company_companies;
    if (companyId != null) {
      const access = await requireCompanyAccess(req, companyId);
      if (access !== true) return access;
    }
    return NextResponse.json(product);
  } catch (e: unknown) {
    console.error("admin product detail", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/company/products/[id]
 * Body: 同小程序 updateProduct 可更新字段，含 is_shelved 上下架
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "无效的商品 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetProductCompany($productId: bigint!) {
      products_by_pk(id: $productId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { productId } });
  const companyId = (fetchRes as { products_by_pk?: { company_companies?: number } })?.products_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const body = await req.json();
    const payload: Record<string, unknown> = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.cover_image_url !== undefined) payload.cover_image_url = String(body.cover_image_url).trim();
    if (body.description !== undefined) payload.description = body.description;
    if (body.tags !== undefined) payload.tags = body.tags;
    if (body.category_categories !== undefined)
      payload.category_categories = body.category_categories != null ? Number(body.category_categories) : null;
    if (body.is_shelved !== undefined) payload.is_shelved = Boolean(body.is_shelved);
    if (body.sort_order !== undefined) payload.sort_order = Number(body.sort_order);
    if (body.detail_medias !== undefined)
      payload.detail_medias = Array.isArray(body.detail_medias) ? body.detail_medias : [];
    if (body.scene_medias !== undefined)
      payload.scene_medias = Array.isArray(body.scene_medias) ? body.scene_medias : [];

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
    }

    const mutation = `
      mutation UpdateProduct($productId: bigint!, $product: products_set_input!) {
        update_products_by_pk(pk_columns: { id: $productId }, _set: $product) {
          id
          name
          updated_at
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { productId, product: payload },
    });
    const updated = (res as { update_products_by_pk?: unknown })?.update_products_by_pk;
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin products update", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/company/products/[id]
 * 软删除：is_deleted = true
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "无效的商品 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetProductCompany($productId: bigint!) {
      products_by_pk(id: $productId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { productId } });
  const companyId = (fetchRes as { products_by_pk?: { company_companies?: number } })?.products_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const mutation = `
      mutation DeleteProduct($productId: bigint!) {
        update_products_by_pk(
          pk_columns: { id: $productId }
          _set: { is_deleted: true }
        ) {
          id
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { productId },
    });
    const deleted = (res as { update_products_by_pk?: unknown })?.update_products_by_pk;
    return NextResponse.json(deleted);
  } catch (e: unknown) {
    console.error("admin products delete", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
