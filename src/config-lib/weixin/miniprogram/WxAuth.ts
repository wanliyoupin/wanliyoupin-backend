import * as crypto from "crypto";
import { wxAuthConfig } from "../config";

export interface WxAuthConfig {
  appId: string;
  appSecret: string;
}

export interface WxSessionResult {
  openid: string;
  session_key: string;
  unionid?: string;
}

export interface WxPhoneNumberResult {
  phoneNumber: string;
  purePhoneNumber: string;
  countryCode: string;
  watermark: unknown;
  openid: string;
  unionid?: string;
}

export interface WxAccessTokenResult {
  access_token: string;
  expires_in: number;
}

export interface WxDecryptDataResult {
  [key: string]: unknown;
}

export interface WxUserPhoneNumberResult {
  phone_info: {
    phoneNumber: string;
    purePhoneNumber: string;
    countryCode: string;
    watermark: unknown;
  };
  errcode?: number;
  errmsg?: string;
}

export class WxAuth {
  private config: WxAuthConfig;
  private cachedAccessToken: string | null = null;
  private cachedExpireAt: number = 0;

  constructor(config: WxAuthConfig = wxAuthConfig) {
    this.config = config;
  }

  /**
   * 清除 access_token 缓存（token 过期时调用，下次 getAccessToken 会重新获取）
   */
  clearAccessTokenCache(): void {
    this.cachedAccessToken = null;
    this.cachedExpireAt = 0;
  }

  /**
   * 获取access_token（带内存缓存）
   * @param forceRefresh 强制刷新，忽略缓存
   */
  async getAccessToken(forceRefresh = false): Promise<WxAccessTokenResult> {
    if (forceRefresh) {
      this.clearAccessTokenCache();
    }
    const now = Date.now();
    // 提前 15 分钟刷新，避免多实例/网络延迟导致使用过期 token
    if (this.cachedAccessToken && this.cachedExpireAt - now > 15 * 60 * 1000) {
      if (process.env.NODE_ENV === "development") {
        console.log("[WxAuth] cache hit, expiresIn:", Math.round((this.cachedExpireAt - now) / 1000), "s");
      }
      return {
        access_token: this.cachedAccessToken,
        expires_in: this.cachedExpireAt - now,
      };
    }
    if (process.env.NODE_ENV === "development") {
      console.log("[WxAuth] fetch new token (forceRefresh:", forceRefresh, ", hadCache:", !!this.cachedAccessToken, ")");
    }
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.config.appId}&secret=${this.config.appSecret}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s 超时
    const res = await fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeoutId));
    if (!res.ok) throw new Error(`获取access_token失败: HTTP ${res.status}`);
    const data = await res.json();
    if (!data.access_token)
      throw new Error(`获取access_token失败: ${data.errmsg || "未知错误"}`);
    this.cachedAccessToken = data.access_token;
    this.cachedExpireAt = now + data.expires_in * 1000;
    return {
      access_token: this.cachedAccessToken || "",
      expires_in: data.expires_in,
    };
  }

  /**
   * 通过code换取openid/session_key/unionid
   */
  async getSession(code: string): Promise<WxSessionResult> {
    const { appId, appSecret } = this.config;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (data.errcode)
      throw new Error(`获取openid失败: ${data.errmsg} (${data.errcode})`);
    return data as WxSessionResult;
  }

  /**
   * 解密微信小程序加密数据（如手机号等）
   */
  async decryptData(
    encryptedData: string,
    iv: string,
    sessionKey: string
  ): Promise<WxDecryptDataResult> {
    const sessionKeyBuffer = Buffer.from(sessionKey, "base64");
    const ivBuffer = Buffer.from(iv, "base64");
    const encryptedDataBuffer = Buffer.from(encryptedData, "base64");
    const decipher = crypto.createDecipheriv(
      "aes-128-cbc",
      sessionKeyBuffer,
      ivBuffer
    );
    decipher.setAutoPadding(true);
    let decoded = decipher.update(encryptedDataBuffer).toString("utf8");
    decoded += decipher.final("utf8");
    const decodedData = JSON.parse(decoded);
    if (
      decodedData.watermark &&
      decodedData.watermark.appid !== this.config.appId
    ) {
      throw new Error("数据校验失败，appid不匹配");
    }
    return decodedData;
  }

  /**
   * 微信新API：通过code直接获取手机号（无需解密）
   */
  async getUserPhoneNumber(code: string): Promise<WxUserPhoneNumberResult> {
    const { access_token } = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${access_token}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) throw new Error(`获取手机号失败: HTTP ${res.status}`);
    const data = await res.json();
    if (data.errcode !== 0)
      throw new Error(`获取手机号失败: ${data.errmsg || "未知错误"}`);
    return data as WxUserPhoneNumberResult;
  }
}
