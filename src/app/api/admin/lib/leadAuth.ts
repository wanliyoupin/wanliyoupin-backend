import { NextRequest, NextResponse } from "next/server";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { getAuthFromRequest, requireCompanyAccess } from "./auth";

export type CompanyMembership = {
  id: number;
  role: string;
  permissions: string | null;
};

export type LeadActor =
  | { kind: "platform_admin" }
  | { kind: "company_user"; membership: CompanyMembership };

export function parseLeadPermissions(permissions: string | null | undefined): Set<string> {
  if (permissions == null || !String(permissions).trim()) return new Set();
  return new Set(
    String(permissions)
      .split("&")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

export function isCompanyRoleAdmin(m: CompanyMembership): boolean {
  return m.role === "admin";
}

/** 公司管理员或显式 admin_lead */
export function hasAdminLead(m: CompanyMembership): boolean {
  return isCompanyRoleAdmin(m) || parseLeadPermissions(m.permissions).has("admin_lead");
}

export function canAccessLeadsModule(m: CompanyMembership | null): boolean {
  if (!m) return false;
  return hasAdminLead(m);
}

export function isLeadOwner(
  lead: { created_by_company_users?: number | null },
  myCuId: number
): boolean {
  return lead.created_by_company_users === myCuId;
}

/** 平台管理员可管理全部；公司成员仅可管理自己录入的线索 */
export function canManageLead(
  actor: LeadActor,
  lead: { created_by_company_users?: number | null },
  myCuId: number | null
): boolean {
  if (actor.kind === "platform_admin") return true;
  if (myCuId == null) return false;
  return isLeadOwner(lead, myCuId);
}

export function isJwtPlatformAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return false;
  try {
    const payload = HasuraJwtToken.verifyToken(token);
    const claims = payload?.["https://hasura.io/jwt/claims"] as
      | { "x-hasura-default-role"?: string; "x-hasura-allowed-roles"?: string[] }
      | undefined;
    const defaultRole = claims?.["x-hasura-default-role"];
    const allowed = claims?.["x-hasura-allowed-roles"] ?? [];
    return defaultRole === "admin" || allowed.includes("admin");
  } catch {
    return false;
  }
}

export async function getCompanyMembership(
  userId: number,
  companyId: number
): Promise<CompanyMembership | null> {
  const client = getHasuraClient();
  const query = `
    query CuForLead($userId: bigint!, $companyId: bigint!) {
      company_users(
        where: { user_users: { _eq: $userId }, company_companies: { _eq: $companyId } }
        limit: 1
      ) {
        id
        role
        permissions
      }
    }
  `;
  const res = await client.execute({ query, variables: { userId, companyId } });
  const row = (res as { company_users?: CompanyMembership[] })?.company_users?.[0];
  return row ?? null;
}

/**
 * 平台管理员或具备线索权限的 company_users 可访问线索模块
 */
export async function resolveLeadActor(
  req: NextRequest,
  companyId: number
): Promise<LeadActor | NextResponse> {
  const access = await requireCompanyAccess(req, companyId);
  if (access !== true) return access;

  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  if (isJwtPlatformAdmin(req)) {
    return { kind: "platform_admin" };
  }

  const membership = await getCompanyMembership(auth.userId, companyId);
  if (!canAccessLeadsModule(membership)) {
    return NextResponse.json({ error: "无线索模块权限（需 admin_lead 或公司管理员）" }, { status: 403 });
  }
  return { kind: "company_user", membership: membership! };
}

export function actorHasAdminLead(actor: LeadActor): boolean {
  if (actor.kind === "platform_admin") return true;
  return hasAdminLead(actor.membership);
}

/** 写跟进、转客户等需要的 company_users.id；平台管理员无成员身份时为 null */
export function actorCompanyUserId(actor: LeadActor): number | null {
  if (actor.kind === "platform_admin") return null;
  return actor.membership.id;
}

const STORED_LEAD_PERM_KEYS = new Set(["admin_lead"]);

/**
 * 写入 company_users.permissions：仅保留 admin_lead，去重后按字母序用 & 连接；无则 null。
 */
export function normalizeCompanyUserPermissionsStorage(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  let parts: string[];
  if (Array.isArray(raw)) {
    parts = raw.map((x) => String(x).trim()).filter(Boolean);
  } else {
    const s = String(raw).trim();
    if (!s) return null;
    parts = s.split("&").map((p) => p.trim()).filter(Boolean);
  }
  const kept = [...new Set(parts.filter((p) => STORED_LEAD_PERM_KEYS.has(p)))].sort();
  return kept.length ? kept.join("&") : null;
}

const LEAD_STATUSES = new Set(["new", "lost", "converted"]);

export function normalizeLeadStatus(s: unknown): string | null {
  if (typeof s !== "string" || !LEAD_STATUSES.has(s)) return null;
  return s;
}

/** 线索 more_info.location：小程序地图选点写入 */
export type LeadLocationPayload = {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
};

/** undefined=未传；null=清除定位；对象=写入/更新 */
export function parseLeadLocationInput(raw: unknown): LeadLocationPayload | null | undefined {
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const o = raw as Record<string, unknown>;
  const latitude = Number(o.latitude);
  const longitude = Number(o.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return undefined;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return undefined;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const address = typeof o.address === "string" ? o.address.trim() : "";
  return {
    latitude,
    longitude,
    ...(name ? { name } : {}),
    ...(address ? { address } : {}),
  };
}

export function mergeMoreInfoLocation(
  existing: unknown,
  location: LeadLocationPayload | null | undefined
): Record<string, unknown> | null | undefined {
  return mergeLeadMoreInfoFields(existing, undefined, location);
}

/** 与万丽导出模板、小程序录入表单一致的 more_info 字符串字段 */
export const LEAD_MORE_INFO_STRING_KEYS = [
  "region",
  "storefrontImageUrl",
  "companyName",
  "contactPerson",
  "wechat",
  "businessType",
  "visitDate",
  "customerLevel",
  "firstEvaluation",
  "catalogDelivery",
  "firstVisitDesc",
  "firstOrderAt",
  "orderCount",
  "orderAmount",
  "remark",
] as const;

export type LeadMoreInfoStringKey = (typeof LEAD_MORE_INFO_STRING_KEYS)[number];

export function parseLeadMoreInfoInput(
  raw: unknown
): Partial<Record<LeadMoreInfoStringKey, string | null>> | undefined {
  if (raw === undefined) return undefined;
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const o = raw as Record<string, unknown>;
  const patch: Partial<Record<LeadMoreInfoStringKey, string | null>> = {};
  let hasAny = false;
  for (const key of LEAD_MORE_INFO_STRING_KEYS) {
    if (!(key in o)) continue;
    hasAny = true;
    const v = o[key];
    if (v === null) {
      patch[key] = null;
    } else if (typeof v === "string") {
      const trimmed = v.trim();
      patch[key] = trimmed || null;
    } else if (typeof v === "number" && Number.isFinite(v)) {
      patch[key] = String(v);
    }
  }
  const legacyImage = o.storefrontImage;
  if (!("storefrontImageUrl" in o) && typeof legacyImage === "string") {
    const trimmed = legacyImage.trim();
    if (trimmed) {
      patch.storefrontImageUrl = trimmed;
      hasAny = true;
    }
  }
  return hasAny ? patch : undefined;
}

export function mergeLeadMoreInfoFields(
  existing: unknown,
  stringPatch: Partial<Record<LeadMoreInfoStringKey, string | null>> | undefined,
  location: LeadLocationPayload | null | undefined
): Record<string, unknown> | null | undefined {
  if (stringPatch === undefined && location === undefined) return undefined;
  const base =
    existing != null && typeof existing === "object" && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {};
  if (stringPatch) {
    for (const [key, val] of Object.entries(stringPatch)) {
      if (val === null || val === "") delete base[key];
      else base[key as LeadMoreInfoStringKey] = val;
    }
  }
  if (location !== undefined) {
    if (location === null) delete base.location;
    else base.location = location;
  }
  return Object.keys(base).length > 0 ? base : null;
}
