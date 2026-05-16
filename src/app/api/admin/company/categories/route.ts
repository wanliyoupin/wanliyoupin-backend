import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { requireCompanyCatalogMergeAccess, requireCompanyAccess } from "../../lib/auth";

/** 树节点字段（不含聚合；聚合在根级二次查询，避免深层嵌套里 $companyIds 未生效导致左侧数字与列表不一致） */
const TREE_CORE = `
  id
  name
  icon_url
  parent_categories
  level
  route_ui_style
  sort_order
  type
  company_companies
`;

const TREE_FIELDS = `
  ${TREE_CORE}
  categories(
    where: { is_deleted: { _eq: false } }
    order_by: { sort_order: asc }
  ) {
    ${TREE_CORE}
    categories(
      where: { is_deleted: { _eq: false } }
      order_by: { sort_order: asc }
    ) {
      ${TREE_CORE}
    }
  }
`;

type AggRow = {
  id: number;
  products_aggregate?: { aggregate?: { count?: number } | null } | null;
  products_listed_aggregate?: { aggregate?: { count?: number } | null } | null;
  packages_aggregate?: { aggregate?: { count?: number } | null } | null;
};

function collectCategoryIds(nodes: unknown[]): number[] {
  const ids: number[] = [];
  const walk = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    const o = n as { id?: unknown; categories?: unknown[] };
    if (typeof o.id === "number" && Number.isFinite(o.id)) ids.push(o.id);
    if (Array.isArray(o.categories)) o.categories.forEach(walk);
  };
  nodes.forEach(walk);
  return [...new Set(ids)];
}

function mergeAggregatesIntoTree(nodes: unknown[], map: Map<number, AggRow>): void {
  const walk = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    const o = n as Record<string, unknown> & { id?: number; categories?: unknown[] };
    if (typeof o.id === "number") {
      const row = map.get(o.id);
      if (row) {
        o.products_aggregate = row.products_aggregate;
        o.products_listed_aggregate = row.products_listed_aggregate;
        o.packages_aggregate = row.packages_aggregate;
      }
    }
    if (Array.isArray(o.categories)) o.categories.forEach(walk);
  };
  nodes.forEach(walk);
}

/**
 * GET /api/admin/company/categories
 * Query: companyIds=1,2&currentCompanyId=1&type=product|package
 * 可选: productCountCompanyIds=1 — 仅用于商品/套餐数量聚合；不传则与 companyIds 一致（兼容旧行为）。
 * 用于「分类树展示当前+总部全部分类，但数量只统计本公司商品」等场景。
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyIdsStr = searchParams.get("companyIds");
  const currentCompanyIdStr = searchParams.get("currentCompanyId");
  const type = searchParams.get("type") as "product" | "package" | null;
  const productCountCompanyIdsStr = searchParams.get("productCountCompanyIds");

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

  const allowedForAggregate = new Set(allCompanyIds);
  let aggregateCompanyIds: number[];
  if (productCountCompanyIdsStr != null && String(productCountCompanyIdsStr).trim() !== "") {
    aggregateCompanyIds = productCountCompanyIdsStr
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n) && n > 0);
    if (aggregateCompanyIds.length === 0) {
      return NextResponse.json({ error: "无效的 productCountCompanyIds" }, { status: 400 });
    }
    if (!aggregateCompanyIds.every((id) => allowedForAggregate.has(id))) {
      return NextResponse.json(
        { error: "productCountCompanyIds 须为当前请求公司范围内的子集" },
        { status: 400 }
      );
    }
  } else {
    aggregateCompanyIds = companyIds;
  }

  try {
    const client = getHasuraClient();
    const treeQuery = `
      query GetCategoryTreeMulti($companyIds: [bigint!]!, $hiddenForCompanyId: bigint!${type ? ", $type: String!" : ""}) {
        company: companies_by_pk(id: $hiddenForCompanyId) { hidden_category_ids }
        categories(
          where: {
            company_companies: { _in: $companyIds }
            is_deleted: { _eq: false }
            parent_categories: { _is_null: true }
            ${type ? "type: { _eq: $type }" : ""}
          }
          order_by: { sort_order: asc }
        ) {
          ${TREE_FIELDS}
        }
      }
    `;
    const variables: Record<string, unknown> = {
      companyIds,
      hiddenForCompanyId: currentCompanyId,
    };
    if (type) variables.type = type;

    const res = await client.execute({ query: treeQuery, variables });
    const data = res as {
      company?: { hidden_category_ids?: (string | number)[] | null } | null;
      categories?: unknown[];
    };
    const hidden = data?.company?.hidden_category_ids;
    const hiddenCategoryIds = Array.isArray(hidden) ? hidden.map((id) => Number(id)) : [];
    const categories = (data?.categories ?? []) as unknown[];

    const ids = collectCategoryIds(categories);
    if (ids.length > 0) {
      const aggQuery = `
        query CategoryAggregates($aggregateCompanyIds: [bigint!]!, $categoryIds: [bigint!]!) {
          categories(where: { id: { _in: $categoryIds } }) {
            id
            products_aggregate(
              where: {
                _and: [
                  { is_deleted: { _eq: false } }
                  { company_companies: { _in: $aggregateCompanyIds } }
                ]
              }
            ) {
              aggregate { count }
            }
            products_listed_aggregate: products_aggregate(
              where: {
                _and: [
                  { is_deleted: { _eq: false } }
                  { is_shelved: { _eq: false } }
                  { company_companies: { _in: $aggregateCompanyIds } }
                ]
              }
            ) {
              aggregate { count }
            }
            packages_aggregate(where: { company_companies: { _in: $aggregateCompanyIds } }) {
              aggregate { count }
            }
          }
        }
      `;
      const aggRes = await client.execute({
        query: aggQuery,
        variables: { aggregateCompanyIds, categoryIds: ids },
      });
      const rows = (aggRes as { categories?: AggRow[] })?.categories ?? [];
      const map = new Map(rows.map((r) => [r.id, r]));
      mergeAggregatesIntoTree(categories, map);
    }

    return NextResponse.json({ categories, hiddenCategoryIds });
  } catch (e: unknown) {
    console.error("admin categories list", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/company/categories
 * Body: { companyId, name, icon_url, parent_categories?, level, route_ui_style, sort_order, type }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyId,
      name,
      icon_url,
      parent_categories,
      level,
      route_ui_style,
      sort_order,
      type,
    } = body;
    if (!companyId || !name || !icon_url || level == null || !route_ui_style || sort_order == null || !type) {
      return NextResponse.json(
        { error: "缺少必填字段：companyId, name, icon_url, level, route_ui_style, sort_order, type" },
        { status: 400 }
      );
    }
    const cid = Number(companyId);
    const access = await requireCompanyAccess(req, cid);
    if (access !== true) return access;

    const client = getHasuraClient();
    const mutation = `
      mutation CreateCategory($category: categories_insert_input!) {
        insert_categories_one(object: $category) {
          id
          name
          icon_url
          level
          sort_order
          type
        }
      }
    `;
    const category = {
      name: String(name).trim(),
      icon_url: String(icon_url).trim(),
      company_companies: Number(companyId),
      parent_categories: parent_categories != null ? Number(parent_categories) : null,
      level: Number(level),
      route_ui_style: route_ui_style === "products" ? "products" : "categories",
      sort_order: Number(sort_order),
      type: type === "package" ? "package" : "product",
    };
    const res = await client.execute({ query: mutation, variables: { category } });
    const inserted = (res as { insert_categories_one?: unknown })?.insert_categories_one;
    return NextResponse.json(inserted);
  } catch (e: unknown) {
    console.error("admin categories create", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
