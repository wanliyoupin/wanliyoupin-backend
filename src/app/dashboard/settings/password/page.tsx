"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";

export default function SetPasswordPage() {
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const newPwd = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!newPwd) {
      setError("请输入新密码");
      return;
    }
    if (newPwd.length < 6) {
      setError("密码至少 6 位");
      return;
    }
    if (newPwd !== confirm) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword.trim() || undefined,
          newPassword: newPwd,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "设置失败");
        return;
      }
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "网络异常");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold text-slate-800 mb-2">设置密码</h1>
      <p className="text-slate-600 text-sm mb-6">
        设置密码后可使用手机号+密码登录管理后台
      </p>

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg text-sm">
          密码设置成功
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            原密码
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="如已设置过密码请填写"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            新密码
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="至少 6 位"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            确认新密码
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入新密码"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoComplete="new-password"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "提交中…" : "确认设置"}
          </button>
          <Link
            href="/dashboard/profile"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-700 font-medium hover:bg-slate-50"
          >
            返回
          </Link>
        </div>
      </form>
    </div>
  );
}
