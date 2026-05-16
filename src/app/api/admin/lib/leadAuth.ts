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

export function hasTrackLead(m: CompanyMembership): boolean {
  return parseLeadPermissions(m.permissions).has("track_lead");
}

export function canAccessLeadsModule(m: CompanyMembership | null): boolean {
  if (!m) return false;
  return hasAdminLead(m) || hasTrackLead(m);
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
    return NextResponse.json({ error: "无线索模块权限（需 admin_lead / track_lead 或公司管理员）" }, { status: 403 });
  }
  return { kind: "company_user", membership: membership! };
}

export function actorHasAdminLead(actor: LeadActor): boolean {
  if (actor.kind === "platform_admin") return true;
  return hasAdminLead(actor.membership);
}

export function actorHasTrackLead(actor: LeadActor): boolean {
  if (actor.kind === "platform_admin") return true;
  return hasTrackLead(actor.membership) || hasAdminLead(actor.membership);
}

/** 写跟进、转客户等需要的 company_users.id；平台管理员无成员身份时为 null */
export function actorCompanyUserId(actor: LeadActor): number | null {
  if (actor.kind === "platform_admin") return null;
  return actor.membership.id;
}

const STORED_LEAD_PERM_KEYS = new Set(["admin_lead", "track_lead"]);

/**
 * 写入 company_users.permissions：仅保留 admin_lead / track_lead，去重后按字母序用 & 连接；无则 null。
 * 接受 string（如 "track_lead&admin_lead"）、string[]，或 null 清空。
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

const LEAD_STATUSES = new Set(["new", "assigned", "following", "won", "lost", "converted"]);

export function normalizeLeadStatus(s: unknown): string | null {
  if (typeof s !== "string" || !LEAD_STATUSES.has(s)) return null;
  return s;
}
