import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { requireCompanyAccess } from "../../lib/auth";

/** GET /api/admin/company/orders?companyId=&orderStatus=&paymentStatus=&keyword=&limit=&offset= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = Number(searchParams.get("companyId") ?? 0);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return NextResponse.json({ error: "缺少或无效的 companyId" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  const orderStatus = searchParams.get("orderStatus") || undefined;
  const paymentStatus = searchParams.get("paymentStatus") || undefined;
  const keyword = searchParams.get("keyword")?.trim() || undefined;
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

  const hasKeyword = !!keyword;
  const searchPattern = hasKeyword ? `%${keyword}%` : "";
  const searchId = hasKeyword && /^\d+$/.test(keyword!) ? Number(keyword!) : null;

  const variables: Record<string, unknown> = { companyId, limit, offset };
  if (orderStatus) variables.orderStatus = orderStatus;
  if (paymentStatus) variables.paymentStatus = paymentStatus;
  if (hasKeyword) {
    variables.searchPattern = searchPattern;
    if (searchId != null) variables.searchId = searchId;
  }

  const conditions = ["company_companies: { _eq: $companyId }"];
  if (orderStatus) conditions.push("order_status: { _eq: $orderStatus }");
  if (paymentStatus) conditions.push("payment_status: { _eq: $paymentStatus }");

  const varDecls = ["$companyId: bigint!", "$limit: Int", "$offset: Int"];
  if (orderStatus) varDecls.push("$orderStatus: String");
  if (paymentStatus) varDecls.push("$paymentStatus: String");
  if (hasKeyword) {
    varDecls.push("$searchPattern: String");
    if (searchId != null) varDecls.push("$searchId: bigint");
  }

  let whereClause: string;
  if (hasKeyword) {
    const base = conditions.join(", ");
    const orParts = [
      searchId != null ? "{ id: { _eq: $searchId } }" : "",
      "{ receiver_name: { _ilike: $searchPattern } }",
      "{ receiver_phone: { _ilike: $searchPattern } }",
      "{ user: { mobile: { _ilike: $searchPattern } } }",
    ].filter(Boolean);
    whereClause = `_and: [{ ${base} }, { _or: [ ${orParts.join(", ")} ] }]`;
  } else {
    whereClause = conditions.join(", ");
  }

  const query = `query GetOrderList(${varDecls.join(", ")}) {
    orders(where: { ${whereClause} }, limit: $limit, offset: $offset, order_by: { created_at: desc }) {
      id order_status payment_status total_price total_amount actual_amount price_factor remark created_at updated_at
      user { id mobile nickname avatar_url }
      order_items { id product_name product_image_url product_price quantity remark }
    }
    orders_aggregate(where: { ${whereClause} }) { aggregate { count } }
  }`;

  try {
    const client = getHasuraClient();
    const res = await client.execute({ query, variables });
    const data = res as { orders?: unknown[]; orders_aggregate?: { aggregate?: { count?: number } } };
    return NextResponse.json({
      orders: data?.orders ?? [],
      total: data?.orders_aggregate?.aggregate?.count ?? 0,
    });
  } catch (e: unknown) {
    console.error("admin orders list", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
