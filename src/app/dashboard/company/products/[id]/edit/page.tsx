"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";
import { ImageUpload } from "@/app/components/ImageUpload";
import { CategoryPicker } from "@/app/components/CategoryPicker";
import { BatchMediaUpload, type MediaItem } from "@/app/components/BatchMediaUpload";

type SkuItem = {
  id?: number;
  name: string;
  image_url: string;
  price: string;
  stock: string;
  sort_order: string;
};

function toMediaItem(m: { file_type?: string; file_url?: string; url?: string }): MediaItem {
  return {
    file_type: (m.file_type === "video" ? "video" : "image") as "image" | "video",
    file_url: m.file_url ?? m.url ?? "",
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { token, company, isAdminForSelectedCompany } = useAuth();
  const [name, setName] = useState("");
  const [cover_image_url, setCoverImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [sort_order, setSortOrder] = useState(0);
  const [is_shelved, setIsShelved] = useState(false);
  const [category_categories, setCategoryCategories] = useState<number | null>(null);
  const [detail_medias, setDetailMedias] = useState<MediaItem[]>([]);
  const [scene_medias, setSceneMedias] = useState<MediaItem[]>([]);
  const [skus, setSkus] = useState<SkuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [showSkuModal, setShowSkuModal] = useState(false);
  const [editingSkuIndex, setEditingSkuIndex] = useState<number>(-1);
  const [skuForm, setSkuForm] = useState<SkuItem>({
    name: "",
    image_url: "",
    price: "",
    stock: "",
    sort_order: "",
  });

  useEffect(() => {
    if (!id || !token) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/company/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.name != null) setName(data.name);
        if (data?.cover_image_url != null) setCoverImageUrl(data.cover_image_url);
        if (data?.description != null) setDescription(data.description);
        if (data?.tags != null) setTags(data.tags);
        if (data?.sort_order != null) setSortOrder(data.sort_order);
        if (data?.is_shelved != null) setIsShelved(data.is_shelved);
        if (data?.category_categories != null) setCategoryCategories(data.category_categories);
        else setCategoryCategories(null);
        if (Array.isArray(data?.detail_medias)) {
          setDetailMedias(data.detail_medias.map(toMediaItem));
        }
        if (Array.isArray(data?.scene_medias)) {
          setSceneMedias(data.scene_medias.map(toMediaItem));
        }
        if (Array.isArray(data?.product_skus)) {
          setSkus(
            data.product_skus.map((s: { id: number; name: string; image_url?: string; price: number; stock: number; sort_order?: number }) => ({
              id: s.id,
              name: s.name ?? "",
              image_url: s.image_url ?? "",
              price: String(s.price ?? ""),
              stock: String(s.stock ?? ""),
              sort_order: s.sort_order != null ? String(s.sort_order) : "",
            }))
          );
        }
      } finally {
        setFetching(false);
      }
    })();
  }, [id, token]);

  const openAddSku = () => {
    setEditingSkuIndex(-1);
    setSkuForm({ name: "", image_url: "", price: "", stock: "", sort_order: "" });
    setShowSkuModal(true);
  };

  const openEditSku = (index: number) => {
    setEditingSkuIndex(index);
    setSkuForm(skus[index]);
    setShowSkuModal(true);
  };

  const saveSku = () => {
    if (!skuForm.name.trim() || !skuForm.price || !skuForm.stock) {
      alert("请填写规格名称、价格、库存");
      return;
    }
    const item: SkuItem = {
      ...(skus[editingSkuIndex]?.id != null ? { id: skus[editingSkuIndex].id } : {}),
      name: skuForm.name.trim(),
      image_url: skuForm.image_url.trim(),
      price: skuForm.price,
      stock: skuForm.stock,
      sort_order: skuForm.sort_order,
    };
    if (editingSkuIndex >= 0) {
      setSkus((prev) => {
        const next = [...prev];
        next[editingSkuIndex] = item;
        return next;
      });
    } else {
      setSkus((prev) => [...prev, item]);
    }
    setShowSkuModal(false);
  };

  const removeSku = async (index: number) => {
    const sku = skus[index];
    if (sku.id && token) {
      if (!confirm(`确定删除规格「${sku.name}」？`)) return;
      try {
        const res = await fetch(`/api/admin/company/product-skus/${sku.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err?.error || "删除失败");
          return;
        }
      } catch {
        alert("删除失败");
        return;
      }
    }
    setSkus((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !cover_image_url.trim()) {
      setError("请填写商品名称并上传或填写封面图");
      return;
    }
    if (skus.length === 0) {
      setError("请至少保留一个商品规格");
      return;
    }
    if (!token || !isAdminForSelectedCompany) {
      setError("无权限");
      return;
    }
    setLoading(true);
    try {
      const productRes = await fetch(`/api/admin/company/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          cover_image_url: cover_image_url.trim(),
          description: description.trim() || undefined,
          tags: tags.trim() || undefined,
          sort_order: Number(sort_order) || 0,
          is_shelved: is_shelved,
          category_categories: category_categories ?? undefined,
          detail_medias,
          scene_medias,
        }),
      });
      const productData = await productRes.json();
      if (!productRes.ok) {
        setError(productData?.error || "保存失败");
        return;
      }

      for (let i = 0; i < skus.length; i++) {
        const sku = skus[i];
        if (sku.id) {
          const skuRes = await fetch(`/api/admin/company/product-skus/${sku.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: sku.name,
              image_url: sku.image_url || undefined,
              price: Number(sku.price),
              stock: Number(sku.stock),
              sort_order: sku.sort_order ? Number(sku.sort_order) : i,
            }),
          });
          if (!skuRes.ok) {
            const err = await skuRes.json();
            setError(err?.error || `规格「${sku.name}」更新失败`);
            return;
          }
        } else if (company) {
          const skuRes = await fetch("/api/admin/company/product-skus", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              product_products: Number(id),
              company_companies: company.id,
              name: sku.name,
              image_url: sku.image_url || undefined,
              price: Number(sku.price),
              stock: Number(sku.stock),
              sort_order: sku.sort_order ? Number(sku.sort_order) : i,
            }),
          });
          if (!skuRes.ok) {
            const err = await skuRes.json();
            setError(err?.error || `规格「${sku.name}」保存失败`);
            return;
          }
        }
      }

      router.push("/dashboard/company/products");
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
        <Link href="/dashboard/company/products" className="text-indigo-600 mt-2 inline-block">
          返回商品列表
        </Link>
      </div>
    );
  }

  if (fetching) return <p className="text-slate-500">加载中…</p>;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/dashboard/company/products"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← 返回商品列表
        </Link>
      </div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">编辑商品</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">商品名称 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 text-sm"
              placeholder="或输入图片 URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">所属分类</label>
            <CategoryPicker
              type="product"
              value={category_categories}
              onChange={(id) => setCategoryCategories(id)}
              allowClear
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              商品介绍 <span className="text-slate-500">（支持富文本）</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              placeholder="请输入商品介绍"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">标签</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              placeholder="多个标签用｜分隔，如：新品｜热卖"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">排序值</label>
            <input
              type="number"
              value={sort_order}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              placeholder="数值越小越靠前，默认0"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_shelved"
              checked={is_shelved}
              onChange={(e) => setIsShelved(e.target.checked)}
              className="rounded border-slate-300"
            />
            <label htmlFor="is_shelved" className="text-sm text-slate-700">
              已下架（勾选表示下架，不勾选表示上架）
            </label>
          </div>
        </div>

        <BatchMediaUpload
          title="产品详情媒体（可选）"
          value={detail_medias}
          onChange={setDetailMedias}
          maxCount={20}
        />
        <BatchMediaUpload
          title="实景拍摄媒体（可选）"
          value={scene_medias}
          onChange={setSceneMedias}
          maxCount={20}
        />

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">商品规格 *</span>
            <button
              type="button"
              onClick={openAddSku}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              + 添加规格
            </button>
          </div>
          {skus.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">暂无规格，请添加</p>
          ) : (
            <div className="space-y-2">
              {skus.map((sku, i) => (
                <div
                  key={sku.id ?? `new-${i}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    {sku.image_url && (
                      <img
                        src={sku.image_url}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <span className="font-medium text-slate-800">{sku.name}</span>
                      <span className="ml-2 text-sm font-medium text-slate-700">¥{sku.price}</span>
                      <span className="ml-2 text-sm text-slate-500">库存: {sku.stock}</span>
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
            href="/dashboard/company/products"
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
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
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {editingSkuIndex >= 0 ? "编辑规格" : "添加规格"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">规格名称 *</label>
                <input
                  type="text"
                  value={skuForm.name}
                  onChange={(e) => setSkuForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
                  placeholder="请输入规格名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">规格图片</label>
                <div className="flex gap-2">
                  <ImageUpload
                    value={skuForm.image_url}
                    onChange={(url) => setSkuForm((p) => ({ ...p, image_url: url }))}
                    square
                    placeholder="上传"
                  />
                  <input
                    type="url"
                    value={skuForm.image_url}
                    onChange={(e) => setSkuForm((p) => ({ ...p, image_url: e.target.value }))}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500"
                    placeholder="或输入 URL"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">价格 *</label>
                <input
                  type="number"
                  step="0.01"
                  value={skuForm.price}
                  onChange={(e) => setSkuForm((p) => ({ ...p, price: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
                  placeholder="请输入价格"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">库存 *</label>
                <input
                  type="number"
                  value={skuForm.stock}
                  onChange={(e) => setSkuForm((p) => ({ ...p, stock: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
                  placeholder="请输入库存"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">排序值</label>
                <input
                  type="number"
                  value={skuForm.sort_order}
                  onChange={(e) => setSkuForm((p) => ({ ...p, sort_order: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-500"
                  placeholder="数值越小越靠前"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={saveSku}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setShowSkuModal(false)}
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
