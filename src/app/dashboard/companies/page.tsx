"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";
import { useToast } from "@/app/components/Toast";

type CompanyUser = {
  id: number;
  user: { id: number; mobile?: string | null; nickname?: string | null };
};
type CompanyRow = {
  id: number;
  name: string;
  logo_url?: string | null;
  wx_scan_code?: string | null;
  company_users?: CompanyUser[];
  company_users_total?: { aggregate?: { count?: number } };
  company_users_admin?: { aggregate?: { count?: number } };
  company_users_regular?: { aggregate?: { count?: number } };
};

function memberAgg(c: CompanyRow, key: "company_users_total" | "company_users_admin" | "company_users_regular"): number {
  return c[key]?.aggregate?.count ?? 0;
}

export default function CompaniesPage() {
  const { token, user } = useAuth();
  const toast = useToast();
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [authorizingCompany, setAuthorizingCompany] = useState<CompanyRow | null>(null);
  const [authorizeMobile, setAuthorizeMobile] = useState("");
  const [searchedUser, setSearchedUser] = useState<{ id: number; mobile?: string; nickname?: string; avatar_url?: string } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchingUser, setSearchingUser] = useState(false);
  const [authorizeSubmitting, setAuthorizeSubmitting] = useState(false);
  const [authorizeCompanyRole, setAuthorizeCompanyRole] = useState<"admin" | "user">("admin");
  const [wxacodeGenerating, setWxacodeGenerating] = useState<number | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminFilter, setAdminFilter] = useState<"all" | "has_admin" | "no_admin">("all");
  const [sortKey, setSortKey] = useState<"created_desc" | "created_asc" | "name_asc" | "name_desc">("created_desc");

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadCompanies = useCallback(
    async (pageNum: number) => {
      if (!token) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: String(pageSize),
          offset: String((pageNum - 1) * pageSize),
        });
        if (searchQuery) params.set("q", searchQuery);
        if (adminFilter !== "all") params.set("filter", adminFilter);
        if (sortKey !== "created_desc") params.set("sort", sortKey);
        const res = await fetch(`/api/admin/companies?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCompanies(data.companies ?? []);
          setTotal(data.total ?? 0);
          setPage(pageNum);
        }
      } finally {
        setLoading(false);
      }
    },
    [token, pageSize, searchQuery, adminFilter, sortKey]
  );

  useEffect(() => {
    if (!token) return;
    void loadCompanies(1);
  }, [token, searchQuery, adminFilter, sortKey, loadCompanies]);

  const openAuthorize = (company: CompanyRow) => {
    setAuthorizingCompany(company);
    setAuthorizeMobile("");
    setSearchedUser(null);
    setHasSearched(false);
    setAuthorizeCompanyRole("admin");
    setAuthorizeOpen(true);
  };

  const searchUser = async () => {
    const mobile = authorizeMobile.trim().replace(/\D/g, "");
    if (mobile.length !== 11) {
      alert("请输入 11 位手机号");
      return;
    }
    if (!token) return;
    setSearchingUser(true);
    setSearchedUser(null);
    try {
      const res = await fetch(`/api/admin/users/search?mobile=${encodeURIComponent(mobile)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHasSearched(true);
      if (res.ok && data?.id) {
        setSearchedUser(data);
      } else {
        setSearchedUser(null);
        if (!res.ok) alert(data?.error || "搜索失败");
      }
    } finally {
      setSearchingUser(false);
    }
  };

  const handleGenerateWxacode = async (companyId: number) => {
    if (!token) return;
    setWxacodeGenerating(companyId);
    try {
      const res = await fetch("/api/weixin/wxacode/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "company", companyId }),
      });
      const data = await res.json();
      if (res.ok && data?.url) {
        window.open(data.url, "_blank");
        toast.success("小程序码已生成并保存");
        void loadCompanies(page);
      } else {
        toast.error(data?.error || "生成失败");
      }
    } catch {
      toast.error("生成失败");
    } finally {
      setWxacodeGenerating(null);
    }
  };

  const handleAuthorize = async () => {
    const mobile = authorizeMobile.trim().replace(/\D/g, "");
    if (mobile.length !== 11) {
      alert("请输入 11 位手机号");
      return;
    }
    if (!hasSearched) {
      alert("请先搜索用户");
      return;
    }
    if (!authorizingCompany || !token) return;
    setAuthorizeSubmitting(true);
    try {
      const res = await fetch(`/api/admin/companies/${authorizingCompany.id}/authorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mobile, role: authorizeCompanyRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthorizeOpen(false);
        setAuthorizingCompany(null);
        setSearchedUser(null);
        setHasSearched(false);
        const roleLabel = authorizeCompanyRole === "admin" ? "管理员" : "普通用户";
        toast.success(
          searchedUser ? `已将该用户授权为本公司${roleLabel}` : `已创建账号并加入公司为${roleLabel}`
        );
        void loadCompanies(page);
      } else {
        alert(data?.error || "授权失败");
      }
    } finally {
      setAuthorizeSubmitting(false);
    }
  };

  const base = "/dashboard/company";
  const auditLinks = (companyId: number) => [
    { label: "设置", href: `${base}/settings?companyId=${companyId}&audit=1` },
    { label: "分类", href: `${base}/categories?companyId=${companyId}&audit=1` },
    { label: "商品", href: `${base}/products?companyId=${companyId}&audit=1` },
    { label: "套餐", href: `${base}/packages?companyId=${companyId}&audit=1` },
    { label: "用户", href: `${base}/users?companyId=${companyId}&audit=1` },
    { label: "订单", href: `${base}/orders?companyId=${companyId}&audit=1` },
  ];

  if (user?.role !== "admin") {
    return (
      <div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">公司列表</h1>
        <p className="text-slate-600">仅平台管理员可查看。</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800">公司列表</h1>
        <Link
          href="/dashboard/companies/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          + 添加公司
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-600">搜索公司名称</label>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="支持模糊匹配…"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="mb-1 block text-xs font-medium text-slate-600">分类（管理员）</label>
          <select
            value={adminFilter}
            onChange={(e) => setAdminFilter(e.target.value as typeof adminFilter)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">全部</option>
            <option value="has_admin">已有管理员</option>
            <option value="no_admin">暂无管理员</option>
          </select>
        </div>
        <div className="min-w-[160px]">
          <label className="mb-1 block text-xs font-medium text-slate-600">排序</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="created_desc">创建时间 · 新→旧</option>
            <option value="created_asc">创建时间 · 旧→新</option>
            <option value="name_asc">名称 · A→Z</option>
            <option value="name_desc">名称 · Z→A</option>
          </select>
        </div>
      </div>

      {loading && companies.length === 0 ? (
        <p className="text-slate-500">加载中…</p>
      ) : (
        <div className="space-y-3">
          {companies.map((company) => {
            const admins = company.company_users ?? [];
            const totalMembers = memberAgg(company, "company_users_total");
            const adminCount = memberAgg(company, "company_users_admin");
            const userCount = memberAgg(company, "company_users_regular");
            return (
              <div
                key={company.id}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-semibold text-lg flex-shrink-0">
                      {company.name?.[0] ?? "C"}
                    </div>
                  )}
                  {company.wx_scan_code && (
                    <a
                      href={company.wx_scan_code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                      title="查看公司小程序码"
                    >
                      <img
                        src={company.wx_scan_code}
                        alt={`${company.name} 小程序码`}
                        className="w-14 h-14 rounded-lg border border-slate-200 object-contain bg-white"
                      />
                    </a>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800">{company.name}</div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      成员共 {totalMembers} 人（管理员 {adminCount} 人、普通用户 {userCount} 人）
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      {adminCount > 0 ? (
                        <>
                          管理员：
                          <span className="text-slate-600">
                            {admins.map((a) => a.user?.nickname || a.user?.mobile || "—").join("、")}
                          </span>
                        </>
                      ) : (
                        "管理员：暂无"
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-slate-500 text-sm">核查：</span>
                      {auditLinks(company.id).map(({ label, href }) => (
                        <Link
                          key={label}
                          href={href}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      disabled={wxacodeGenerating === company.id}
                      onClick={() => handleGenerateWxacode(company.id)}
                      className="px-3 py-1.5 text-sm border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {wxacodeGenerating === company.id ? "生成中…" : "小程序码"}
                    </button>
                    <Link
                      href={`/dashboard/companies/${company.id}/edit`}
                      className="px-3 py-1.5 text-sm border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
                    >
                      编辑
                    </Link>
                    <button
                      type="button"
                      onClick={() => openAuthorize(company)}
                      className="px-3 py-1.5 text-sm border border-indigo-300 rounded text-indigo-700 hover:bg-indigo-50"
                    >
                      授权
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => loadCompanies(page - 1)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="text-sm text-slate-600">
            {page} / {totalPages}（共 {total} 条）
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => loadCompanies(page + 1)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      {companies.length === 0 && !loading && (
        <div className="text-center py-8 text-slate-500">
          <p className="mb-2">暂无公司</p>
          <Link
            href="/dashboard/companies/new"
            className="text-indigo-600 hover:underline"
          >
            添加公司
          </Link>
        </div>
      )}

      {/* 授权弹窗 */}
      {authorizeOpen && authorizingCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !authorizeSubmitting && setAuthorizeOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-medium text-slate-800 mb-4">授权用户加入公司</div>
            <div className="mb-3">
              <span className="text-slate-500 text-sm">公司名称</span>
              <div className="text-slate-800">{authorizingCompany.name}</div>
            </div>
            <div className="mb-3">
              <label className="block text-sm text-slate-700 mb-1">在公司中的角色</label>
              <select
                value={authorizeCompanyRole}
                onChange={(e) => setAuthorizeCompanyRole(e.target.value as "admin" | "user")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="admin">公司管理员（可管理分类、商品、套餐与公司用户）</option>
                <option value="user">普通用户（客户身份；价格与等级可在「用户管理」中调整）</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm text-slate-700 mb-1">手机号 *</label>
              <input
                type="tel"
                value={authorizeMobile}
                onChange={(e) => setAuthorizeMobile(e.target.value)}
                placeholder="请输入 11 位手机号"
                maxLength={11}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={searchUser}
              disabled={authorizeMobile.trim().replace(/\D/g, "").length !== 11 || searchingUser}
              className="mb-4 px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50 text-sm"
            >
              {searchingUser ? "搜索中…" : "搜索用户"}
            </button>
            {searchedUser && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                {searchedUser.avatar_url ? (
                  <img src={searchedUser.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-sm">
                    {(searchedUser.nickname || searchedUser.mobile || "U")[0]}
                  </div>
                )}
                <div>
                  <div className="text-slate-800">{searchedUser.nickname || "未设置昵称"}</div>
                  <div className="text-slate-500 text-sm">{searchedUser.mobile}</div>
                </div>
              </div>
            )}
            {hasSearched && !searchedUser && (
              <div className="mb-4 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
                该手机号尚未注册，可点击下方「创建并授权」直接创建账号，并以当前所选角色加入该公司
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setAuthorizeOpen(false)}
                disabled={authorizeSubmitting}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={!hasSearched || authorizeSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {authorizeSubmitting ? "处理中…" : searchedUser ? "确认授权" : "创建并授权"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
