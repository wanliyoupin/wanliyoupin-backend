"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";

function platformRoleLabel(role: string | undefined | null) {
  if (role === "admin") return "平台管理员";
  if (role === "wx_guest_user") return "微信访客";
  return "普通用户";
}

function companyRoleLabel(role: string | undefined | null) {
  if (role === "admin") return "公司管理员";
  return "公司成员";
}

export default function ProfilePage() {
  const { user, company, company_users, isAdminForSelectedCompany } = useAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">个人中心</h1>
      <p className="text-sm text-slate-500 mb-6">
        切换顶部公司后，将回到本页。若需使用「我的公司」下的管理功能，请先在该公司具备管理员权限后再进入对应菜单。
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
        <h2 className="text-sm font-medium text-slate-600 mb-3">账号信息</h2>
        <div className="flex items-start gap-4">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-lg font-medium">
              {(user?.nickname || user?.mobile || "用")[0]}
            </div>
          )}
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-slate-500">昵称：</span>
              <span className="text-slate-800">{user?.nickname || "—"}</span>
            </p>
            <p>
              <span className="text-slate-500">手机号：</span>
              <span className="text-slate-800">{user?.mobile || "—"}</span>
            </p>
            <p>
              <span className="text-slate-500">平台角色：</span>
              <span className="text-slate-800">{platformRoleLabel(user?.role)}</span>
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link
            href="/dashboard/settings/password"
            className="text-sm text-indigo-600 hover:underline"
          >
            修改登录密码 →
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-600 mb-3">我加入的公司</h2>
        {company_users.length === 0 ? (
          <p className="text-sm text-slate-500">暂无公司成员关系。</p>
        ) : (
          <ul className="space-y-2">
            {company_users.map((cu) => {
              const isCurrent = company && Number(cu.company.id) === Number(company.id);
              const canManageHere = cu.role === "admin";
              return (
                <li
                  key={cu.company.id}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
                    isCurrent ? "bg-indigo-50 border border-indigo-100" : "bg-slate-50"
                  }`}
                >
                  <span className="font-medium text-slate-800">{cu.company.name}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      canManageHere
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {companyRoleLabel(cu.role)}
                  </span>
                  {isCurrent && (
                    <span className="text-xs text-indigo-600 w-full sm:w-auto">当前选中</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {company && (
          <p className="mt-3 text-xs text-slate-500">
            当前公司「{company.name}」
            {isAdminForSelectedCompany ? "：您具备公司管理员权限，可使用左侧「我的公司」菜单。" : "：您为普通成员，左侧不展示公司管理菜单。"}
          </p>
        )}
      </div>
    </div>
  );
}
