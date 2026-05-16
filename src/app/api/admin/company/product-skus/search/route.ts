import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "@/app/api/admin/lib/auth";

/**
 * GET /api/admin/company/product-skus/search
 * Query: companyId, keyword?, defaultCompanyId?, limit?, offset?
 * 用于套餐编辑时搜索商品规格（当前公司 + 可选系统公司）
 */
export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const companyIdParam = searchParams.get("companyId");
  const keyword = searchParams.get("keyword")?.trim();
  const defaultCompanyIdParam = searchParams.get("defaultCompanyId");
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const offset = Number(searchParams.get("offset")) || 0;

  if (!companyIdParam) {
    return NextResponse.json({ error: "缺少 companyId" }, { status: 400 });
  }
  const companyId = Number(companyIdParam);
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  const companyIds = [companyId];
  const defaultCompanyId = defaultCompanyIdParam ? Number(defaultCompanyIdParam) : null;
  if (defaultCompanyId != null && defaultCompanyId !== companyId) {
    companyIds.push(defaultCompanyId);
  }

  const hasKeyword = (keyword ?? "").length > 0;
  const pattern = hasKeyword ? `%${keyword}%` : "%";

  try {
    const client = getHasuraClient();
    const whereCompany =
      companyIds.length === 1
        ? `{ company_companies: { _eq: $companyId } }`
        : `{ _or: [ { company_companies: { _eq: $companyId } }, { company_companies: { _eq: $defaultCompanyId } } ] }`;
    const whereName = hasKeyword ? `{ name: { _ilike: $pattern } }` : "";
    const whereConditions = [
      "{ is_deleted: { _eq: false } }",
      whereCompany,
      ...(whereName ? [whereName] : []),
    ];

    const query = `
      query SearchProductsWithSkus(
        $companyId: bigint!
        ${companyIds.length > 1 ? ", $defaultCompanyId: bigint!" : ""}
        ${hasKeyword ? ", $pattern: String!" : ""}
        $limit: Int!
        $offset: Int!
      ) {
        products(
          where: { _and: [ ${whereConditions.join(", ")} ] }
          limit: $limit
          offset: $offset
          order_by: [{ sort_order: asc }, { created_at: desc }]
        ) {
          id
          name
          product_skus(where: { is_deleted: { _eq: false } }, order_by: [{ sort_order: asc }, { id: asc }]) {
            id
            name
            image_url
            price
            stock
          }
        }
        products_aggregate(
          where: { _and: [ ${whereConditions.join(", ")} ] }
        ) {
          aggregate { count }
        }
      }
    `;

    const variables: Record<string, unknown> = {
      companyId,
      limit,
      offset,
    };
    if (companyIds.length > 1) variables.defaultCompanyId = defaultCompanyId;
    if (hasKeyword) variables.pattern = pattern;

    const res = await client.execute({ query, variables });
    const products = (res as { products?: Array<{ id: number; name: string; product_skus: Array<{ id: number; name: string; image_url?: string; price: number; stock?: number }> }> })?.products ?? [];
    const total = (res as { products_aggregate?: { aggregate?: { count?: number } } })?.products_aggregate?.aggregate?.count ?? 0;

    const skus: Array<{ id: number; name: string; price: number; image_url?: string; product?: { name: string } }> = [];
    for (const p of products) {
      for (const s of p.product_skus ?? []) {
        skus.push({
          id: s.id,
          name: s.name,
          price: s.price,
          image_url: s.image_url,
          product: { name: p.name },
        });
      }
    }

    return NextResponse.json({ skus, products, total, count: products.length });
  } catch (e: unknown) {
    console.error("admin product-skus search", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
