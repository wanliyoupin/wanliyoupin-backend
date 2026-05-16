/**
 * 前端导出 Excel（商品/套餐等），Web 端生成 Blob 后触发下载
 */
import * as XLSX from "xlsx";

function getCategoryPath(cat: { name?: string; category?: unknown } | null | undefined): string {
  if (!cat?.name) return "未分类";
  const parts: string[] = [];
  let c: { name?: string; category?: unknown } | null | undefined = cat;
  while (c?.name) {
    parts.unshift(String(c.name).trim());
    c = c.category as { name?: string; category?: unknown } | null | undefined;
  }
  return parts.length ? parts.join(" / ") : "未分类";
}

function formatMedias(medias: unknown): string {
  if (!Array.isArray(medias) || medias.length === 0) return "";
  return medias
    .map((m: unknown) => {
      const item = m as { file_url?: string; url?: string; file_type?: string; type?: string };
      const url = item?.file_url ?? item?.url ?? "";
      const type = item?.file_type ?? item?.type ?? "image";
      return url ? `${type}: ${url}` : "";
    })
    .filter(Boolean)
    .join("; ");
}

export function productsToSummaryRows(products: unknown[]): (string | number)[][] {
  const header = [
    "商品ID",
    "公司ID",
    "商品名称",
    "分类路径",
    "封面图URL",
    "描述",
    "详情媒体(多)",
    "场景媒体(多)",
    "规格数",
    "上架状态",
    "标签",
    "创建时间",
    "更新时间",
  ];
  const rows: (string | number)[][] = [header];
  for (const p of products) {
    const item = p as {
      id?: number;
      _companyId?: number;
      name?: string;
      category?: { name?: string; category?: unknown };
      cover_image_url?: string;
      description?: string;
      detail_medias?: unknown;
      scene_medias?: unknown;
      product_skus?: unknown[];
      is_shelved?: boolean;
      tags?: string;
      created_at?: string;
      updated_at?: string;
    };
    const skuCount = item.product_skus?.length ?? 0;
    const status = item.is_shelved === false ? "已上架" : "已下架";
    rows.push([
      item.id ?? "",
      item._companyId ?? "",
      item.name ?? "",
      getCategoryPath(item.category),
      item.cover_image_url ?? "",
      (item.description ?? "").replace(/\r?\n/g, " "),
      formatMedias(item.detail_medias),
      formatMedias(item.scene_medias),
      skuCount,
      status,
      item.tags ?? "",
      item.created_at ?? "",
      item.updated_at ?? "",
    ]);
  }
  return rows;
}

export function productsToSkuDetailRows(products: unknown[]): (string | number)[][] {
  const header = [
    "商品ID",
    "公司ID",
    "商品名称",
    "分类路径",
    "规格ID",
    "规格名称",
    "价格",
    "库存",
    "规格上架状态",
    "规格图片URL",
  ];
  const rows: (string | number)[][] = [header];
  for (const p of products) {
    const item = p as {
      id?: number;
      _companyId?: number;
      name?: string;
      category?: { name?: string; category?: unknown };
      product_skus?: { id?: number; name?: string; price?: number; stock?: number; is_shelved?: boolean; image_url?: string }[];
    };
    const skus = item.product_skus ?? [];
    const categoryPath = getCategoryPath(item.category);
    if (skus.length === 0) {
      rows.push([item.id ?? "", item._companyId ?? "", item.name ?? "", categoryPath, "", "", "", "", "", "", ""]);
      continue;
    }
    for (const sku of skus) {
      const skuStatus = sku.is_shelved === false ? "已上架" : "已下架";
      rows.push([
        item.id ?? "",
        item._companyId ?? "",
        item.name ?? "",
        categoryPath,
        sku.id ?? "",
        sku.name ?? "",
        sku.price ?? "",
        sku.stock ?? "",
        skuStatus,
        sku.image_url ?? "",
      ]);
    }
  }
  return rows;
}

