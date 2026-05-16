"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!mobile.trim() || !password) {
      setError("请输入手机号和密码");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "登录失败");
        return;
      }
      login(data.token, data.user);
      router.replace("/dashboard/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "网络异常");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-lg p-8">
        <h1 className="text-xl font-semibold text-center text-slate-800 mb-6">
          管理后台登录
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              手机号
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="请输入手机号"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              maxLength={11}
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
