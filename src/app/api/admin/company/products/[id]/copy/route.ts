import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../../lib/auth";
import { copyProductById } from "@/app/lib/copyCatalog";

/**
 * POST /api/admin/company/products/[id]/copy
 * Body（可选）: { category_categories?: number | null }
 */
export async function POST(
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
  const fetchRes = await client.execute({
    query: `query GetProductCompany($productId: bigint!) {
      products_by_pk(id: $productId) { company_companies is_deleted }
    }`,
    variables: { productId },
  });
  const row = (fetchRes as { products_by_pk?: { company_companies?: number; is_deleted?: boolean } })?.products_by_pk;
  if (!row?.company_companies) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }
  if (row.is_deleted) {
    return NextResponse.json({ error: "商品已删除，无法复制" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, row.company_companies);
  if (access !== true) return access;

  try {
    let body: { category_categories?: number | null } = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const options =
      body && "category_categories" in body
        ? { category_categories: body.category_categories ?? null }
        : undefined;

    const copied = await copyProductById(productId, options);
    return NextResponse.json(copied);
  } catch (e: unknown) {
    console.error("admin product copy", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "复制失败" },
      { status: 500 }
    );
  }
}
