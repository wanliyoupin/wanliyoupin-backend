"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth-context";

type ProductSku = {
  id: number;
  name: string;
  image_url?: string | null;
  price?: number;
  stock?: number;
  is_shelved?: boolean;
};

type MediaItem = {
  file_type?: string;
  file_url?: string;
  type?: string;
  url?: string;
};

type Product = {
  id: number;
  name: string;
  cover_image_url?: string | null;
  description?: string | null;
  tags?: string | null;
  is_shelved?: boolean;
  category?: { name?: string; category?: { name?: string; category?: { name?: string } } };
  product_skus?: ProductSku[];
  detail_medias?: MediaItem[];
  scene_medias?: MediaItem[];
};

function getCategoryPath(cat: Product["category"]): string {
  if (!cat?.name) return "未分类";
  const parts: string[] = [];
  let c: Product["category"] = cat;
  while (c?.name) {
    parts.unshift(String(c.name).trim());
    c = c.category as Product["category"];
  }
  return parts.length ? parts.join(" / ") : "未分类";
}

export default function ProductPreviewPage() {
  const params = useParams();
  const id = params?.id as string;
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaTab, setMediaTab] = useState<"detail" | "scene">("detail");

  useEffect(() => {
    if (!id || !token) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/company/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setProduct(null);
          return;
        }
        const data = await res.json();
        setProduct(data);
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

  if (!product) {
    return (
      <div className="p-6">
        <p className="text-slate-600">商品不存在或无权查看</p>
        <Link href="/dashboard/company/products" className="mt-2 inline-block text-indigo-600 hover:underline">
          返回商品列表
        </Link>
      </div>
    );
  }

  const skus = product.product_skus ?? [];
  const detailMedias = product.detail_medias ?? [];
  const sceneMedias = product.scene_medias ?? [];

  return (
    <div className="max-w-2xl mx-auto p-6 pb-12">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/dashboard/company/products"
          className="text-sm text-slate-600 hover:text-indigo-600"
        >
          ← 返回商品列表
        </Link>
        <Link
          href={`/dashboard/company/products/${id}/edit`}
          className="text-sm text-indigo-600 hover:underline"
        >
          编辑
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        {/* 封面 */}
        <div className="aspect-[4/3] bg-slate-100">
          {product.cover_image_url ? (
            <img
              src={product.cover_image_url}
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
          <h1 className="text-xl font-semibold text-slate-800">{product.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
            <span>{getCategoryPath(product.category)}</span>
            <span
              className={`px-2 py-0.5 rounded ${
                product.is_shelved ? "bg-slate-100 text-slate-600" : "bg-green-100 text-green-700"
              }`}
            >
              {product.is_shelved ? "已下架" : "已上架"}
            </span>
            {product.tags && (
              <span className="text-slate-500">标签：{product.tags}</span>
            )}
          </div>
        </div>

        {/* 商品介绍 */}
        {product.description && (
          <div className="px-4 pb-4">
            <h2 className="text-sm font-medium text-slate-700 mb-2">商品介绍</h2>
            <div className="text-slate-600 text-sm whitespace-pre-wrap">
              {product.description}
            </div>
          </div>
        )}

        {/* 规格列表 */}
        {skus.length > 0 && (
          <div className="px-4 pb-4 border-t border-slate-100 pt-4">
            <h2 className="text-sm font-medium text-slate-700 mb-3">规格</h2>
            <div className="space-y-2">
              {skus.map((sku) => (
                <div
                  key={sku.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  {sku.image_url && (
                    <img
                      src={sku.image_url}
                      alt=""
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800">{sku.name}</div>
                    <div className="text-sm text-slate-500">
                      ¥{Number(sku.price ?? 0).toFixed(2)} · 库存 {sku.stock ?? 0}
                      {sku.is_shelved && (
                        <span className="ml-2 text-amber-600">已下架</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 产品详情 / 实景拍摄 */}
        {(detailMedias.length > 0 || sceneMedias.length > 0) && (
          <div className="border-t border-slate-100">
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setMediaTab("detail")}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  mediaTab === "detail"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                产品详情
              </button>
              <button
                type="button"
                onClick={() => setMediaTab("scene")}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  mediaTab === "scene"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                实景拍摄
              </button>
            </div>
            <div className="p-4">
              {mediaTab === "detail" && (
                <div className="space-y-4">
                  {detailMedias.length === 0 ? (
                    <p className="text-slate-500 text-sm">暂无产品详情媒体</p>
                  ) : (
                    detailMedias.map((m, i) => {
                      const url = m.file_url ?? m.url ?? "";
                      const isVideo = (m.file_type ?? m.type) === "video";
                      if (isVideo) {
                        return (
                          <video
                            key={i}
                            src={url}
                            controls
                            className="w-full rounded-lg"
                          />
                        );
                      }
                      return (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="w-full rounded-lg"
                        />
                      );
                    })
                  )}
                </div>
              )}
              {mediaTab === "scene" && (
                <div className="space-y-4">
                  {sceneMedias.length === 0 ? (
                    <p className="text-slate-500 text-sm">暂无实景拍摄媒体</p>
                  ) : (
                    sceneMedias.map((m, i) => {
                      const url = m.file_url ?? m.url ?? "";
                      const isVideo = (m.file_type ?? m.type) === "video";
                      if (isVideo) {
                        return (
                          <video
                            key={i}
                            src={url}
                            controls
                            className="w-full rounded-lg"
                          />
                        );
                      }
                      return (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="w-full rounded-lg"
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
