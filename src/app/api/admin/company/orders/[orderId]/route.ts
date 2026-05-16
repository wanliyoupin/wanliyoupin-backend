import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../lib/auth";

/**
 * GET /api/admin/company/orders/[orderId]
 * 订单详情
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const orderId = Number((await params).orderId);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return NextResponse.json({ error: "无效的订单 ID" }, { status: 400 });
  }

  const query = `
    query GetOrderDetail($orderId: bigint!) {
      orders_by_pk(id: $orderId) {
        id
        order_status
        payment_status
        total_price
        total_amount
        actual_amount
        price_factor
        remark
        receiver_name
        receiver_phone
        receiver_address
        created_at
        updated_at
        user { id mobile nickname avatar_url }
        company { id name }
        order_items {
          id
          product_name
          product_image_url
          product_price
          quantity
          remark
        }
      }
    }
  `;

  try {
    const client = getHasuraClient();
    const res = await client.execute({ query, variables: { orderId } });
    const order = (res as { orders_by_pk?: { company?: { id?: number } } })?.orders_by_pk;
    if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    const companyId = order.company?.id;
    if (companyId != null) {
      const access = await requireCompanyAccess(req, companyId);
      if (access !== true) return access;
    }
    return NextResponse.json(order);
  } catch (e: unknown) {
    console.error("admin order detail", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/company/orders/[orderId]
 * Body: { action: "confirm" | "approve_payment" | "complete" | "update_actual", actual_amount?: number }
 * confirm: 确认订单 pending -> confirmed
 * approve_payment: 确认收款，可传 actual_amount
 * complete: 归档（已确认且已支付 -> completed）
 * update_actual: 仅修改实际收款金额
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const orderId = Number((await params).orderId);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return NextResponse.json({ error: "无效的订单 ID" }, { status: 400 });
  }

  let body: { action?: string; actual_amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的 JSON" }, { status: 400 });
  }

  const action = body?.action;
  if (!action) {
    return NextResponse.json({ error: "缺少 action" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchQuery = `
    query GetOrderCompany($orderId: bigint!) {
      orders_by_pk(id: $orderId) { company_companies }
    }
  `;
  const fetchRes = await client.execute({ query: fetchQuery, variables: { orderId } });
  const companyId = (fetchRes as { orders_by_pk?: { company_companies?: number } })?.orders_by_pk?.company_companies;
  if (companyId == null) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;
  const mutation = `
    mutation UpdateOrder($orderId: bigint!, $set: orders_set_input!) {
      update_orders_by_pk(pk_columns: { id: $orderId }, _set: $set) {
        id
        order_status
        payment_status
        actual_amount
        updated_at
      }
    }
  `;

  try {
    let set: Record<string, unknown> = {};
    if (action === "confirm") {
      set = { order_status: "confirmed" };
    } else if (action === "approve_payment") {
      set = { payment_status: "approved" };
      if (body.actual_amount != null && !Number.isNaN(Number(body.actual_amount))) {
        set.actual_amount = Number(body.actual_amount);
      }
    } else if (action === "complete") {
      set = { order_status: "completed" };
    } else if (action === "update_actual") {
      const v = Number(body.actual_amount);
      if (Number.isNaN(v) || v < 0) {
        return NextResponse.json({ error: "无效的 actual_amount" }, { status: 400 });
      }
      set = { actual_amount: v };
    } else {
      return NextResponse.json({ error: "未知 action" }, { status: 400 });
    }

    const res = await client.execute({
      query: mutation,
      variables: { orderId, set },
    });
    const updated = (res as { update_orders_by_pk?: unknown })?.update_orders_by_pk;
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin order patch", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
