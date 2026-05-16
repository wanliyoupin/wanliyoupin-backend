"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";
import { ImageUpload } from "@/app/components/ImageUpload";
import { CategoryPicker } from "@/app/components/CategoryPicker";

type PackageSkuItem = {
  id?: number;
  product_sku: { id: number; name: string; price: number; image_url?: string; product?: { name: string } };
  quantity: number;
  sort_order?: number;
};

export default function NewPackagePage() {
  const router = useRouter();
  const { token, company, isAdminForSelectedCompany, systemCompanyId } = useAuth();
  const [name, setName] = useState("");
  const [cover_image_url, setCoverImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [sort_order, setSortOrder] = useState(0);
  const [category_categories, setCategoryCategories] = useState<number | null>(null);
  const [packageSkus, setPackageSkus] = useState<PackageSkuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSkuModal, setShowSkuModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [editingSkuIndex, setEditingSkuIndex] = useState(-1);
  const [editingSkuItem, setEditingSkuItem] = useState<PackageSkuItem | null>(null);
  const [skuQuantity, setSkuQuantity] = useState("");
  const [skuSortOrder, setSkuSortOrder] = useState("");
  const [skuSearchKeyword, setSkuSearchKeyword] = useState("");
  const [availableSkus, setAvailableSkus] = useState<Array<{ id: number; name: string; price: number; image_url?: string; product?: { name: string } }>>([]);
  const [skuSearchLoading, setSkuSearchLoading] = useState(false);
  const [skuSearchOffset, setSkuSearchOffset] = useState(0);
  const [skuSearchHasMore, setSkuSearchHasMore] = useState(true);

  const runSkuSearch = useCallback(
    async (reset = true) => {
      if (!company?.id || !token) return;
      if (!reset && !skuSearchHasMore) return;
      if (reset) {
        setSkuSearchOffset(0);
        setSkuSearchHasMore(true);
        setAvailableSkus([]);
      }
      setSkuSearchLoading(true);
      try {
        const q = new URLSearchParams({
          companyId: String(company.id),
          limit: "20",
          offset: String(reset ? 0 : skuSearchOffset),
        });
        if (skuSearchKeyword.trim()) q.set("keyword", skuSearchKeyword.trim());
        if (systemCompanyId && systemCompanyId !== company.id) q.set("defaultCompanyId", String(systemCompanyId));
        const res = await fetch(`/api/admin/company/product-skus/search?${q}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "搜索失败");
        const skus = data.skus ?? [];
        const productsCount = data.count ?? data.products?.length ?? 0;
        const addedIds = new Set(packageSkus.map((x) => x.product_sku?.id).filter(Boolean));
        const filtered = skus.filter((s: { id: number }) => !addedIds.has(s.id));
        if (reset) setAvailableSkus(filtered);
        else setAvailableSkus((prev) => [...prev, ...filtered]);
        setSkuSearchOffset((reset ? 0 : skuSearchOffset) + productsCount);
        setSkuSearchHasMore(productsCount >= 20 && (reset ? 0 : skuSearchOffset) + productsCount < (data.total ?? 0));
      } catch (err) {
        alert(err instanceof Error ? err.message : "搜索失败");
      } finally {
        setSkuSearchLoading(false);
      }
    },
    [company?.id, token, skuSearchKeyword, skuSearchOffset, skuSearchHasMore, packageSkus, systemCompanyId]
  );

  const runSkuSearchRef = useRef(runSkuSearch);
  runSkuSearchRef.current = runSkuSearch;
  useEffect(() => {
    if (showSkuModal) runSkuSearchRef.current(true);
  }, [showSkuModal]);

  const openAddSku = () => {
    setEditingSkuIndex(-1);
    setEditingSkuItem(null);
    setShowSkuModal(true);
  };

  const selectSku = (sku: { id: number; name: string; price: number; image_url?: string; product?: { name: string } }) => {
    setEditingSkuItem({
      product_sku: sku,
      quantity: 1,
      sort_order: packageSkus.length,
    });
    setSkuQuantity("1");
    setSkuSortOrder(String(packageSkus.length));
    setEditingSkuIndex(-1);
    setShowSkuModal(false);
    setShowQuantityModal(true);
  };

  const openEditSku = (index: number) => {
    setEditingSkuIndex(index);
    setEditingSkuItem(packageSkus[index]);
    setSkuQuantity(String(packageSkus[index].quantity));
    setSkuSortOrder(packageSkus[index].sort_order != null ? String(packageSkus[index].sort_order) : "");
    setShowQuantityModal(true);
  };

  const saveQuantity = () => {
    const q = Number(skuQuantity);
    if (!skuQuantity || q <= 0) {
      alert("请输入有效数量");
      return;
    }
    const sortOrder = skuSortOrder !== "" && skuSortOrder != null ? Number(skuSortOrder) : undefined;
    if (editingSkuIndex >= 0) {
      setPackageSkus((prev) => {
        const next = [...prev];
        next[editingSkuIndex] = { ...next[editingSkuIndex], quantity: q, sort_order: sortOrder };
        return next;
      });
    } else if (editingSkuItem) {
      setPackageSkus((prev) => [...prev, { ...editingSkuItem, quantity: q, sort_order: sortOrder }]);
    }
    setShowQuantityModal(false);
    setEditingSkuIndex(-1);
    setEditingSkuItem(null);
  };

  const removeSku = (index: number) => {
    setPackageSkus((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !cover_image_url.trim()) {
      setError("请填写套餐名称并上传或填写封面图");
      return;
    }
    if (packageSkus.length === 0) {
      setError("请至少添加一个套餐商品");
      return;
    }
    if (!company || !token || !isAdminForSelectedCompany) {
      setError("无权限或未选择公司");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/company/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_companies: company.id,
          name: name.trim(),
          cover_image_url: cover_image_url.trim(),
          description: description.trim() || undefined,
          tags: tags.trim() || undefined,
          sort_order: Number(sort_order) || 0,
          category_categories: category_categories ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "保存失败");
        return;
      }
      const newId = data?.id;
      if (!newId) {
        setError("创建套餐失败");
        return;
      }

      const packageId = Number(newId);
      for (let i = 0; i < packageSkus.length; i++) {
        const item = packageSkus[i];
        const sortOrder = item.sort_order ?? i;
        const skuRes = await fetch("/api/admin/company/package-product-skus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            package_packages: packageId,
            product_sku_product_skus: item.product_sku.id,
            quantity: item.quantity,
            sort_order: sortOrder,
          }),
        });
        if (!skuRes.ok) {
          const errData = await skuRes.json();
          setError(errData?.error || `添加商品「${item.product_sku?.name}」失败`);
          return;
        }
      }

      router.push("/dashboard/company/packages");
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
        <Link href="/dashboard/company/packages" className="text-indigo-600 mt-2 inline-block">
          返回套餐列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/dashboard/company/packages"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← 返回套餐列表
        </Link>
      </div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">添加套餐</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">套餐名称 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
              placeholder="请输入套餐名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">封面图 *</label>
            <ImageUpload
              value={cover_image_url}
              onChange={setCoverImageUrl}
              square
              placeholder="点击上传封面图"
              className="mb-2"
            />
            <input
              type="url"
              value={cover_image_url}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 text-sm placeholder:text-slate-500"
              placeholder="或输入图片 URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">套餐分类（可选）</label>
            <CategoryPicker
              type="package"
              value={category_categories}
              onChange={(id) => setCategoryCategories(id)}
              allowClear
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">套餐介绍</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
              placeholder="选填"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">标签</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
              placeholder="多个标签用｜分隔，如：新品｜热卖"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">排序值</label>
            <input
              type="number"
              value={sort_order}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
              placeholder="数值越小越靠前"
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">套餐商品 *</span>
            <button
              type="button"
              onClick={openAddSku}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              + 添加商品规格
            </button>
          </div>
          {packageSkus.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">暂无商品，请添加</p>
          ) : (
            <div className="space-y-2">
              {packageSkus.map((item, i) => (
                <div
                  key={item.id ?? `new-${i}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    {item.product_sku?.image_url && (
                      <img
                        src={item.product_sku.image_url}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <span className="font-medium text-slate-800">{item.product_sku?.name ?? "未知"}</span>
                      <span className="ml-2 text-sm font-medium text-slate-700">¥{item.product_sku?.price ?? 0}</span>
                      <span className="ml-2 text-sm text-slate-500">数量: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEditSku(i)} className="text-sm text-indigo-600">
                      编辑
                    </button>
                    <button type="button" onClick={() => removeSku(i)} className="text-sm text-red-600">
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            href="/dashboard/company/packages"
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            取消
          </Link>
        </div>
      </form>

      {showSkuModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSkuModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">选择商品规格</h3>
            <div className="p-4 border-b">
              <input
                type="text"
                value={skuSearchKeyword}
                onChange={(e) => setSkuSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSkuSearch(true)}
                placeholder="输入商品名称或规格搜索"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => runSkuSearch(true)}
                className="mt-2 text-sm text-indigo-600"
              >
                搜索
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {skuSearchLoading && availableSkus.length === 0 ? (
                <p className="text-slate-500 text-sm">搜索中…</p>
              ) : (
                <>
                  {availableSkus.map((sku) => (
                    <div
                      key={sku.id}
                      onClick={() => selectSku(sku)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <span className="font-medium text-slate-800">{sku.name}</span>
                      <span className="text-sm text-slate-600">¥{sku.price}</span>
                    </div>
                  ))}
                  {availableSkus.length === 0 && (
                    <p className="text-slate-500 text-sm py-4 text-center">
                      {skuSearchKeyword.trim() ? "未找到匹配的规格" : "暂无规格"}
                    </p>
                  )}
                  {skuSearchHasMore && !skuSearchLoading && (
                    <button
                      type="button"
                      onClick={() => runSkuSearch(false)}
                      className="w-full mt-2 py-2 text-sm text-indigo-600"
                    >
                      加载更多
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="p-4 border-t">
              <button
                type="button"
                onClick={() => setShowSkuModal(false)}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuantityModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQuantityModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">设置数量</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">商品规格</label>
                <p className="text-slate-800">{editingSkuItem?.product_sku?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">数量 *</label>
                <input
                  type="number"
                  value={skuQuantity}
                  onChange={(e) => setSkuQuantity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
                  placeholder="请输入数量"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">排序值</label>
                <input
                  type="number"
                  value={skuSortOrder}
                  onChange={(e) => setSkuSortOrder(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
                  placeholder="数值越小越靠前"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={saveQuantity}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setShowQuantityModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
