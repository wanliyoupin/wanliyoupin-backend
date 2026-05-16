"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

export interface User {
  id: number;
  mobile?: string;
  nickname?: string;
  avatar_url?: string;
  role?: string;
}

export interface Company {
  id: number;
  name: string;
  logo_url?: string | null;
}

/** 用户在某公司下的关联与角色 */
export interface CompanyUser {
  /** company_users.id，用于业务接口 */
  id?: number;
  company: Company;
  role: string;
  /** admin_lead&track_lead 等，& 分隔 */
  permissions?: string | null;
}

const STORAGE_TOKEN = "admin_token";
const STORAGE_USER = "admin_user";
const STORAGE_COMPANY = "admin_company";
const STORAGE_COMPANY_USERS = "admin_company_users";
const STORAGE_DEFAULT_COMPANY_ID = "admin_default_company_id";
const STORAGE_SYSTEM_COMPANY_ID = "admin_system_company_id";

interface AuthState {
  token: string | null;
  user: User | null;
  company: Company | null;
  company_users: CompanyUser[];
  /** config 表系统配置公司 ID（总部），查询商品/分类/套餐等需同时带当前公司与总部数据 */
  systemCompanyId: number | null;
  ready: boolean;
}

function parseLeadPermKeys(permissions: string | null | undefined): Set<string> {
  if (permissions == null || !String(permissions).trim()) return new Set();
  return new Set(
    String(permissions)
      .split("&")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

interface AuthContextValue extends AuthState {
  /** 公司列表（来自 company_users） */
  companies: Company[];
  /** 当前选中的公司是否具有管理员角色 */
  isAdminForSelectedCompany: boolean;
  /** 当前公司在 company_users 下是否具备线索管理权（admin_lead 或公司 role=admin） */
  isLeadAdminForSelectedCompany: boolean;
  /** 当前公司是否具备 track_lead */
  hasTrackLeadForSelectedCompany: boolean;
  /** 可进入「我的公司 → 线索管理」（公司管理员 / admin_lead / track_lead） */
  canAccessCompanyLeads: boolean;
  /** 查询商品/分类/套餐等时用：当前公司 id + 系统配置公司 id（总部），去重后的数组 */
  companyIdsIncludingSystem: number[];
  login: (token: string, user: User) => void;
  /** 单独设置 company_users（及可选 system_company_id），会同步默认公司 */
  setCompanyUsers: (company_users: CompanyUser[], system_company_id?: number | null) => void;
  logout: () => void;
  setCompany: (company: Company | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Hasura bigint / JSON 可能为 string，统一成数字再比较，避免选中公司与成员行对不上 */
function companyIdNum(id: unknown): number {
  const n = Number(id);
  return Number.isFinite(n) ? n : NaN;
}

function companyIdEq(a: unknown, b: unknown): boolean {
  return companyIdNum(a) === companyIdNum(b);
}

function applyDefaultCompany(
  company_users: CompanyUser[],
  storedCompany: Company | null,
  storedDefaultId: string | null
): Company | null {
  const companies = company_users.map((cu) => cu.company);
  if (companies.length === 0) return null;
  const defaultId = storedDefaultId ? Number(storedDefaultId) : null;
  const byId =
    defaultId != null && Number.isFinite(defaultId)
      ? companies.find((c) => companyIdEq(c.id, defaultId))
      : null;
  if (byId) return byId;
  const stillValid =
    storedCompany != null && companies.some((c) => companyIdEq(c.id, storedCompany.id));
  if (stillValid) {
    return companies.find((c) => companyIdEq(c.id, storedCompany!.id)) ?? storedCompany;
  }
  return companies[0];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    company: null,
    company_users: [],
    systemCompanyId: null,
    ready: false,
  });

  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        setState((s) => ({ ...s, ready: true }));
        return;
      }
      const token = localStorage.getItem(STORAGE_TOKEN);
      const userRaw = localStorage.getItem(STORAGE_USER);
      const companyRaw = localStorage.getItem(STORAGE_COMPANY);
      const companyUsersRaw = localStorage.getItem(STORAGE_COMPANY_USERS);
      const defaultIdRaw = localStorage.getItem(STORAGE_DEFAULT_COMPANY_ID);
      const systemCompanyIdRaw = localStorage.getItem(STORAGE_SYSTEM_COMPANY_ID);

      const user = userRaw ? (JSON.parse(userRaw) as User) : null;
      const company = companyRaw ? (JSON.parse(companyRaw) as Company) : null;
      const company_users: CompanyUser[] = companyUsersRaw
        ? (JSON.parse(companyUsersRaw) as CompanyUser[])
        : [];
      const systemCompanyId =
        systemCompanyIdRaw != null && systemCompanyIdRaw !== ""
          ? Number(systemCompanyIdRaw)
          : null;
      const validSystemCompanyId =
        systemCompanyId != null && !Number.isNaN(systemCompanyId) ? systemCompanyId : null;

      const defaultId = defaultIdRaw?.trim() || null;
      const resolvedCompany = applyDefaultCompany(company_users, company, defaultId);

      if (
        defaultId &&
        !company_users.some((cu) => companyIdEq(cu.company.id, Number(defaultId)))
      ) {
        localStorage.removeItem(STORAGE_DEFAULT_COMPANY_ID);
      }
      if (resolvedCompany) {
        localStorage.setItem(STORAGE_COMPANY, JSON.stringify(resolvedCompany));
        localStorage.setItem(STORAGE_DEFAULT_COMPANY_ID, String(resolvedCompany.id));
      } else {
        localStorage.removeItem(STORAGE_COMPANY);
        localStorage.removeItem(STORAGE_DEFAULT_COMPANY_ID);
      }

      setState({
        token,
        user,
        company: resolvedCompany,
        company_users,
        systemCompanyId: validSystemCompanyId,
        ready: true,
      });
    } catch {
      setState((s) => ({ ...s, ready: true }));
    }
  }, []);

  const login = useCallback((token: string, user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_TOKEN, token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    }
    setState((s) => ({
      ...s,
      token,
      user,
      company: null,
      company_users: [],
      systemCompanyId: null,
      ready: true,
    }));
  }, []);

  const setCompanyUsers = useCallback(
    (company_users: CompanyUser[], system_company_id?: number | null) => {
      const defaultId =
        typeof window !== "undefined" ? localStorage.getItem(STORAGE_DEFAULT_COMPANY_ID) : null;
      const currentCompany =
        typeof window !== "undefined" ? localStorage.getItem(STORAGE_COMPANY) : null;
      const storedCompany = currentCompany ? (JSON.parse(currentCompany) as Company) : null;
      const resolved = applyDefaultCompany(company_users, storedCompany, defaultId);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_COMPANY_USERS, JSON.stringify(company_users));
        if (system_company_id != null) {
          localStorage.setItem(STORAGE_SYSTEM_COMPANY_ID, String(system_company_id));
        } else {
          localStorage.removeItem(STORAGE_SYSTEM_COMPANY_ID);
        }
        if (
          defaultId &&
          !company_users.some((cu) => companyIdEq(cu.company.id, Number(defaultId)))
        ) {
          localStorage.removeItem(STORAGE_DEFAULT_COMPANY_ID);
        }
        if (resolved) {
          localStorage.setItem(STORAGE_COMPANY, JSON.stringify(resolved));
          localStorage.setItem(STORAGE_DEFAULT_COMPANY_ID, String(resolved.id));
        } else {
          localStorage.removeItem(STORAGE_COMPANY);
          localStorage.removeItem(STORAGE_DEFAULT_COMPANY_ID);
        }
      }
      setState((s) => ({
        ...s,
        company_users,
        company: resolved,
        ...(system_company_id !== undefined ? { systemCompanyId: system_company_id ?? null } : {}),
      }));
    },
    []
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
      localStorage.removeItem(STORAGE_COMPANY);
      localStorage.removeItem(STORAGE_COMPANY_USERS);
      localStorage.removeItem(STORAGE_DEFAULT_COMPANY_ID);
      localStorage.removeItem(STORAGE_SYSTEM_COMPANY_ID);
    }
    setState({
      token: null,
      user: null,
      company: null,
      company_users: [],
      systemCompanyId: null,
      ready: true,
    });
  }, []);

  const setCompany = useCallback((company: Company | null) => {
    if (typeof window !== "undefined") {
      if (company) {
        localStorage.setItem(STORAGE_COMPANY, JSON.stringify(company));
        localStorage.setItem(STORAGE_DEFAULT_COMPANY_ID, String(company.id));
      } else {
        localStorage.removeItem(STORAGE_COMPANY);
        localStorage.removeItem(STORAGE_DEFAULT_COMPANY_ID);
      }
    }
    setState((s) => ({ ...s, company }));
  }, []);

  const companies = state.company_users.map((cu) => cu.company);
  const selectedCid = state.company ? companyIdNum(state.company.id) : NaN;
  const isAdminForSelectedCompany =
    Number.isFinite(selectedCid) &&
    state.company_users.some(
      (cu) => companyIdEq(cu.company.id, selectedCid) && cu.role === "admin"
    );

  const selectedCu = Number.isFinite(selectedCid)
    ? state.company_users.find((cu) => companyIdEq(cu.company.id, selectedCid))
    : undefined;
  const permKeys = parseLeadPermKeys(selectedCu?.permissions);
  const isLeadAdminForSelectedCompany =
    Number.isFinite(selectedCid) &&
    !!selectedCu &&
    (selectedCu.role === "admin" || permKeys.has("admin_lead"));
  const hasTrackLeadForSelectedCompany =
    Number.isFinite(selectedCid) && !!selectedCu && permKeys.has("track_lead");
  const canAccessCompanyLeads =
    isAdminForSelectedCompany || isLeadAdminForSelectedCompany || hasTrackLeadForSelectedCompany;

  /** 查询商品/分类/套餐等时使用的公司 id 列表：当前选中公司 + 系统配置公司（总部），去重 */
  const companyIdsIncludingSystem: number[] = [
    ...(state.company?.id != null ? [state.company.id] : []),
    ...(state.systemCompanyId != null ? [state.systemCompanyId] : []),
  ].filter((id, i, arr) => arr.indexOf(id) === i);

  const value: AuthContextValue = {
    ...state,
    companies,
    isAdminForSelectedCompany,
    isLeadAdminForSelectedCompany,
    hasTrackLeadForSelectedCompany,
    canAccessCompanyLeads,
    companyIdsIncludingSystem,
    login,
    setCompanyUsers,
    logout,
    setCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_TOKEN);
}
