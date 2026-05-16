import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { requireCompanyAccess } from "../../../lib/auth";

/**
 * 按手机号精确搜索用户（公司管理员添加用户时使用，需有该公司权限）
 * GET /api/admin/company/users/search-by-mobile?mobile=13800138000&companyId=1
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mobile = (searchParams.get("mobile") ?? "").trim();
  const companyId = Number(searchParams.get("companyId") ?? 0);

  if (mobile.length !== 11) {
    return NextResponse.json({ error: "请填写 11 位手机号" }, { status: 400 });
  }
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return NextResponse.json({ error: "缺少或无效的 companyId" }, { status: 400 });
  }

  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  try {
    const client = getHasuraClient();
    const query = `
      query SearchUserByMobile($mobile: String!) {
        users(where: { mobile: { _eq: $mobile } }, limit: 1) {
          id mobile nickname avatar_url
        }
      }
    `;
    const res = await client.execute({ query, variables: { mobile } }) as {
      users?: { id: number; mobile?: string | null; nickname?: string | null; avatar_url?: string | null }[];
    };
    const user = res?.users?.[0] ?? null;
    return NextResponse.json(user);
  } catch (e: unknown) {
    console.error("company users search-by-mobile", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
