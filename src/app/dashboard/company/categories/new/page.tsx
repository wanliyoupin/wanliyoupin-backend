"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";
import { ImageUpload } from "@/app/components/ImageUpload";
import { ParentCategoryPicker } from "@/app/components/ParentCategoryPicker";

export default function NewCategoryPage() {
  const router = useRouter();
  const { token, company, isAdminForSelectedCompany } = useAuth();
  const [name, setName] = useState("");
  const [icon_url, setIconUrl] = useState("");
  const [type, setType] = useState<"product" | "package">("product");
  const [route_ui_style, setRouteUiStyle] = useState<"categories" | "products">("categories");
  const [sort_order, setSortOrder] = useState(0);
  const [parent_categories, setParentCategories] = useState<number | null>(null);
  const [parentLevel, setParentLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (type === "package") {
      setParentCategories(null);
      setParentLevel(0);
      setRouteUiStyle("products");
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !icon_url.trim()) {
      setError("请填写分类名称并上传或填写图标");
      return;
    }
    if (!company || !token || !isAdminForSelectedCompany) {
      setError("无权限或未选择公司");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/company/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyId: company.id,
          name: name.trim(),
          icon_url: icon_url.trim(),
          type,
          route_ui_style,
          sort_order: Number(sort_order) || 0,
          level: type === "package" ? 0 : parentLevel,
          parent_categories: type === "package" ? null : parent_categories,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "保存失败");
        return;
      }
      router.push("/dashboard/company/categories");
    } catch {
      setError("网络异常");
    } finally {
      setLoading(false);
    }
  };

  if (!company) {
    return (
      <div>
        <p className="text-slate-600">请先选择公司。</p>
        <Link href="/dashboard/company/categories" className="text-indigo-600 mt-2 inline-block">
          返回分类列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/dashboard/company/categories"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← 返回分类列表
        </Link>
      </div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">添加分类</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">分类名称 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
            placeholder="请输入分类名称"
            maxLength={20}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">图标 *</label>
          <ImageUpload
            value={icon_url}
            onChange={setIconUrl}
            square
            placeholder="点击上传图标"
            className="mb-2"
          />
          <input
            type="url"
            value={icon_url}
            onChange={(e) => setIconUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 text-sm"
            placeholder="或输入图片 URL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">分类类型 *</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("product")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "product" ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-500" : "bg-slate-100 text-slate-600 border-2 border-transparent"
              }`}
            >
              产品分类
            </button>
            <button
              type="button"
              onClick={() => setType("package")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "package" ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-500" : "bg-slate-100 text-slate-600 border-2 border-transparent"
              }`}
            >
              套餐分类
            </button>
          </div>
          {type === "package" && (
            <p className="text-xs text-slate-500 mt-1">套餐分类固定为顶级，无需设置父级</p>
          )}
        </div>
        {type === "product" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">父级分类</label>
              <ParentCategoryPicker
                value={parent_categories}
                onChange={(id, level) => {
                  setParentCategories(id);
                  setParentLevel(level);
                }}
                companyId={company.id}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">展示方式</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRouteUiStyle("categories")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    route_ui_style === "categories" ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-500" : "bg-slate-100 text-slate-600 border-2 border-transparent"
                  }`}
                >
                  继续展示分类
                </button>
                <button
                  type="button"
                  onClick={() => setRouteUiStyle("products")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    route_ui_style === "products" ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-500" : "bg-slate-100 text-slate-600 border-2 border-transparent"
                  }`}
                >
                  展示产品
                </button>
              </div>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">排序 *</label>
          <input
            type="number"
            value={sort_order}
            onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
            placeholder="数字越小越靠前"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "保存中…" : "保存"}
          </button>
          <Link
            href="/dashboard/company/categories"
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
