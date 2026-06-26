import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../../../lib/auth";
import { copyPackageById } from "@/app/lib/copyCatalog";

/**
 * POST /api/admin/company/packages/[id]/copy
 * Body（可选）: { category_categories?: number | null }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const packageId = Number(id);
  if (!Number.isInteger(packageId) || packageId <= 0) {
    return NextResponse.json({ error: "无效的套餐 ID" }, { status: 400 });
  }

  const client = getHasuraClient();
  const fetchRes = await client.execute({
    query: `query GetPackageCompany($packageId: bigint!) {
      packages_by_pk(id: $packageId) { company_companies }
    }`,
    variables: { packageId },
  });
  const row = (fetchRes as { packages_by_pk?: { company_companies?: number } })?.packages_by_pk;
  if (!row?.company_companies) {
    return NextResponse.json({ error: "套餐不存在" }, { status: 404 });
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

    const copied = await copyPackageById(packageId, options);
    return NextResponse.json(copied);
  } catch (e: unknown) {
    console.error("admin package copy", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "复制失败" },
      { status: 500 }
    );
  }
}
