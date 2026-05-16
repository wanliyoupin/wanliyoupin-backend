import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../lib/auth";

/**
 * POST /api/admin/company/package-product-skus
 * Body: package_packages, product_sku_product_skus, quantity, sort_order?
 */
export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { package_packages, product_sku_product_skus, quantity, sort_order } = body;

    if (!package_packages || !product_sku_product_skus || quantity == null) {
      return NextResponse.json(
        { error: "缺少必填字段：package_packages, product_sku_product_skus, quantity" },
        { status: 400 }
      );
    }

    const packageId = Number(package_packages);
    const client = getHasuraClient();

    const fetchQuery = `
      query GetPackageCompany($packageId: bigint!) {
        packages_by_pk(id: $packageId) { company_companies }
      }
    `;
    const fetchRes = await client.execute({ query: fetchQuery, variables: { packageId } });
    const companyId = (fetchRes as { packages_by_pk?: { company_companies?: number } })?.packages_by_pk?.company_companies;
    if (companyId == null) {
      return NextResponse.json({ error: "套餐不存在" }, { status: 404 });
    }
    const access = await requireCompanyAccess(req, companyId);
    if (access !== true) return access;

    const skuData: Record<string, unknown> = {
      package_packages: packageId,
      product_sku_product_skus: Number(product_sku_product_skus),
      quantity: Number(quantity),
    };
    if (sort_order != null) skuData.sort_order = Number(sort_order);

    const mutation = `
      mutation AddPackageSku($sku: package_product_skus_insert_input!) {
        insert_package_product_skus_one(object: $sku) {
          id
          quantity
          sort_order
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { sku: skuData },
    });
    const inserted = (res as { insert_package_product_skus_one?: unknown })?.insert_package_product_skus_one;
    return NextResponse.json(inserted);
  } catch (e: unknown) {
    console.error("admin package-product-skus create", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
