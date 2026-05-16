import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { requireCompanyAccess } from "../../../lib/auth";

/**
 * 公司数据看板
 * GET /api/admin/company/dashboard/stats?companyId=
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = Number(searchParams.get("companyId") ?? 0);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return NextResponse.json({ error: "缺少或无效的 companyId" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const client = getHasuraClient();
    const query = `
      query CompanyDashboardStats($companyId: bigint!) {
        company_users_aggregate(where: { company_companies: { _eq: $companyId } }) {
          aggregate { count }
        }
        orders_aggregate(where: { company_companies: { _eq: $companyId }, is_deleted: { _eq: false } }) {
          aggregate { count }
        }
        orders_sum: orders_aggregate(
          where: {
            company_companies: { _eq: $companyId }
            is_deleted: { _eq: false }
            payment_status: { _eq: "approved" }
          }
        ) {
          aggregate { sum { actual_amount } }
        }
        orders_pending: orders_aggregate(
          where: { company_companies: { _eq: $companyId }, is_deleted: { _eq: false }, order_status: { _eq: "pending" } }
        ) {
          aggregate { count }
        }
        orders_confirmed: orders_aggregate(
          where: { company_companies: { _eq: $companyId }, is_deleted: { _eq: false }, order_status: { _eq: "confirmed" } }
        ) {
          aggregate { count }
        }
        orders_completed: orders_aggregate(
          where: { company_companies: { _eq: $companyId }, is_deleted: { _eq: false }, order_status: { _eq: "completed" } }
        ) {
          aggregate { count }
        }
      }
    `;
    const res = await client.execute({ query, variables: { companyId } }) as {
      company_users_aggregate?: { aggregate?: { count?: number } };
      orders_aggregate?: { aggregate?: { count?: number } };
      orders_sum?: { aggregate?: { sum?: { actual_amount?: number } } };
      orders_pending?: { aggregate?: { count?: number } };
      orders_confirmed?: { aggregate?: { count?: number } };
      orders_completed?: { aggregate?: { count?: number } };
    };

    return NextResponse.json({
      usersCount: res?.company_users_aggregate?.aggregate?.count ?? 0,
      ordersCount: res?.orders_aggregate?.aggregate?.count ?? 0,
      ordersAmount: Number(res?.orders_sum?.aggregate?.sum?.actual_amount ?? 0) || 0,
      ordersPending: res?.orders_pending?.aggregate?.count ?? 0,
      ordersConfirmed: res?.orders_confirmed?.aggregate?.count ?? 0,
      ordersCompleted: res?.orders_completed?.aggregate?.count ?? 0,
    });
  } catch (e: unknown) {
    console.error("company dashboard stats", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
