"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/auth-context";
import Link from "next/link";

type Stats = {
  companiesCount?: number;
  usersCount?: number;
  ordersCount?: number;
  ordersAmount?: number;
  ordersPending?: number;
  ordersConfirmed?: number;
  ordersCompleted?: number;
};

function StatCard({
  title,
  value,
  sub,
  href,
}: {
  title: string;
  value: string | number;
  sub?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-800">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-400">{sub}</div>}
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block hover:opacity-90">
        {content}
      </Link>
    );
  }
  return content;
}

export default function AdminDashboardPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    (async () => {
      try {
        const res = await fetch("/api/admin/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, user?.role]);

  if (user?.role !== "admin") {
    return (
      <div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">数据看板</h1>
        <p className="text-slate-600">仅平台管理员可查看。</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-slate-500">加载中…</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">平台数据看板</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="公司数量"
          value={stats?.companiesCount ?? 0}
          href="/dashboard/companies"
        />
        <StatCard
          title="平台用户数"
          value={stats?.usersCount ?? 0}
          href="/dashboard/accounts"
        />
        <StatCard
          title="订单总数"
          value={stats?.ordersCount ?? 0}
        />
        <StatCard
          title="确认收款总金额"
          value={`¥${(stats?.ordersAmount ?? 0).toLocaleString("zh-CN")}`}
        />
      </div>
      <div className="mt-6">
        <h2 className="text-sm font-medium text-slate-700 mb-2">订单状态分布</h2>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg border border-slate-200 bg-amber-50 px-4 py-2">
            <span className="text-sm text-slate-600">待确认</span>
            <span className="ml-2 font-semibold text-amber-700">{stats?.ordersPending ?? 0}</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-blue-50 px-4 py-2">
            <span className="text-sm text-slate-600">已确认</span>
            <span className="ml-2 font-semibold text-blue-700">{stats?.ordersConfirmed ?? 0}</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-green-50 px-4 py-2">
            <span className="text-sm text-slate-600">已完成</span>
            <span className="ml-2 font-semibold text-green-700">{stats?.ordersCompleted ?? 0}</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        数据维度：公司数量、平台用户数、订单总数（含各状态）、确认收款总金额。
      </p>
    </div>
  );
}
