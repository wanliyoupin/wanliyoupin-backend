import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { requireCompanyCatalogMergeAccess, requireCompanyAccess } from "../../lib/auth";

const PRODUCT_LIST_FIELDS = `
  id
  name
  cover_image_url
  description
  tags
  detail_medias
  scene_medias
  category_categories
  is_shelved
  company_companies
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
  company_products(where: { company_companies: { _eq: $hiddenForCompanyId } }, limit: 1) {
    wx_scan_code
  }
`;

/**
 * GET /api/admin/company/products
 * Query: companyIds, currentCompanyId, limit, offset, keyword?, categoryId?, is_shelved? (''|'true'|'false')
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyIdsStr = searchParams.get("companyIds");
  const currentCompanyIdStr = searchParams.get("currentCompanyId");
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const offset = Number(searchParams.get("offset")) || 0;
  const keyword = searchParams.get("keyword")?.trim() || undefined;
  const categoryIdStr = searchParams.get("categoryId");
  const categoryId = categoryIdStr ? Number(categoryIdStr) : undefined;
  const isShelvedParam = searchParams.get("is_shelved"); // '' | 'true' | 'false'

  if (!companyIdsStr || !currentCompanyIdStr) {
    return NextResponse.json(
      { error: "缺少 companyIds 或 currentCompanyId" },
      { status: 400 }
    );
  }
  const companyIds = companyIdsStr.split(",").map((s) => Number(s.trim())).filter(Boolean);
  const currentCompanyId = Number(currentCompanyIdStr);
  if (companyIds.length === 0 || !currentCompanyId) {
    return NextResponse.json({ error: "参数无效" }, { status: 400 });
  }

  const allCompanyIds = [...new Set([...companyIds, currentCompanyId])];
  const access = await requireCompanyCatalogMergeAccess(req, allCompanyIds, currentCompanyId);
  if (access !== true) return access;

  const andParts = [
    "{ company_companies: { _in: $companyIds } }",
    "{ is_deleted: { _eq: false } }",
  ];
  const variables: Record<string, unknown> = {
    companyIds,
    hiddenForCompanyId: currentCompanyId,
    limit,
    offset,
  };
  if (keyword) {
    andParts.push("{ _or: [ { name: { _ilike: $keywordPattern } }, { description: { _ilike: $keywordPattern } } ] }");
    variables.keywordPattern = `%${keyword}%`;
  }
  if (categoryId != null && Number.isInteger(categoryId)) {
    andParts.push("{ category_categories: { _eq: $categoryId } }");
    variables.categoryId = categoryId;
  }
  if (isShelvedParam === "true" || isShelvedParam === "false") {
    andParts.push("{ is_shelved: { _eq: $is_shelved } }");
    variables.is_shelved = isShelvedParam === "true";
  }
  const whereClause = `_and: [ ${andParts.join(", ")} ]`;

  try {
    const client = getHasuraClient();
    const query = `
      query GetProductListMulti($companyIds: [bigint!]!, $hiddenForCompanyId: bigint!, $limit: Int!, $offset: Int!${keyword ? ", $keywordPattern: String!" : ""}${categoryId != null ? ", $categoryId: bigint" : ""}${isShelvedParam === "true" || isShelvedParam === "false" ? ", $is_shelved: Boolean!" : ""}) {
        company: companies_by_pk(id: $hiddenForCompanyId) { hidden_product_ids }
        products(
          where: { ${whereClause} }
          limit: $limit
          offset: $offset
          order_by: [{ sort_order: asc }, { created_at: desc }]
        ) {
          ${PRODUCT_LIST_FIELDS}
        }
        products_aggregate(where: { ${whereClause} }) {
          aggregate { count }
        }
      }
    `;
    const res = await client.execute({
      query,
      variables,
    });
    const data = res as {
      company?: { hidden_product_ids?: (string | number)[] | null } | null;
      products?: unknown[];
      products_aggregate?: { aggregate: { count: number } };
    };
    const hidden = data?.company?.hidden_product_ids;
    const hiddenProductIds = Array.isArray(hidden) ? hidden.map((id) => Number(id)) : [];
    const products = (data?.products ?? []).map((p: unknown) => {
      const row = p as { company_companies?: number; company_products?: { wx_scan_code?: string | null }[] };
      const cp = row?.company_products;
      const wx_scan_code = (Array.isArray(cp) && cp[0]?.wx_scan_code) ? cp[0].wx_scan_code : null;
      const { company_products: _, ...rest } = row as Record<string, unknown>;
      return { ...rest, _companyId: row?.company_companies, wx_scan_code };
    });
    const total = data?.products_aggregate?.aggregate?.count ?? 0;
    return NextResponse.json({ products, total, hiddenProductIds });
  } catch (e: unknown) {
    console.error("admin products list", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/company/products
 * Body: 同小程序 createProduct 入参
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company_companies,
      name,
      cover_image_url,
      description,
      tags,
      category_categories,
      is_shelved,
      sort_order,
      detail_medias,
      scene_medias,
    } = body;
    if (!company_companies || !name || !cover_image_url) {
      return NextResponse.json(
        { error: "缺少必填字段：company_companies, name, cover_image_url" },
        { status: 400 }
      );
    }
    const companyId = Number(company_companies);
    const access = await requireCompanyAccess(req, companyId);
    if (access !== true) return access;

    const client = getHasuraClient();
    const productData: Record<string, unknown> = {
      name: String(name).trim(),
      cover_image_url: String(cover_image_url).trim(),
      company_companies: Number(company_companies),
      is_shelved: is_shelved ?? false,
      detail_medias: Array.isArray(detail_medias) ? detail_medias : [],
      scene_medias: Array.isArray(scene_medias) ? scene_medias : [],
    };
    if (description != null) productData.description = description;
    if (tags != null) productData.tags = tags;
    if (category_categories != null) productData.category_categories = Number(category_categories);
    if (sort_order != null) productData.sort_order = Number(sort_order);

    const mutation = `
      mutation CreateProduct($product: products_insert_input!) {
        insert_products_one(object: $product) {
          id
          name
          cover_image_url
          created_at
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { product: productData },
    });
    const inserted = (res as { insert_products_one?: unknown })?.insert_products_one;
    return NextResponse.json(inserted);
  } catch (e: unknown) {
    console.error("admin products create", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
