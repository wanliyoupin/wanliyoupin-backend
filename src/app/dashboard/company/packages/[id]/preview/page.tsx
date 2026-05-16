"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";

type PackageSku = {
  id: number;
  quantity: number;
  sort_order?: number;
  product_sku?: {
    id: number;
    name: string;
    price: number;
    image_url?: string | null;
    product?: { name: string };
  };
};

type Package = {
  id: number;
  name: string;
  cover_image_url?: string | null;
  description?: string | null;
  tags?: string | null;
  is_shelved?: boolean;
  category?: { name?: string; category?: { name?: string; category?: { name?: string } } };
  package_product_skus?: PackageSku[];
};

function getCategoryPath(cat: Package["category"]): string {
  if (!cat?.name) return "未分类";
  const parts: string[] = [];
  let c: Package["category"] = cat;
  while (c?.name) {
    parts.unshift(String(c.name).trim());
    c = c.category as Package["category"];
  }
  return parts.length ? parts.join(" / ") : "未分类";
}

export default function PackagePreviewPage() {
  const params = useParams();
  const id = params?.id as string;
  const { token } = useAuth();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !token) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/company/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setPkg(null);
          return;
        }
        const data = await res.json();
        setPkg(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">加载中…</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="p-6">
        <p className="text-slate-600">套餐不存在或无权查看</p>
        <Link href="/dashboard/company/packages" className="mt-2 inline-block text-indigo-600 hover:underline">
          返回套餐列表
        </Link>
      </div>
    );
  }

  const skus = pkg.package_product_skus ?? [];
  let totalPrice = 0;
  for (const s of skus) {
    const price = s.product_sku?.price ?? 0;
    const qty = s.quantity ?? 1;
    totalPrice += Number(price) * qty;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pb-12">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/dashboard/company/packages"
          className="text-sm text-slate-600 hover:text-indigo-600"
        >
          ← 返回套餐列表
        </Link>
        <Link
          href={`/dashboard/company/packages/${id}/edit`}
          className="text-sm text-indigo-600 hover:underline"
        >
          编辑
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        {/* 封面 */}
        <div className="aspect-[4/3] bg-slate-100">
          {pkg.cover_image_url ? (
            <img
              src={pkg.cover_image_url}
              alt=""
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              暂无封面
            </div>
          )}
        </div>

        {/* 基本信息 */}
        <div className="p-4 border-t border-slate-100">
          <h1 className="text-xl font-semibold text-slate-800">{pkg.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
            <span>{getCategoryPath(pkg.category)}</span>
            <span
              className={`px-2 py-0.5 rounded ${
                pkg.is_shelved ? "bg-slate-100 text-slate-600" : "bg-green-100 text-green-700"
              }`}
            >
              {pkg.is_shelved ? "已下架" : "已上架"}
            </span>
            {pkg.tags && (
              <span className="text-slate-500">标签：{pkg.tags}</span>
            )}
          </div>
          {skus.length > 0 && (
            <div className="mt-2 text-lg font-medium text-indigo-600">
              套餐总价：¥{totalPrice.toFixed(2)}
            </div>
          )}
        </div>

        {/* 套餐介绍 */}
        {pkg.description && (
          <div className="px-4 pb-4">
            <h2 className="text-sm font-medium text-slate-700 mb-2">套餐介绍</h2>
            <div className="text-slate-600 text-sm whitespace-pre-wrap">
              {pkg.description}
            </div>
          </div>
        )}

        {/* 包含商品 */}
        {skus.length > 0 && (
          <div className="px-4 pb-4 border-t border-slate-100 pt-4">
            <h2 className="text-sm font-medium text-slate-700 mb-3">包含商品</h2>
            <div className="space-y-2">
              {skus.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  {s.product_sku?.image_url && (
                    <img
                      src={s.product_sku.image_url}
                      alt=""
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800">{s.product_sku?.name ?? "未知"}</div>
                    <div className="text-sm text-slate-500">
                      ¥{Number(s.product_sku?.price ?? 0).toFixed(2)} × {s.quantity ?? 1} = ¥
                      {(Number(s.product_sku?.price ?? 0) * (s.quantity ?? 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
