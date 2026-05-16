import { NextRequest, NextResponse } from "next/server";
import { WxWxacode } from "@/config-lib/weixin/miniprogram/WxWxacode";
import { QiniuUploader } from "@/config-lib/qiniu/QiniuUploader";
import { qiniuConfig } from "@/config-lib/qiniu/config";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "@/app/api/admin/lib/auth";

const wxacode = new WxWxacode();
const uploader = new QiniuUploader(qiniuConfig);

async function getWxacodeBuffer(
  type: "company" | "product" | "package",
  cid: number,
  id: number | null
): Promise<Buffer> {
  if (type === "company") return wxacode.getCompanyWxacode(cid);
  if (type === "product" && id != null) return wxacode.getProductWxacode(id, cid);
  if (type === "package" && id != null) return wxacode.getPackageWxacode(id, cid);
  throw new Error("无效的 type 或 id");
}

/**
 * POST /api/weixin/wxacode/generate
 * 生成商品/套餐/公司小程序码，上传七牛云，并更新对应表的 wx_scan_code
 * Body: { type: "product"|"package"|"company", companyId: number, productId?: number, packageId?: number }
 */
export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { type, companyId, productId, packageId } = body;

    if (!type || !companyId) {
      return NextResponse.json(
        { error: "缺少 type 或 companyId" },
        { status: 400 }
      );
    }

    const cid = Number(companyId);
    if (!Number.isInteger(cid) || cid <= 0) {
      return NextResponse.json({ error: "无效的 companyId" }, { status: 400 });
    }

    const actualAccess = await requireCompanyAccess(req, cid);
    if (actualAccess !== true) return actualAccess;

    let id: number | null = null;
    let buffer: Buffer | null = null;
    let updateMutation: string;
    let updateVariables: Record<string, unknown>;

    if (type === "company") {
      updateMutation = `
        mutation UpdateCompanyWxacode($companyId: bigint!, $url: String!) {
          update_companies_by_pk(pk_columns: { id: $companyId }, _set: { wx_scan_code: $url }) {
            id
            wx_scan_code
          }
        }
      `;
      updateVariables = { companyId: cid };
    } else if (type === "product") {
      id = Number(productId);
      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ error: "缺少或无效的 productId" }, { status: 400 });
      }
      updateMutation = `
        mutation UpsertCompanyProductWxacode($companyId: bigint!, $productId: bigint!, $url: String!) {
          insert_company_products_one(
            object: {
              company_companies: $companyId
              product_products: $productId
              wx_scan_code: $url
            }
            on_conflict: {
              constraint: company_products_company_companies_product_products_key
              update_columns: [wx_scan_code]
            }
          ) {
            id
            wx_scan_code
          }
        }
      `;
      updateVariables = { companyId: cid, productId: id };
    } else if (type === "package") {
      id = Number(packageId);
      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ error: "缺少或无效的 packageId" }, { status: 400 });
      }
      updateMutation = `
        mutation UpsertCompanyPackageWxacode($companyId: bigint!, $packageId: bigint!, $url: String!) {
          insert_company_packages_one(
            object: {
              company_companies: $companyId
              package_packages: $packageId
              wx_scan_code: $url
            }
            on_conflict: {
              constraint: company_packages_company_companies_package_packages_key
              update_columns: [wx_scan_code]
            }
          ) {
            id
            wx_scan_code
          }
        }
      `;
      updateVariables = { companyId: cid, packageId: id };
    } else {
      return NextResponse.json(
        { error: "type 必须是 product、package 或 company" },
        { status: 400 }
      );
    }

    // 获取小程序码（token 过期时自动重试一次）
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        buffer = await getWxacodeBuffer(type, cid, id);
        break;
      } catch (err) {
        const lastError = err instanceof Error ? err : new Error(String(err));
        const msg = lastError.message.toLowerCase();
        const isTokenError = msg.includes("expired") || msg.includes("42001") || msg.includes("40001");
        const isNetworkError = msg.includes("fetch failed") || msg.includes("timeout") || msg.includes("abort");
        if (attempt === 0) {
          if (isTokenError) wxacode.clearAccessTokenCache();
          if (isTokenError || isNetworkError) continue;
        }
        throw lastError;
      }
    }
    if (!buffer) throw new Error("生成小程序码失败");

    const dirPath = (qiniuConfig.dirPath || "").replace(/\/$/, "");
    const key = dirPath ? `${dirPath}/wxacode/wxacode_${type}_${cid}_${id ?? "company"}_${Date.now()}.png` : `wxacode/wxacode_${type}_${cid}_${id ?? "company"}_${Date.now()}.png`;
    const result = await uploader.uploadFile(buffer, key);
    const url = result.url || (qiniuConfig.baseUrl ? `${qiniuConfig.baseUrl.replace(/\/$/, "")}/${result.path.replace(/^\//, "")}` : result.path);

    if (!url) {
      return NextResponse.json(
        { error: "七牛云未返回有效 URL，请配置 QINIU_BASE_URL" },
        { status: 500 }
      );
    }

    const client = getHasuraClient();
    const updateRes = await client.execute({
      query: updateMutation,
      variables: { ...updateVariables, url },
    });

    if (type === "company") {
      const resData = updateRes as { update_companies_by_pk?: { id: number } };
      if (!resData?.update_companies_by_pk) {
        return NextResponse.json({ error: "公司不存在" }, { status: 404 });
      }
    } else {
      const resData = updateRes as {
        insert_company_products_one?: { id: number };
        insert_company_packages_one?: { id: number };
      };
      const inserted = resData?.insert_company_products_one ?? resData?.insert_company_packages_one;
      if (!inserted) {
        return NextResponse.json(
          { error: type === "product" ? "商品不存在或无法关联" : "套餐不存在或无法关联" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      url,
      type,
      ...(type === "company" ? {} : { [type === "product" ? "productId" : "packageId"]: id }),
      companyId: cid,
    });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(safeErrorMessage(e));
    console.error("wxacode generate 错误详情:", {
      message: err.message,
      name: err.name,
      stack: err.stack?.slice(0, 500),
    });
    return NextResponse.json(
      { error: err.message || "生成小程序码失败" },
      { status: 500 }
    );
  }
}

function safeErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (typeof e === "object" && e !== null && "message" in e)
    return String((e as { message?: unknown }).message);
  if (typeof e === "object" && e !== null && "error" in e)
    return String((e as { error?: unknown }).error);
  if (typeof e === "object" && e !== null) return JSON.stringify(e);
  return String(e);
}
