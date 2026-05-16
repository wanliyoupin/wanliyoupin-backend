"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";

type LeadRow = {
  id: number;
  name: string;
  phone: string;
  status: string;
  assigned_company_users?: number | null;
  created_at: string;
  updated_at: string;
  company_user?: { id: number; user?: { nickname?: string; mobile?: string } } | null;
  companyUserByCreatedByCompanyUsers?: { user?: { nickname?: string; mobile?: string } } | null;
};

function statusLabel(s: string) {
  const m: Record<string, string> = {
    new: "新建",
    assigned: "已分配",
    following: "跟进中",
    won: "成交",
    lost: "失败",
    converted: "已转客户",
  };
  return m[s] ?? s;
}

/**
 * 「我的公司 → 线索管理」：数据范围严格等于顶部当前选中的公司（company.id）
 */
export default function CompanyLeadsPage() {
  const {
    token,
    company,
    user,
    isAdminForSelectedCompany,
    isLeadAdminForSelectedCompany,
    canAccessCompanyLeads,
  } = useAuth();

  const effectiveCompanyId = company?.id != null ? Number(company.id) : null;

  const canCreate = user?.role === "admin" || isAdminForSelectedCompany || isLeadAdminForSelectedCompany;

  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createErr, setCreateErr] = useState("");

  const load = async (p: number) => {
    if (!token || !effectiveCompanyId) {
      setLeads([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        companyId: String(effectiveCompanyId),
        limit: String(pageSize),
        offset: String((p - 1) * pageSize),
      });
      if (statusFilter) params.set("status", statusFilter);
      if (keyword) params.set("keyword", keyword);
      const res = await fetch(`/api/admin/company/leads?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads ?? []);
        setTotal(data.total ?? 0);
        setPage(p);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [token, effectiveCompanyId, statusFilter, keyword]);

  const onSearch = () => setKeyword(searchInput.trim());

  const submitCreate = async () => {
    setCreateErr("");
    if (!token || !effectiveCompanyId) return;
    const name = createName.trim();
    const phone = createPhone.trim();
    if (!name || !phone) {
      setCreateErr("请填写姓名与电话");
      return;
    }
    const res = await fetch("/api/admin/company/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ companyId: effectiveCompanyId, name, phone }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCreateErr(data.error ?? "创建失败");
      return;
    }
    setShowCreate(false);
    setCreateName("");
    setCreatePhone("");
    load(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (!canAccessCompanyLeads && user?.role !== "admin") {
    return <p className="text-base font-medium text-slate-700">无权限访问线索管理</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">线索管理</h1>
          <p className="mt-1 text-sm text-slate-600">
            当前公司：{company?.name ?? "—"}（与顶部公司选择一致）
          </p>
        </div>
      </div>

      {!effectiveCompanyId ? (
        <p className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {user?.role === "admin"
            ? "请先在顶部选择一家公司；跨公司查看请使用「管理员 → 线索管理」。"
            : "请先在顶部选择所属公司。"}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900">状态</label>
              <select
                className="rounded border border-slate-400 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">全部</option>
                <option value="new">新建</option>
                <option value="assigned">已分配</option>
                <option value="following">跟进中</option>
                <option value="won">成交</option>
                <option value="lost">失败</option>
                <option value="converted">已转客户</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900">姓名 / 手机</label>
              <input
                className="w-48 rounded border border-slate-400 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="输入姓名或手机号"
              />
            </div>
            <button
              type="button"
              onClick={onSearch}
              className="rounded bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-900"
            >
              搜索
            </button>
            {canCreate && (
              <button
                type="button"
                onClick={() => {
                  setCreateErr("");
                  setShowCreate(true);
                }}
                className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                录入线索
              </button>
            )}
          </div>

          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-slate-900">录入线索</h2>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800">姓名</label>
                  <input
                    className="w-full rounded border border-slate-400 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800">手机号</label>
                  <input
                    className="w-full rounded border border-slate-400 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                  />
                </div>
                {createErr && <p className="text-sm text-red-600">{createErr}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-slate-600"
                    onClick={() => setShowCreate(false)}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="rounded bg-indigo-600 px-3 py-1.5 text-white"
                    onClick={submitCreate}
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {loading ? (
              <p className="p-8 text-center text-base font-medium text-slate-700">加载中…</p>
            ) : leads.length === 0 ? (
              <p className="p-8 text-center text-base font-medium text-slate-700">暂无线索</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-slate-900">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">姓名</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">手机</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">状态</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">跟进人</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">更新</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                        <td className="px-4 py-2 font-medium text-slate-800">{row.name}</td>
                        <td className="px-4 py-2 text-slate-800">{row.phone}</td>
                        <td className="px-4 py-2 text-slate-800">{statusLabel(row.status)}</td>
                        <td className="px-4 py-2 text-slate-800">
                          {row.company_user?.user?.nickname ||
                            row.company_user?.user?.mobile ||
                            "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                          {row.updated_at?.slice(0, 16).replace("T", " ")}
                        </td>
                        <td className="px-4 py-2">
                          <Link
                            href={`/dashboard/company/leads/${row.id}`}
                            className="font-medium text-indigo-700 hover:text-indigo-900 hover:underline"
                          >
                            详情
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                className="rounded border border-slate-400 bg-white px-3 py-1.5 text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-40"
              >
                上一页
              </button>
              <span>
                {page} / {totalPages}（共 {total} 条）
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => load(page + 1)}
                className="rounded border border-slate-400 bg-white px-3 py-1.5 text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-40"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
