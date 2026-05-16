import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "../../lib/auth";

/**
 * POST /api/admin/company/product-skus
 * Body: product_products, company_companies, name, image_url?, price, stock, sort_order?, is_shelved?
 */
export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const {
      product_products,
      company_companies,
      name,
      image_url,
      price,
      stock,
      sort_order,
      is_shelved,
    } = body;

    if (!product_products || !company_companies || !name || price == null || stock == null) {
      return NextResponse.json(
        { error: "缺少必填字段：product_products, company_companies, name, price, stock" },
        { status: 400 }
      );
    }

    const companyId = Number(company_companies);
    const access = await requireCompanyAccess(req, companyId);
    if (access !== true) return access;

    const client = getHasuraClient();
    const skuData: Record<string, unknown> = {
      product_products: Number(product_products),
      company_companies: companyId,
      name: String(name).trim(),
      price: Number(price),
      stock: Number(stock),
      is_shelved: is_shelved ?? false,
    };
    if (image_url != null) skuData.image_url = String(image_url).trim();
    if (sort_order != null) skuData.sort_order = Number(sort_order);

    const mutation = `
      mutation CreateProductSku($sku: product_skus_insert_input!) {
        insert_product_skus_one(object: $sku) {
          id
          name
          price
          stock
          image_url
          sort_order
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { sku: skuData },
    });
    const inserted = (res as { insert_product_skus_one?: unknown })?.insert_product_skus_one;
    return NextResponse.json(inserted);
  } catch (e: unknown) {
    console.error("admin product-skus create", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
