import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../lib/auth";

/**
 * GET /api/admin/company/categories/[id]
 * 获取单条分类详情（编辑用）
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json({ error: "无效的分类 ID" }, { status: 400 });
  }

  try {
    const client = getHasuraClient();
    const query = `
      query GetCategoryDetail($categoryId: bigint!) {
        categories_by_pk(id: $categoryId) {
          id
          name
          icon_url
          parent_categories
          level
          route_ui_style
          sort_order
          type
          company_companies
        }
      }
    `;
    const res = await client.execute({
      query,
      variables: { categoryId },
    });
    const category = (res as { categories_by_pk?: { company_companies?: number } & Record<string, unknown> })?.categories_by_pk;
    if (!category) return NextResponse.json(null);
    const companyId = category.company_companies;
    if (companyId != null) {
      const access = await requireCompanyAccess(req, companyId);
      if (access !== true) return access;
    }
    const { company_companies: _, ...rest } = category;
    return NextResponse.json(rest);
  } catch (e: unknown) {
    console.error("admin category detail", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/company/categories/[id]
 * Body: { name?, icon_url?, parent_categories?, level?, route_ui_style?, sort_order?, type? }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json({ error: "无效的分类 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetCategoryCompany($categoryId: bigint!) {
      categories_by_pk(id: $categoryId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { categoryId } });
  const companyId = (fetchRes as { categories_by_pk?: { company_companies?: number } })?.categories_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "分类不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const body = await req.json();
    const payload: Record<string, unknown> = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.icon_url !== undefined) payload.icon_url = String(body.icon_url).trim();
    if (body.parent_categories !== undefined)
      payload.parent_categories = body.parent_categories != null ? Number(body.parent_categories) : null;
    if (body.level !== undefined) payload.level = Number(body.level);
    if (body.route_ui_style !== undefined)
      payload.route_ui_style = body.route_ui_style === "products" ? "products" : "categories";
    if (body.sort_order !== undefined) payload.sort_order = Number(body.sort_order);
    if (body.type !== undefined) payload.type = body.type === "package" ? "package" : "product";

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "没有可更新的字段" }, { status: 400 });
    }

    const mutation = `
      mutation UpdateCategory($categoryId: bigint!, $category: categories_set_input!) {
        update_categories_by_pk(pk_columns: { id: $categoryId }, _set: $category) {
          id
          name
          icon_url
          updated_at
          type
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { categoryId, category: payload },
    });
    const updated = (res as { update_categories_by_pk?: unknown })?.update_categories_by_pk;
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin categories update", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/company/categories/[id]
 * 软删除：is_deleted = true
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json({ error: "无效的分类 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetCategoryCompany($categoryId: bigint!) {
      categories_by_pk(id: $categoryId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { categoryId } });
  const companyId = (fetchRes as { categories_by_pk?: { company_companies?: number } })?.categories_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "分类不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const mutation = `
      mutation DeleteCategory($categoryId: bigint!) {
        update_categories_by_pk(
          pk_columns: { id: $categoryId }
          _set: { is_deleted: true }
        ) {
          id
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { categoryId },
    });
    const deleted = (res as { update_categories_by_pk?: unknown })?.update_categories_by_pk;
    return NextResponse.json(deleted);
  } catch (e: unknown) {
    console.error("admin categories delete", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
