import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";

/**
 * 平台管理员数据看板
 * GET /api/admin/dashboard/stats
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const payload = HasuraJwtToken.verifyToken(token);
    const claims = payload?.["https://hasura.io/jwt/claims"] as { "x-hasura-default-role"?: string } | undefined;
    if (claims?.["x-hasura-default-role"] !== "admin") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const client = getHasuraClient();
    const query = `
      query AdminDashboardStats {
        companies_aggregate { aggregate { count } }
        users_aggregate { aggregate { count } }
        orders_aggregate(where: { is_deleted: { _eq: false } }) {
          aggregate { count }
        }
        orders_sum: orders_aggregate(
          where: { is_deleted: { _eq: false }, payment_status: { _eq: "approved" } }
        ) {
          aggregate { sum { actual_amount } }
        }
        orders_pending: orders_aggregate(
          where: { is_deleted: { _eq: false }, order_status: { _eq: "pending" } }
        ) { aggregate { count } }
        orders_confirmed: orders_aggregate(
          where: { is_deleted: { _eq: false }, order_status: { _eq: "confirmed" } }
        ) { aggregate { count } }
        orders_completed: orders_aggregate(
          where: { is_deleted: { _eq: false }, order_status: { _eq: "completed" } }
        ) { aggregate { count } }
      }
    `;
    const res = await client.execute({ query }) as {
      companies_aggregate?: { aggregate?: { count?: number } };
      users_aggregate?: { aggregate?: { count?: number } };
      orders_aggregate?: { aggregate?: { count?: number } };
      orders_sum?: { aggregate?: { sum?: { actual_amount?: number } } };
      orders_pending?: { aggregate?: { count?: number } };
      orders_confirmed?: { aggregate?: { count?: number } };
      orders_completed?: { aggregate?: { count?: number } };
    };

    return NextResponse.json({
      companiesCount: res?.companies_aggregate?.aggregate?.count ?? 0,
      usersCount: res?.users_aggregate?.aggregate?.count ?? 0,
      ordersCount: res?.orders_aggregate?.aggregate?.count ?? 0,
      ordersAmount: Number(res?.orders_sum?.aggregate?.sum?.actual_amount ?? 0) || 0,
      ordersPending: res?.orders_pending?.aggregate?.count ?? 0,
      ordersConfirmed: res?.orders_confirmed?.aggregate?.count ?? 0,
      ordersCompleted: res?.orders_completed?.aggregate?.count ?? 0,
    });
  } catch (e: unknown) {
    console.error("admin dashboard stats", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