export function buildExcelBufferSheets(
  sheets: { name: string; rows: (string | number)[][] }[]
): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  for (const { name, rows } of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, name);
  }
  return XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
}

/**
 * 导出商品列表为 Excel 并触发浏览器下载（含规格明细 + 商品概要）
 */
export function downloadProductsExcel(products: unknown[]): void {
  const skuRows = productsToSkuDetailRows(products);
  const summaryRows = productsToSummaryRows(products);
  const buffer = buildExcelBufferSheets([
    { name: "规格明细", rows: skuRows },
    { name: "商品列表", rows: summaryRows },
  ]);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `商品导出_${Date.now()}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

/** 套餐概要行 */
export function packagesToSummaryRows(packages: unknown[]): (string | number)[][] {
  const header = [
    "套餐ID",
    "公司ID",
    "套餐名称",
    "分类路径",
    "封面图URL",
    "描述",
    "包含商品数",
    "上架状态",
    "标签",
    "创建时间",
    "更新时间",
  ];
  const rows: (string | number)[][] = [header];
  for (const p of packages) {
    const item = p as {
      id?: number;
      _companyId?: number;
      company_companies?: number;
      name?: string;
      category?: { name?: string; category?: unknown };
      cover_image_url?: string;
      description?: string;
      package_product_skus?: unknown[];
      is_shelved?: boolean;
      tags?: string;
      created_at?: string;
      updated_at?: string;
    };
    const skuCount = item.package_product_skus?.length ?? 0;
    const status = item.is_shelved === false ? "已上架" : "已下架";
    rows.push([
      item.id ?? "",
      item._companyId ?? item.company_companies ?? "",
      item.name ?? "",
      getCategoryPath(item.category),
      item.cover_image_url ?? "",
      (item.description ?? "").replace(/\r?\n/g, " "),
      skuCount,
      status,
      item.tags ?? "",
      item.created_at ?? "",
      item.updated_at ?? "",
    ]);
  }
  return rows;
}

/** 套餐包含商品明细行 */
export function packagesToSkuDetailRows(packages: unknown[]): (string | number)[][] {
  const header = [
    "套餐ID",
    "公司ID",
    "套餐名称",
    "分类路径",
    "规格ID",
    "规格名称",
    "单价",
    "数量",
    "排序值",
  ];
  const rows: (string | number)[][] = [header];
  for (const p of packages) {
    const item = p as {
      id?: number;
      _companyId?: number;
      company_companies?: number;
      name?: string;
      category?: { name?: string; category?: unknown };
      package_product_skus?: { id?: number; quantity?: number; sort_order?: number; product_sku?: { id?: number; name?: string; price?: number } }[];
    };
    const skus = item.package_product_skus ?? [];
    const categoryPath = getCategoryPath(item.category);
    const companyId = item._companyId ?? item.company_companies ?? "";
    if (skus.length === 0) {
      rows.push([item.id ?? "", companyId, item.name ?? "", categoryPath, "", "", "", "", ""]);
      continue;
    }
    for (const sku of skus) {
      const ps = sku.product_sku;
      rows.push([
        item.id ?? "",
        companyId,
        item.name ?? "",
        categoryPath,
        ps?.id ?? "",
        ps?.name ?? "",
        ps?.price ?? "",
        sku.quantity ?? "",
        sku.sort_order ?? "",
      ]);
    }
  }
  return rows;
}

/**
 * 导出套餐列表为 Excel 并触发浏览器下载（含包含明细 + 套餐概要）
 */
export function downloadPackagesExcel(packages: unknown[]): void {
  const skuRows = packagesToSkuDetailRows(packages);
  const summaryRows = packagesToSummaryRows(packages);
  const buffer = buildExcelBufferSheets([
    { name: "包含明细", rows: skuRows },
    { name: "套餐列表", rows: summaryRows },
  ]);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `套餐导出_${Date.now()}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
