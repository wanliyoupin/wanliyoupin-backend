import { WxAuth } from "./WxAuth";
import { getWxAuthSingleton } from "./wxAuthSingleton";

/**
 * 微信小程序码生成
 * 使用 wxacode.getUnlimited 接口，生成数量无限制
 */
export class WxWxacode {
  private wxAuth: WxAuth;

  constructor() {
    this.wxAuth = getWxAuthSingleton();
  }

  /** 清除 access_token 缓存，用于 token 过期时强制刷新 */
  clearAccessTokenCache(): void {
    this.wxAuth.clearAccessTokenCache();
  }

  /**
   * 生成小程序码（getUnlimited，无数量限制）
   * @param path 小程序页面路径，如 pages/product-detail/index
   * @param scene 场景值，最大 32 字符，如 id=123&companyId=456
   * @param width 二维码宽度，默认 430
   * @returns 小程序码图片 Buffer
   */
  async getUnlimited(
    path: string,
    scene: string,
    width: number = 430,
    isRetry = false
  ): Promise<Buffer> {
    if (scene.length > 32) {
      throw new Error("scene 参数不能超过 32 个字符");
    }
    const { access_token } = await this.wxAuth.getAccessToken(isRetry);
    const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s 超时，海外访问微信 API 可能较慢
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene,
          page: path.startsWith("/") ? path.slice(1) : path,
          width: Math.min(1280, Math.max(280, width)),
          auto_color: false,
          line_color: { r: 0, g: 0, b: 0 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      const errcode = Number(data.errcode);
      const errmsg = String(data.errmsg || "").toLowerCase();
      // 42001 access_token 过期；40001 不合法的调用凭证；errmsg 含 expired 时也重试（兼容不同返回格式）
      const isTokenError =
        errcode === 42001 ||
        errcode === 40001 ||
        errmsg.includes("expired");
      const needRetry = !isRetry && isTokenError;
      console.warn("[WxWxacode] 微信 API 返回错误:", {
        errcode: data.errcode,
        errmsg: data.errmsg,
        isTokenError,
        needRetry,
        isRetry,
      });
      if (needRetry) {
        this.wxAuth.clearAccessTokenCache();
        return this.getUnlimited(path, scene, width, true);
      }
      throw new Error(
        `生成小程序码失败: ${data.errmsg || "未知错误"} (${data.errcode ?? ""})`
      );
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      const err = fetchErr instanceof Error ? fetchErr : new Error(String(fetchErr));
      const msg = err.message.toLowerCase();
      const causeMsg = (err as Error & { cause?: Error }).cause?.message?.toLowerCase() ?? "";
      const isNetworkError = !isRetry && (
        msg.includes("fetch failed") ||
        msg.includes("timeout") ||
        msg.includes("abort") ||
        causeMsg.includes("timeout") ||
        causeMsg.includes("connect")
      );
      if (isNetworkError) {
        return this.getUnlimited(path, scene, width, true);
      }
      throw err;
    }
  }

  /**
   * 生成商品详情页小程序码
   */
  async getProductWxacode(productId: number, companyId: number): Promise<Buffer> {
    const scene = `id=${productId}&companyId=${companyId}`;
    return this.getUnlimited("pages/product-detail/index", scene);
  }

  /**
   * 生成套餐详情页小程序码
   */
  async getPackageWxacode(packageId: number, companyId: number): Promise<Buffer> {
    const scene = `id=${packageId}&companyId=${companyId}`;
    return this.getUnlimited("pages/package-detail/index", scene);
  }

  /**
   * 生成公司首页小程序码（扫码进入该公司首页）
   */
  async getCompanyWxacode(companyId: number): Promise<Buffer> {
    const scene = `companyId=${companyId}`;
    return this.getUnlimited("pages/index/index", scene);
  }
}
