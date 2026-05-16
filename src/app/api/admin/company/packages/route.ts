import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { requireCompanyCatalogMergeAccess, requireCompanyAccess } from "../../lib/auth";

const PACKAGE_LIST_FIELDS = `
  id
  name
  cover_image_url
  description
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
  package_product_skus(order_by: [{ sort_order: asc }, { id: asc }]) {
    id
    quantity
    sort_order
    product_sku {
      id
      name
      price
      product { name }
    }
  }
  company_packages(where: { company_companies: { _eq: $hiddenForCompanyId } }, limit: 1) {
    wx_scan_code
  }
`;

/**
 * GET /api/admin/company/packages
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
  const isShelvedParam = searchParams.get("is_shelved");

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

  const andParts = ["{ company_companies: { _in: $companyIds } }"];
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
      query GetPackageListMulti($companyIds: [bigint!]!, $hiddenForCompanyId: bigint!, $limit: Int!, $offset: Int!${keyword ? ", $keywordPattern: String!" : ""}${categoryId != null ? ", $categoryId: bigint" : ""}${isShelvedParam === "true" || isShelvedParam === "false" ? ", $is_shelved: Boolean!" : ""}) {
        company: companies_by_pk(id: $hiddenForCompanyId) { hidden_package_ids }
        packages(
          where: { ${whereClause} }
          limit: $limit
          offset: $offset
          order_by: [{ sort_order: asc }, { created_at: desc }]
        ) {
          ${PACKAGE_LIST_FIELDS}
        }
        packages_aggregate(where: { ${whereClause} }) {
          aggregate { count }
        }
      }
    `;
    const res = await client.execute({
      query,
      variables,
    });
    const data = res as {
      company?: { hidden_package_ids?: (string | number)[] | null } | null;
      packages?: unknown[];
      packages_aggregate?: { aggregate: { count: number } };
    };
    const hidden = data?.company?.hidden_package_ids;
    const hiddenPackageIds = Array.isArray(hidden) ? hidden.map((id) => Number(id)) : [];
    const packages = (data?.packages ?? []).map((p: unknown) => {
      const row = p as { company_companies?: number; company_packages?: { wx_scan_code?: string | null }[] };
      const cp = row?.company_packages;
      const wx_scan_code = (Array.isArray(cp) && cp[0]?.wx_scan_code) ? cp[0].wx_scan_code : null;
      const { company_packages: _, ...rest } = row as Record<string, unknown>;
      return { ...rest, _companyId: row?.company_companies, wx_scan_code };
    });
    const total = data?.packages_aggregate?.aggregate?.count ?? 0;
    return NextResponse.json({ packages, total, hiddenPackageIds });
  } catch (e: unknown) {
    console.error("admin packages list", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/company/packages
 * Body: { company_companies, name, cover_image_url, description?, category_categories?, tags?, is_shelved?, sort_order? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company_companies,
      name,
      cover_image_url,
      description,
      category_categories,
      tags,
      is_shelved,
      sort_order,
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
    const packageData: Record<string, unknown> = {
      name: String(name).trim(),
      cover_image_url: String(cover_image_url).trim(),
      company_companies: Number(company_companies),
      description: description ?? null,
      category_categories: category_categories != null ? Number(category_categories) : null,
      tags: tags ?? null,
      is_shelved: is_shelved ?? false,
    };
    if (sort_order != null) packageData.sort_order = Number(sort_order);

    const mutation = `
      mutation CreatePackage($package: packages_insert_input!) {
        insert_packages_one(object: $package) {
          id
          name
          cover_image_url
          created_at
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { package: packageData },
    });
    const inserted = (res as { insert_packages_one?: unknown })?.insert_packages_one;
    return NextResponse.json(inserted);
  } catch (e: unknown) {
    console.error("admin packages create", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
