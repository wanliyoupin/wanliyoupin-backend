import { WxAuth } from "./WxAuth";
import { wxAuthConfig } from "../config";

let _instance: WxAuth | null = null;

/**
 * 获取全局唯一的 WxAuth 实例，确保 access_token 缓存共享。
 * 微信规则：每次获取新 token 会使旧 token 立即失效。
 * 若多处独立 new WxAuth()，各自缓存会互相失效，导致 42001 expired。
 */
export function getWxAuthSingleton(): WxAuth {
  if (!_instance) _instance = new WxAuth(wxAuthConfig);
  return _instance;
}
