"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";

type AdminCompanyRow = { id: number; name: string };

type LeadRow = {
  id: number;
  name: string;
  phone: string;
  status: string;
  company_companies?: number;
  company?: { id: number; name: string } | null;
  assigned_company_users?: number | null;
  created_at: string;
  updated_at: string;
  company_user?: { id: number; user?: { nickname?: string; mobile?: string } } | null;
  companyUserByCreatedByCompanyUsers?: { user?: { nickname?: string; mobile?: string } } | null;
};

function leadDetailCompanyId(row: LeadRow): number | null {
  const a = row.company?.id;
  if (a != null && Number.isFinite(Number(a))) return Number(a);
  const b = row.company_companies;
  if (b != null && Number.isFinite(Number(b))) return Number(b);
  return null;
}

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

/** 平台管理员：跨公司查看与维护线索（与「我的公司 → 线索管理」分离） */
export default function AdminLeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user } = useAuth();
  const companyIdFromUrl = searchParams.get("companyId");
  const [adminCompanyId, setAdminCompanyId] = useState<number | null>(() => {
    if (!companyIdFromUrl) return null;
    const n = Number(companyIdFromUrl);
    return Number.isNaN(n) ? null : n;
  });
  const [adminCompanies, setAdminCompanies] = useState<AdminCompanyRow[]>([]);

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

  useEffect(() => {
    if (user?.role !== "admin" || !token) return;
    fetch("/api/admin/companies?limit=200&offset=0", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const rows = data?.companies ?? [];
        setAdminCompanies(rows.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })));
      })
      .catch(() => {});
  }, [user?.role, token]);

  useEffect(() => {
    if (companyIdFromUrl && !Number.isNaN(Number(companyIdFromUrl))) {
      setAdminCompanyId(Number(companyIdFromUrl));
    } else {
      setAdminCompanyId(null);
    }
  }, [companyIdFromUrl]);

  const load = async (p: number) => {
    if (!token) {
      setLeads([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String((p - 1) * pageSize),
      });
      if (adminCompanyId != null) params.set("companyId", String(adminCompanyId));
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
      } else {
        setLeads([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [token, adminCompanyId, statusFilter, keyword]);

  const onSearch = () => setKeyword(searchInput.trim());

  const submitCreate = async () => {
    setCreateErr("");
    if (!token || !adminCompanyId) return;
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
      body: JSON.stringify({ companyId: adminCompanyId, name, phone }),
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

  if (user?.role !== "admin") {
    return (
      <p className="text-base font-medium text-slate-700">
        仅平台管理员可访问本页。公司成员请使用「我的公司 → 线索管理」。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">线索管理</h1>
          <p className="mt-1 text-sm text-slate-600">
            默认展示全平台线索；公司下拉仅用于筛选某一公司的线索（与顶部「我的公司」无关）。
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-sm font-semibold text-slate-900">公司</span>
          <select
            className="min-w-[200px] rounded border border-slate-400 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={adminCompanyId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                setAdminCompanyId(null);
                router.replace("/dashboard/admin/leads");
                return;
              }
              const id = Number(v);
              setAdminCompanyId(id);
              router.replace(`/dashboard/admin/leads?companyId=${id}`);
            }}
          >
            <option value="">全平台</option>
            {adminCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {adminCompanyId == null && (
        <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          当前为<strong className="font-semibold">全平台</strong>列表。选择公司后仅显示该公司线索；录入新线索需先选择目标公司。
        </p>
      )}

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
            {adminCompanyId != null ? (
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
            ) : (
              <span className="self-end text-xs text-slate-500">录入线索请先选择公司</span>
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
                      {adminCompanyId == null && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">公司</th>
                      )}
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
                        {adminCompanyId == null && (
                          <td className="max-w-[10rem] truncate px-4 py-2 text-slate-800">
                            {row.company?.name ?? `公司 #${row.company_companies ?? "—"}`}
                          </td>
                        )}
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
                          {(() => {
                            const cid = leadDetailCompanyId(row) ?? adminCompanyId;
                            if (cid == null) {
                              return <span className="text-slate-400">—</span>;
                            }
                            return (
                              <Link
                                href={`/dashboard/admin/leads/${row.id}?companyId=${cid}`}
                                className="font-medium text-indigo-700 hover:text-indigo-900 hover:underline"
                              >
                                详情
                              </Link>
                            );
                          })()}
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
    </div>
  );
}
