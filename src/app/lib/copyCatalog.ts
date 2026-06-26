import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

type ProductSkuRow = {
  name: string;
  image_url?: string | null;
  price: number;
  stock: number;
  is_shelved?: boolean;
  sort_order?: number;
};

type ProductRow = {
  id: number;
  name: string;
  cover_image_url: string;
  description?: string | null;
  tags?: unknown;
  detail_medias?: unknown;
  scene_medias?: unknown;
  category_categories?: number | null;
  company_companies: number;
  sort_order?: number | null;
  product_skus?: ProductSkuRow[];
};

type PackageSkuRow = {
  quantity: number;
  sort_order?: number;
  product_sku?: { id: number };
};

type PackageRow = {
  id: number;
  name: string;
  cover_image_url: string;
  description?: string | null;
  tags?: unknown;
  category_categories?: number | null;
  company_companies: number;
  sort_order?: number | null;
  package_product_skus?: PackageSkuRow[];
};

function copyName(name: string): string {
  const base = String(name).trim();
  return base.endsWith("(副本)") ? `${base}2` : `${base} (副本)`;
}

export async function copyProductById(
  productId: number,
  options?: { category_categories?: number | null }
): Promise<{ id: number; name: string }> {
  const client = getHasuraClient();
  const query = `
    query GetProductForCopy($productId: bigint!) {
      products_by_pk(id: $productId) {
        id
        name
        cover_image_url
        description
        tags
        detail_medias
        scene_medias
        category_categories
        company_companies
        sort_order
        product_skus(where: { is_deleted: { _eq: false } }, order_by: [{ sort_order: asc }, { id: asc }]) {
          name
          image_url
          price
          stock
          is_shelved
          sort_order
        }
      }
    }
  `;
  const res = await client.execute({ query, variables: { productId } });
  const src = (res as { products_by_pk?: ProductRow | null })?.products_by_pk;
  if (!src) throw new Error("商品不存在");

  const companyId = src.company_companies;
  const category =
    options && "category_categories" in options
      ? options.category_categories
      : src.category_categories;

  const productInput: Record<string, unknown> = {
    name: copyName(src.name),
    cover_image_url: src.cover_image_url,
    company_companies: companyId,
    is_shelved: false,
    is_deleted: false,
    detail_medias: Array.isArray(src.detail_medias) ? src.detail_medias : [],
    scene_medias: Array.isArray(src.scene_medias) ? src.scene_medias : [],
  };
  if (src.description != null) productInput.description = src.description;
  if (src.tags != null) productInput.tags = src.tags;
  if (category != null) productInput.category_categories = Number(category);
  if (src.sort_order != null) productInput.sort_order = Number(src.sort_order);

  const skus = src.product_skus ?? [];
  if (skus.length > 0) {
    productInput.product_skus = {
      data: skus.map((sku) => ({
        company_companies: companyId,
        name: sku.name,
        price: Number(sku.price),
        stock: Number(sku.stock),
        is_shelved: sku.is_shelved ?? false,
        ...(sku.image_url != null ? { image_url: sku.image_url } : {}),
        ...(sku.sort_order != null ? { sort_order: Number(sku.sort_order) } : {}),
      })),
    };
  }

  const mutation = `
    mutation CopyProduct($product: products_insert_input!) {
      insert_products_one(object: $product) {
        id
        name
      }
    }
  `;
  const insertRes = await client.execute({
    query: mutation,
    variables: { product: productInput },
  });
  const inserted = (insertRes as { insert_products_one?: { id: number; name: string } })?.insert_products_one;
  if (!inserted?.id) throw new Error("复制失败");
  return inserted;
}

export async function copyPackageById(
  packageId: number,
  options?: { category_categories?: number | null }
): Promise<{ id: number; name: string }> {
  const client = getHasuraClient();
  const query = `
    query GetPackageForCopy($packageId: bigint!) {
      packages_by_pk(id: $packageId) {
        id
        name
        cover_image_url
        description
        tags
        category_categories
        company_companies
        sort_order
        package_product_skus(order_by: [{ sort_order: asc }, { id: asc }]) {
          quantity
          sort_order
          product_sku { id }
        }
      }
    }
  `;
  const res = await client.execute({ query, variables: { packageId } });
  const src = (res as { packages_by_pk?: PackageRow | null })?.packages_by_pk;
  if (!src) throw new Error("套餐不存在");

  const companyId = src.company_companies;
  const category =
    options && "category_categories" in options
      ? options.category_categories
      : src.category_categories;

  const packageInput: Record<string, unknown> = {
    name: copyName(src.name),
    cover_image_url: src.cover_image_url,
    company_companies: companyId,
    is_shelved: false,
    description: src.description ?? null,
    tags: src.tags ?? null,
  };
  if (category != null) packageInput.category_categories = Number(category);
  if (src.sort_order != null) packageInput.sort_order = Number(src.sort_order);

  const items = (src.package_product_skus ?? []).filter((row) => row.product_sku?.id);
  if (items.length > 0) {
    packageInput.package_product_skus = {
      data: items.map((row) => ({
        product_sku_product_skus: Number(row.product_sku!.id),
        quantity: Number(row.quantity),
        ...(row.sort_order != null ? { sort_order: Number(row.sort_order) } : {}),
      })),
    };
  }

  const mutation = `
    mutation CopyPackage($package: packages_insert_input!) {
      insert_packages_one(object: $package) {
        id
        name
      }
    }
  `;
  const insertRes = await client.execute({
    query: mutation,
    variables: { package: packageInput },
  });
  const inserted = (insertRes as { insert_packages_one?: { id: number; name: string } })?.insert_packages_one;
  if (!inserted?.id) throw new Error("复制失败");
  return inserted;
}
