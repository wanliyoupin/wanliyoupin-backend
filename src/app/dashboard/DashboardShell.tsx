"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

type CompanyItem = { id: number };

type SidebarFlags = {
  isAdminForSelectedCompany: boolean;
  canAccessCompanyLeads: boolean;
};

/** 任意登录用户可见，避免仅有公司成员身份时侧栏为空 */
const SIDEBAR_ACCOUNT = {
  title: "账号",
  showWhen: () => true,
  children: [{ label: "个人中心", href: "/dashboard/profile" }],
};

const SIDEBAR_ADMIN = {
  title: "管理员",
  showWhen: (user: { role?: string } | null) => user?.role === "admin",
  children: [
    { label: "数据看板", href: "/dashboard/admin/dashboard" },
    { label: "公司列表", href: "/dashboard/companies" },
    { label: "账号列表", href: "/dashboard/accounts" },
    { label: "线索管理", href: "/dashboard/admin/leads" },
  ],
};

const SIDEBAR_COMPANY = {
  title: "我的公司",
  /** 已选公司，且为公司管理员或具备线索权限时展示 */
  showWhen: (_u: unknown, company: CompanyItem | null, _list: unknown, f: SidebarFlags) =>
    !!company && (f.isAdminForSelectedCompany || f.canAccessCompanyLeads),
  children: [
    { label: "数据看板", href: "/dashboard/company/dashboard" },
    { label: "公司设置", href: "/dashboard/company/settings" },
    { label: "分类管理", href: "/dashboard/company/categories" },
    { label: "商品管理", href: "/dashboard/company/products" },
    { label: "套餐管理", href: "/dashboard/company/packages" },
    { label: "订单管理", href: "/dashboard/company/orders" },
    { label: "线索管理", href: "/dashboard/company/leads" },
    { label: "用户管理", href: "/dashboard/company/users" },
  ],
};

const SIDEBAR_GROUPS = [SIDEBAR_ACCOUNT, SIDEBAR_ADMIN, SIDEBAR_COMPANY];

