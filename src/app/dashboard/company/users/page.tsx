"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";

type CompanyUser = {
  id: number;
  role: string;
  level?: string | null;
  can_view_price?: boolean;
  price_factor?: number;
  permissions?: string | null;
  user?: {
    id: number;
    mobile?: string;
    nickname?: string;
    avatar_url?: string | null;
    role?: string | null;
  };
};

const LEVELS = ["A", "B", "C", "D", "E"] as const;

function leadPermKeys(p: string | null | undefined): Set<string> {
  if (p == null || !String(p).trim()) return new Set();
  return new Set(
    String(p)
      .split("&")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

function leadPermissionsPayload(adminLead: boolean): string | null {
  return adminLead ? "admin_lead" : null;
}

function leadPermSummary(u: CompanyUser): string | null {
  if (u.role === "admin") return "公司管理员（默认含线索管理）";
  const k = leadPermKeys(u.permissions);
  if (k.has("admin_lead")) return "线索管理";
  return null;
}

export default function CompanyUsersPage() {
  const searchParams = useSearchParams();
  const { token, company, user, isAdminForSelectedCompany } = useAuth();
  const companyIdFromUrl = searchParams.get("companyId");
  const auditFromUrl = searchParams.get("audit") === "1";
  const effectiveCompanyId =
    user?.role === "admin" && companyIdFromUrl && !Number.isNaN(Number(companyIdFromUrl))
      ? Number(companyIdFromUrl)
      : company?.id;
  const isAuditMode = user?.role === "admin" && auditFromUrl && !!companyIdFromUrl;
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "user" | "admin">("");
  const [levelFilter, setLevelFilter] = useState<string>("");

  const [addOpen, setAddOpen] = useState(false);
  const [addMobile, setAddMobile] = useState("");
  const [addRole, setAddRole] = useState<"user" | "admin">("user");
  const [addLevel, setAddLevel] = useState<string>("A");
  const [addCanViewPrice, setAddCanViewPrice] = useState(true);
  const [addPriceFactor, setAddPriceFactor] = useState("1");
  const [addAdminLead, setAddAdminLead] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [searchedUser, setSearchedUser] = useState<{ id: number; mobile?: string | null; nickname?: string | null; avatar_url?: string | null } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showCreateAndAddMode, setShowCreateAndAddMode] = useState(false);
  const [searchingUser, setSearchingUser] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [editLevel, setEditLevel] = useState("A");
  const [editCanViewPrice, setEditCanViewPrice] = useState(true);
  const [editPriceFactor, setEditPriceFactor] = useState("1");
  const [editAdminLead, setEditAdminLead] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [batchOpen, setBatchOpen] = useState(false);
  const [batchMode, setBatchMode] = useState<"price_visible" | "price_factor">("price_visible");
  const [batchLevel, setBatchLevel] = useState<string>("A");
  const [batchCanViewPrice, setBatchCanViewPrice] = useState(false);
  const [batchPriceFactor, setBatchPriceFactor] = useState("1");
  const [batchSubmitting, setBatchSubmitting] = useState(false);

  const [companyDefaults, setCompanyDefaults] = useState<{ default_for_price_factor: number } | null>(null);

  const loadCompanyDefaults = async () => {
    if (!token || !effectiveCompanyId) return;
    try {
      const res = await fetch(`/api/admin/company/${effectiveCompanyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data) {
        setCompanyDefaults({
          default_for_price_factor: Number(data.default_for_price_factor) || 1,
        });
      } else {
        setCompanyDefaults({ default_for_price_factor: 1 });
      }
    } catch {
      setCompanyDefaults({ default_for_price_factor: 1 });
    }
  };

  const load = async (pageNum: number) => {
    if (!token || !effectiveCompanyId) return;
    const params = new URLSearchParams({
      companyId: String(effectiveCompanyId),
      limit: String(pageSize),
      offset: String((pageNum - 1) * pageSize),
    });
    if (keyword) params.set("keyword", keyword);
    if (roleFilter) params.set("role", roleFilter);
    if (levelFilter) params.set("level", levelFilter);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/company/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
        setCurrentPage(pageNum);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [token, effectiveCompanyId, keyword, roleFilter, levelFilter]);

  useEffect(() => {
    loadCompanyDefaults();
  }, [token, effectiveCompanyId]);

  const openAddModal = () => {
    const d = companyDefaults;
    setAddCanViewPrice(true);
    setAddPriceFactor(d?.default_for_price_factor != null ? String(d.default_for_price_factor) : "1");
    setSearchedUser(null);
    setHasSearched(false);
    setShowCreateAndAddMode(false);
    setAddOpen(true);
  };

  const searchUserByMobile = async () => {
    const mobile = addMobile.replace(/\D/g, "");
    if (mobile.length !== 11 || !token || !effectiveCompanyId) return;
    setSearchingUser(true);
    setSearchedUser(null);
    setShowCreateAndAddMode(false);
    try {
      const res = await fetch(
        `/api/admin/company/users/search-by-mobile?mobile=${encodeURIComponent(mobile)}&companyId=${effectiveCompanyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        if (data?.id) {
          setSearchedUser(data);
        } else {
          setShowCreateAndAddMode(true);
        }
        setHasSearched(true);
      } else {
        alert(data?.error || "搜索失败");
      }
    } catch {
      alert("搜索失败");
    } finally {
      setSearchingUser(false);
    }
  };

  const isCreateAndAddMode = hasSearched && !searchedUser && showCreateAndAddMode;
  const canAddUser = hasSearched && (searchedUser || isCreateAndAddMode);

  const onSearch = () => setKeyword(searchInput.trim());

  const countText = (() => {
    const n = total;
    const parts: string[] = [];
    if (roleFilter === "user") parts.push("普通用户");
    if (roleFilter === "admin") parts.push("管理员");
    if (levelFilter) parts.push(`等级${levelFilter}`);
    if (parts.length === 0) return `共 ${n} 人`;
    return `${parts.join("、")} 共 ${n} 人`;
  })();

  const handleBatchUpdate = async () => {
    if (!token || !effectiveCompanyId) return;
    if (batchMode === "price_factor") {
      const v = Number(batchPriceFactor);
      if (Number.isNaN(v) || v <= 0) {
        alert("价格系数必须大于 0");
        return;
      }
    }
    setBatchSubmitting(true);
    try {
      const res = await fetch("/api/admin/company/users/batch-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyId: effectiveCompanyId,
          level: batchLevel,
          updates:
            batchMode === "price_visible"
              ? { can_view_price: batchCanViewPrice }
              : { price_factor: Number(batchPriceFactor) },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`已更新 ${data.updated ?? 0} 人`);
        setBatchOpen(false);
        load(currentPage);
      } else {
        alert(data?.error || "批量修改失败");
      }
    } catch {
      alert("批量修改失败");
    } finally {
      setBatchSubmitting(false);
    }
  };

  const handleAdd = async () => {
    if (!canAddUser) return;
    const mobile = addMobile.trim().replace(/\D/g, "");
    if (mobile.length !== 11) {
      alert("请输入 11 位手机号");
      return;
    }
    const factor = Number(addPriceFactor);
    if (Number.isNaN(factor) || factor <= 0) {
      alert("价格系数需大于 0");
      return;
    }
    if (!token || !effectiveCompanyId) return;
    setAddSubmitting(true);
    try {
      const res = await fetch("/api/admin/company/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyId: effectiveCompanyId,
          mobile,
          role: addRole,
          level: addLevel,
          can_view_price: addCanViewPrice,
          price_factor: factor,
          permissions: leadPermissionsPayload(addAdminLead),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddOpen(false);
        setAddMobile("");
        setAddRole("user");
        setAddLevel("A");
        setAddCanViewPrice(true);
        setAddPriceFactor("1");
        setAddAdminLead(false);
        setSearchedUser(null);
        setHasSearched(false);
        setShowCreateAndAddMode(false);
        load(1);
      } else {
        alert(data?.error || "添加失败");
      }
    } catch {
      alert("网络异常");
    } finally {
      setAddSubmitting(false);
    }
  };

  const openEdit = (u: CompanyUser) => {
    setEditingUser(u);
    setEditRole((u.role === "admin" ? "admin" : "user") as "user" | "admin");
    setEditLevel(u.level || "A");
    setEditCanViewPrice(u.can_view_price ?? true);
    setEditPriceFactor(u.price_factor != null ? String(u.price_factor) : "1");
    const pk = leadPermKeys(u.permissions);
    setEditAdminLead(pk.has("admin_lead"));
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editingUser || !token) return;
    const factor = Number(editPriceFactor);
    if (Number.isNaN(factor) || factor <= 0) {
      alert("价格系数需大于 0");
      return;
    }
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/admin/company/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: editRole,
          level: editLevel,
          can_view_price: editCanViewPrice,
          price_factor: factor,
          permissions: leadPermissionsPayload(editAdminLead),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditOpen(false);
        setEditingUser(null);
        load(currentPage);
      } else {
        alert(data?.error || "更新失败");
      }
    } catch {
      alert("网络异常");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleRemoveFromCompany = async (u: CompanyUser) => {
    if (!token) return;
    const name = u.user?.nickname || u.user?.mobile || "该用户";
    if (!window.confirm(`确定将「${name}」从本公司移除？移除后对方不再归属该公司，账号本身不受影响。`)) {
      return;
    }
    setDeletingId(u.id);
    try {
      const res = await fetch(`/api/admin/company/users/${u.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const nextPage = users.length <= 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        await load(nextPage);
      } else {
        alert((data as { error?: string }).error || "移除失败");
      }
    } catch {
      alert("网络异常");
    } finally {
      setDeletingId(null);
    }
  };

  if (!effectiveCompanyId) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">用户管理</h1>
        <p className="text-slate-600">请先在顶部选择公司。</p>
      </div>
    );
  }

  return (
    <div>
      {isAuditMode && (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-amber-800 text-sm">
          核查模式：仅查看，不可操作
        </div>
      )}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-slate-800">用户管理</h1>
        {!isAuditMode && (user?.role === "admin" || (effectiveCompanyId === company?.id && isAdminForSelectedCompany)) && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBatchOpen(true)}
              className="px-3 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              批量修改
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              + 添加用户
            </button>
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="搜索昵称或手机号"
          className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={onSearch}
          className="rounded-lg bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700"
        >
          搜索
        </button>
        <span className="text-sm font-medium text-slate-600">角色：</span>
        {(["", "user", "admin"] as const).map((r) => (
          <button
            key={r || "all"}
            type="button"
            onClick={() => setRoleFilter(r)}
            className={`rounded-lg px-3 py-1.5 text-sm ${roleFilter === r ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
          >
            {r === "" ? "全部" : r === "admin" ? "管理员" : "普通用户"}
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-slate-600">等级：</span>
        {["", ...LEVELS].map((lv) => (
          <button
            key={lv || "all"}
            type="button"
            onClick={() => setLevelFilter(lv)}
            className={`rounded-lg px-3 py-1.5 text-sm ${levelFilter === lv ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
          >
            {lv || "全部"}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500 mb-2">{countText}</p>

      {loading && users.length === 0 ? (
        <p className="text-slate-500">加载中…</p>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          {keyword || roleFilter || levelFilter ? "未找到匹配的用户" : "暂无用户"}
          {!isAuditMode && (user?.role === "admin" || (effectiveCompanyId === company?.id && isAdminForSelectedCompany)) && (
            <div className="mt-2">
              <button
                type="button"
                onClick={openAddModal}
                className="text-indigo-600 hover:underline"
              >
                添加用户
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => {
            const permLine = leadPermSummary(u);
            return (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200"
            >
              <div className="flex items-center gap-3">
                {u.user?.avatar_url ? (
                  <img src={u.user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm">
                    {u.user?.nickname?.[0] || u.user?.mobile?.[0] || "U"}
                  </div>
                )}
                <div>
                  <div className="font-medium text-slate-800">{u.user?.nickname || u.user?.mobile || "—"}</div>
                  <div className="text-sm text-slate-500">
                    {u.user?.mobile || "—"}
                    <span className="ml-2">{u.role === "admin" ? "管理员" : "用户"}</span>
                    <span className="ml-2">等级 {u.level || "A"}</span>
                    <span className="ml-2">{u.can_view_price ? "可查看价格" : "不可查看价格"}</span>
                    <span className="ml-2">系数 {u.price_factor}</span>
                    {permLine && (
                      <span className="ml-2 text-slate-600">· {permLine}</span>
                    )}
                  </div>
                </div>
              </div>
              {!isAuditMode && (user?.role === "admin" || (effectiveCompanyId === company?.id && isAdminForSelectedCompany)) && (
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(u)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRemoveFromCompany(u)}
                    disabled={deletingId === u.id}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === u.id ? "移除中…" : "移除"}
                  </button>
                </div>
              )}
            </div>
          );
          })}
          {total > pageSize && (
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-slate-600">
                第 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} 条，共 {total} 条
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => load(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <button
                  type="button"
                  onClick={() => load(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 添加用户弹窗 */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20" onClick={() => setAddOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-medium text-slate-800 mb-4">添加用户</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">手机号 *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addMobile}
                    onChange={(e) => {
                      setAddMobile(e.target.value.replace(/\D/g, "").slice(0, 11));
                      setSearchedUser(null);
                      setHasSearched(false);
                      setShowCreateAndAddMode(false);
                    }}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="11 位手机号"
                    maxLength={11}
                  />
                  <button
                    type="button"
                    onClick={searchUserByMobile}
                    disabled={searchingUser || addMobile.replace(/\D/g, "").length !== 11}
                    className="rounded-lg px-3 py-2 text-sm border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {searchingUser ? "搜索中…" : "搜索用户"}
                  </button>
                </div>
              </div>
              {searchedUser && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  {searchedUser.avatar_url ? (
                    <img src={searchedUser.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-medium">
                      {(searchedUser.nickname || searchedUser.mobile || "U")[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-slate-800">{searchedUser.nickname || searchedUser.mobile || "—"}</div>
                    <div className="text-sm text-slate-500">{searchedUser.mobile}</div>
                  </div>
                </div>
              )}
              {showCreateAndAddMode && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  <div className="font-medium">该手机号尚未注册</div>
                  <div className="mt-1 text-amber-700">请设置角色与价格系数后，点击下方「创建并添加」</div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">角色</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAddRole("user")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${addRole === "user" ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                  >
                    普通用户
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddRole("admin")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${addRole === "admin" ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                  >
                    管理员
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">等级</label>
                <div className="flex gap-1 flex-wrap">
                  {LEVELS.map((lv) => (
                    <button
                      key={lv}
                      type="button"
                      onClick={() => setAddLevel(lv)}
                      className={`px-2 py-1 rounded-lg text-sm ${addLevel === lv ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add_can_view_price"
                  checked={addCanViewPrice}
                  onChange={(e) => setAddCanViewPrice(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="add_can_view_price" className="text-sm text-slate-700">可查看价格</label>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                <div className="text-sm font-semibold text-slate-800">线索权限</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  勾选后，成员可进入线索管理：录入线索，并编辑、跟进<strong>自己录入</strong>的线索。公司管理员无需勾选即可使用。
                </p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-800">
                    <input
                      type="checkbox"
                      checked={addAdminLead}
                      onChange={(e) => setAddAdminLead(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    线索管理（录入、编辑、跟进自己的线索）
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">价格系数</label>
                <input
                  type="text"
                  value={addPriceFactor}
                  onChange={(e) => setAddPriceFactor(e.target.value.replace(/[^\d.]/g, ""))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setAddOpen(false)} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100">
                取消
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={addSubmitting || !canAddUser}
                className="px-3 py-1.5 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addSubmitting ? "提交中…" : isCreateAndAddMode ? "创建并添加" : "确定添加"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑用户弹窗 */}
      {editOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20" onClick={() => setEditOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-medium text-slate-800 mb-4">编辑用户</h3>
            <p className="text-sm text-slate-500 mb-3">{editingUser.user?.mobile} {editingUser.user?.nickname}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">角色</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditRole("user")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${editRole === "user" ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                  >
                    普通用户
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditRole("admin")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${editRole === "admin" ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                  >
                    管理员
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">等级</label>
                <div className="flex gap-1 flex-wrap">
                  {LEVELS.map((lv) => (
                    <button
                      key={lv}
                      type="button"
                      onClick={() => setEditLevel(lv)}
                      className={`px-2 py-1 rounded-lg text-sm ${editLevel === lv ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_can_view_price"
                  checked={editCanViewPrice}
                  onChange={(e) => setEditCanViewPrice(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="edit_can_view_price" className="text-sm text-slate-700">可查看价格</label>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                <div className="text-sm font-semibold text-slate-800">线索权限</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  勾选后，成员可录入线索，并编辑、跟进<strong>自己录入</strong>的线索。公司管理员默认拥有完整线索权限。
                </p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-800">
                    <input
                      type="checkbox"
                      checked={editAdminLead}
                      onChange={(e) => setEditAdminLead(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    线索管理（录入、编辑、跟进自己的线索）
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">价格系数</label>
                <input
                  type="text"
                  value={editPriceFactor}
                  onChange={(e) => setEditPriceFactor(e.target.value.replace(/[^\d.]/g, ""))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setEditOpen(false)} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100">
                取消
              </button>
              <button
                type="button"
                onClick={handleEdit}
                disabled={editSubmitting}
                className="px-3 py-1.5 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editSubmitting ? "保存中…" : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 批量修改弹窗 */}
      {batchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20" onClick={() => setBatchOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-medium text-slate-800 mb-4">批量修改</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">修改类型</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBatchMode("price_visible")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${batchMode === "price_visible" ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                  >
                    批量显隐价格
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchMode("price_factor")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${batchMode === "price_factor" ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                  >
                    批量改价格系数
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">选择等级</label>
                <div className="flex gap-1 flex-wrap">
                  {LEVELS.map((lv) => (
                    <button
                      key={lv}
                      type="button"
                      onClick={() => setBatchLevel(lv)}
                      className={`px-2 py-1 rounded-lg text-sm ${batchLevel === lv ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
              {batchMode === "price_visible" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="batch_can_view_price"
                    checked={batchCanViewPrice}
                    onChange={(e) => setBatchCanViewPrice(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="batch_can_view_price" className="text-sm text-slate-700">是否展示价格</label>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">价格系数</label>
                  <input
                    type="text"
                    value={batchPriceFactor}
                    onChange={(e) => setBatchPriceFactor(e.target.value.replace(/[^\d.]/g, ""))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="如 1 或 0.9 表示9折"
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setBatchOpen(false)} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100">
                取消
              </button>
              <button
                type="button"
                onClick={handleBatchUpdate}
                disabled={batchSubmitting}
                className="px-3 py-1.5 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {batchSubmitting ? "提交中…" : "确定"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
