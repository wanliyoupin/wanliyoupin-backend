"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/auth-context";

type UserRow = {
  id: number;
  mobile?: string | null;
  nickname?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  created_at?: string;
  wx_mini_openid?: string | null;
  company_users?: { company?: { id: number; name?: string | null } | null }[];
};

function formatUserCompanies(u: UserRow): string {
  const names = (u.company_users ?? [])
    .map((row) => row.company?.name?.trim())
    .filter((n): n is string => Boolean(n && n.length > 0));
  if (names.length === 0) return "—";
  return names.join("、");
}

export default function AccountsPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "user" | "admin" | "wx_guest_user">("");

  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const loadUsers = async (pageNum: number) => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String((pageNum - 1) * pageSize),
      });
      if (keyword) params.set("keyword", keyword);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
        setPage(pageNum);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, [token, keyword, roleFilter]);

  const onSearch = () => setKeyword(searchInput.trim());

  const openEdit = (u: UserRow) => {
    if (u.role === "wx_guest_user") return;
    setEditingUser(u);
    setEditRole(u.role === "admin" ? "admin" : "user");
    setEditOpen(true);
  };

  const roleLabel = (role: string | null | undefined) => {
    if (role === "admin") return "管理员";
    if (role === "wx_guest_user") return "微信访客";
    return "普通用户";
  };

  const handleEditSave = async () => {
    if (!editingUser || !token) return;
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: editRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditOpen(false);
        setEditingUser(null);
        loadUsers(page);
      } else {
        alert(data?.error || "更新失败");
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">账号列表</h1>
        <p className="text-slate-600">仅平台管理员可查看。</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">账号列表</h1>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="手机号 / 昵称 / OpenID"
          className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={onSearch}
          className="rounded-lg bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700"
        >
          搜索
        </button>
        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter((e.target.value || "") as "" | "user" | "admin" | "wx_guest_user")
          }
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">全部角色</option>
          <option value="user">普通用户</option>
          <option value="admin">管理员</option>
          <option value="wx_guest_user">微信访客</option>
        </select>
      </div>

      {loading && users.length === 0 ? (
        <p className="text-slate-500">加载中…</p>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">头像</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">昵称</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">手机号 / OpenID</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-slate-600 min-w-[12rem]">
                  所属公司
                </th>
                <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">角色</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const companiesText = formatUserCompanies(u);
                return (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                        {(u.nickname || u.mobile || u.wx_mini_openid || "U")[0]}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-800">
                    {u.nickname ||
                      (u.role === "wx_guest_user" ? "匿名访客" : "—")}
                  </td>
                  <td className="py-2 px-3 text-slate-600">
                    {u.mobile ||
                      (u.role === "wx_guest_user" && u.wx_mini_openid ? (
                        <span className="font-mono text-xs break-all" title="小程序 OpenID">
                          {u.wx_mini_openid}
                        </span>
                      ) : (
                        "—"
                      ))}
                  </td>
                  <td
                    className="py-2 px-3 text-slate-600 text-sm max-w-xs align-top"
                    title={companiesText === "—" ? undefined : companiesText}
                  >
                    {companiesText}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        u.role === "admin"
                          ? "bg-indigo-100 text-indigo-800"
                          : u.role === "wx_guest_user"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {u.role === "wx_guest_user" ? (
                      <span className="text-slate-400 text-sm" title="微信访客不支持修改角色">
                        —
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        编辑
                      </button>
                    )}
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => loadUsers(page - 1)}
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
            onClick={() => loadUsers(page + 1)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      {users.length === 0 && !loading && (
        <p className="text-slate-500 py-8 text-center">暂无用户</p>
      )}

      {/* 编辑角色弹窗 */}
      {editOpen && editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !editSubmitting && setEditOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-medium text-slate-800 mb-3">编辑角色</div>
            <div className="mb-3 text-slate-600 text-sm">
              {editingUser.nickname || "—"} / {editingUser.mobile || "—"}
            </div>
            <div className="mb-4">
              <label className="block text-sm text-slate-700 mb-1">角色</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as "user" | "admin")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">微信访客仅匿名登录生成，不可在此指派或修改。</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={editSubmitting}
                className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                disabled={editSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {editSubmitting ? "保存中…" : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