// 一级菜单默认展开
const DEFAULT_GROUP_EXPANDED: Record<string, boolean> = {
  [SIDEBAR_ACCOUNT.title]: true,
  [SIDEBAR_ADMIN.title]: true,
  [SIDEBAR_COMPANY.title]: true,
};

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    token,
    user,
    company,
    ready,
    logout,
    setCompany,
    setCompanyUsers,
    companies,
    isAdminForSelectedCompany,
    isLeadAdminForSelectedCompany,
    hasTrackLeadForSelectedCompany,
    canAccessCompanyLeads,
  } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>(DEFAULT_GROUP_EXPANDED);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    // 每次进入后台拉取最新 company_users：新增公司、被设为管理员后若仅靠 localStorage 会陈旧；
    // 原先仅在 length===0 时请求，会导致刷新后「我的公司」菜单与真实角色不一致。
    fetch("/api/admin/company-users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.company_users !== undefined) {
          setCompanyUsers(data.company_users, data.system_company_id ?? null);
        }
      })
      .catch(() => {});
  }, [ready, token, router, setCompanyUsers]);

  /** 仅平台管理员可访问 /dashboard/admin/* */
  useEffect(() => {
    if (!pathname.startsWith("/dashboard/admin/")) return;
    if (user?.role === "admin") return;
    router.replace("/dashboard/profile");
  }, [pathname, user?.role, router]);

  /** 非平台管理员：无公司管理权且无线索权时禁止 /dashboard/company/*；线索页单独放行 */
  useEffect(() => {
    if (!pathname.startsWith("/dashboard/company/")) return;
    if (user?.role === "admin") return;
    if (pathname.startsWith("/dashboard/company/leads")) {
      if (user?.role === "admin" || canAccessCompanyLeads) return;
      router.replace("/dashboard/profile");
      return;
    }
    if (isAdminForSelectedCompany) return;
    router.replace("/dashboard/profile");
  }, [pathname, user?.role, isAdminForSelectedCompany, canAccessCompanyLeads, router]);

  const sidebarFlags: SidebarFlags = {
    isAdminForSelectedCompany,
    canAccessCompanyLeads,
  };

  const visibleGroups = SIDEBAR_GROUPS.filter((g) => {
    if (g === SIDEBAR_ACCOUNT) return g.showWhen();
    if (g === SIDEBAR_ADMIN) return g.showWhen(user);
    return g.showWhen(user, company, companies, sidebarFlags);
  });

  const isOnlyLeadStaff =
    !!company &&
    !isAdminForSelectedCompany &&
    (isLeadAdminForSelectedCompany);

  const navActive = (href: string) =>
    pathname === href || (href.length > 1 && pathname.startsWith(`${href}/`));

  if (!ready || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">加载中…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* 移动端：侧栏遮罩 */}
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="关闭菜单"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[1px] md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      {/* 左侧菜单：移动端为抽屉，md 及以上为固定侧栏并可折叠 */}
      <aside
        className={`flex w-56 shrink-0 flex-col bg-slate-800 text-white transition-[width,transform] duration-200 ease-out md:relative md:z-auto ${
          sidebarCollapsed ? "md:w-14" : "md:w-56"
        } fixed inset-y-0 left-0 z-50 md:translate-x-0 ${
          mobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex min-h-[53px] items-center justify-between border-b border-slate-700">
          <Link
            href="/dashboard/profile"
            className={`truncate p-4 font-semibold text-white ${sidebarCollapsed ? "md:hidden" : ""}`}
            onClick={() => setMobileNavOpen(false)}
          >
            管理后台
          </Link>
          {sidebarCollapsed ? (
            <Link
              href="/dashboard/profile"
              className="hidden p-4 font-semibold text-white md:block"
              title="管理后台"
              onClick={() => setMobileNavOpen(false)}
            >
              管
            </Link>
          ) : null}
          <div className="flex items-center pr-1">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="rounded p-2 text-slate-400 hover:bg-slate-700 hover:text-white md:hidden"
              aria-label="关闭菜单"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="hidden rounded p-2 text-slate-400 hover:bg-slate-700 hover:text-white md:block"
              title={sidebarCollapsed ? "展开菜单" : "折叠菜单"}
              aria-label={sidebarCollapsed ? "展开菜单" : "折叠菜单"}
            >
              {sidebarCollapsed ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 12H6" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {visibleGroups.length === 0 ? (
            <p className="px-4 py-3 text-xs text-slate-500">
              {!company ? "请在上方选择公司" : null}
            </p>
          ) : (
            visibleGroups.map((group) => {
              const items =
                group.title === SIDEBAR_COMPANY.title && isOnlyLeadStaff
                  ? SIDEBAR_COMPANY.children.filter((c) => c.href === "/dashboard/company/leads")
                  : group.children;
              const expanded = groupExpanded[group.title] ?? true;
              const toggleGroup = () =>
                setGroupExpanded((prev) => ({ ...prev, [group.title]: !expanded }));
              return (
                <div key={group.title} className="mb-4">
                  {sidebarCollapsed ? (
                    <>
                      <div className="hidden justify-center px-2 py-2 md:flex">
                        <span className="text-xs font-medium text-slate-400" title={group.title}>
                          {group.title[0]}
                        </span>
                      </div>
                      <div className="px-4 py-2 md:hidden">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {group.title}
                        </span>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleGroup}
                      className="flex w-full items-center justify-between rounded px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    >
                      <span>{group.title}</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                  {expanded && (
                    <ul>
                      {items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className={`flex items-center gap-2 truncate px-4 py-2.5 text-sm ${
                              navActive(item.href)
                                ? "bg-indigo-600 text-white"
                                : "text-slate-300 hover:bg-slate-700 hover:text-white"
                            } ${sidebarCollapsed ? "md:justify-center md:px-2" : ""}`}
                            title={sidebarCollapsed ? item.label : undefined}
                          >
                            <span className="md:hidden">{item.label}</span>
                            <span className="hidden md:inline">
                              {sidebarCollapsed ? item.label[0] : item.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </aside>

      {/* 右侧：顶栏 + 内容 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2 md:h-14 md:flex-nowrap md:px-6 md:py-0">
          <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="打开菜单"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {company ? (
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap">
                {company.logo_url ? (
                  <img src={company.logo_url} alt="" className="h-8 w-8 shrink-0 rounded object-cover" />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-200 text-xs text-slate-500">
                    司
                  </div>
                )}
                <span className="hidden max-w-[40vw] truncate font-medium text-slate-800 sm:inline md:max-w-none">
                  {company.name}
                </span>
                <select
                  className="min-w-0 max-w-full flex-1 rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-700 sm:text-sm md:ml-2 md:max-w-xs md:flex-none"
                  value={company.id}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    const c = companies.find((x) => Number(x.id) === v);
                    if (c) {
                      setCompany(c);
                      router.push("/dashboard/profile");
                    }
                  }}
                >
                  {companies.length === 0 && <option value={company.id}>{company.name}</option>}
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-sm text-slate-500">请选择公司</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                {(user?.nickname || user?.mobile || "用")[0]}
              </div>
            )}
            <span className="max-w-[30vw] truncate text-xs text-slate-700 sm:max-w-[12rem] sm:text-sm">
              {user?.nickname || user?.mobile || "用户"}
            </span>
            <Link
              href="/dashboard/settings/password"
              className="hidden text-sm text-slate-500 hover:text-slate-700 sm:inline"
            >
              设置密码
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              退出
            </button>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 md:p-6">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}
