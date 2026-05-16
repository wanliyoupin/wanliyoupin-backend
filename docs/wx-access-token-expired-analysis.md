# 微信 access_token 过期问题根因分析

## 现象

- 刚部署后生成小程序码正常
- 约 2 小时后出现 `expired token` (42001)
- 重试有时能恢复

## 微信 access_token 机制

1. **有效期**：约 7200 秒（2 小时）
2. **关键规则**：**每次获取新 token，旧 token 会立即失效**
3. 同一 appId 下，任意时刻只有一个 token 有效

## 可能根因

### 1. 多实例部署（最可能）

当后端有 **多个 Node 进程/实例** 时（如 PM2 cluster、K8s 多副本、Serverless 多实例）：

```
时间线：
T0:     实例 A 获取 token1，缓存
T0+1min: 请求被负载到实例 B，B 获取 token2 → 微信使 token1 失效
T0+2min: 请求再次到实例 A，A 仍用缓存的 token1 → 42001 expired
```

每个实例有独立内存，缓存互不可见。任一实例获取新 token，其他实例的缓存都会失效。

**如何确认**：部署为单实例（如 `pm2 start app.js -i 1`）后观察，若不再出现则基本可确认。

### 2. 其他接口也在获取 token

`getAccessToken` 被多处使用：

- `WxWxacode`（小程序码）
- `WxAuth.getUserPhoneNumber`（手机号登录）

若每个模块创建了**独立的 WxAuth 实例**，则各自有独立缓存。但更关键的是：**同一进程内**，若 wxacode 和 phone-login 用的是不同 WxAuth 实例，它们的缓存是隔离的。phone-login 获取新 token 会令 wxacode 的缓存失效。

当前代码中：wxacode 路由、phone-login、wx-login 各自 `new WxAuth()`，是**三个独立实例**，缓存不共享。

### 3. 缓存刷新时机

当前逻辑：`cachedExpireAt - now > 15 * 60 * 1000` 时使用缓存，即提前 15 分钟刷新。

单实例下，该逻辑应能避免自然过期。若仍出现 2 小时后失败，更可能是多实例或跨模块获取 token 导致。

## 解决方案

### 方案 A：单实例部署（快速验证）

若当前为多实例，可先改为单实例验证：

```bash
# PM2
pm2 start app.js -i 1

# 或 K8s replicas: 1
```

### 方案 B：全局共享 WxAuth 实例（推荐，无 Redis）

让所有需要 access_token 的模块使用**同一个 WxAuth 实例**，共享内存缓存：

```ts
// config-lib/weixin/miniprogram/wxAuthSingleton.ts
import { WxAuth } from "./WxAuth";
import { wxAuthConfig } from "../config";

let _instance: WxAuth | null = null;

export function getWxAuthSingleton(): WxAuth {
  if (!_instance) _instance = new WxAuth(wxAuthConfig);
  return _instance;
}
```

wxacode、phone-login、wx-login 都改为使用 `getWxAuthSingleton()`，避免多实例各自获取 token 互相失效。

### 方案 C：Redis 共享 token（多实例必选）

多实例必须用外部存储共享 token，例如 Redis：

- key: `wx:access_token:{appId}`
- value: `{ token, expireAt }`
- 获取前检查过期，过期则刷新并写回

单实例可不用 Redis；多实例且无法改为单实例时，需要此方案。

## 诊断日志（已添加）

出现 42001 时，服务器日志会输出：

- `[WxWxacode] 微信 API 返回错误:` - 包含 errcode、errmsg、是否重试
- `[WxAuth] cache hit` / `fetch new token` - token 来源（开发环境）
- `wxacode generate 错误详情:` - 最终抛出错误的完整信息

**如何判断是否真的是微信 access_token 过期**：看 `[WxWxacode] 微信 API 返回错误` 中的 `errcode` 是否为 42001。若是，则确认为微信 access_token 问题；若不是，则错误来自其他环节（如 JWT 校验等）。
