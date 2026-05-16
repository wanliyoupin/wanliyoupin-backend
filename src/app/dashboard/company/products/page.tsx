"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import { downloadProductsExcel } from "@/app/lib/exportExcel";
import { useToast } from "@/app/components/Toast";

type Product = {
  id: number;
  name: string;
  cover_image_url?: string | null;
  description?: string | null;
  is_shelved?: boolean;
  company_companies?: number;
  _companyId?: number;
  product_skus?: { id: number }[];
  wx_scan_code?: string | null;
};

type CategoryNode = {
  id: number;
  name: string;
  icon_url?: string | null;
  /** products=小程序直出商品；categories=先进子分类 */
  route_ui_style?: string | null;
  categories?: CategoryNode[];
  products_aggregate?: { aggregate: { count: number } };
  products_listed_aggregate?: { aggregate: { count: number } };
};

function categoryRouteModeLabel(style: string | null | undefined): { text: string; className: string } {
  if (style === "products") {
    return {
      text: "展示产品",
      className: "border border-violet-200 bg-violet-50 text-violet-800",
    };
  }
  return {
    text: "继续展示分类",
    className: "border border-slate-200 bg-slate-100 text-slate-600",
  };
}

function CategoryTreeFilter({
  nodes,
  selectedId,
  onSelect,
  depth = 0,
}: {
  nodes: CategoryNode[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  depth?: number;
}) {
  return (
    <ul className={depth ? "ml-3 border-l border-slate-200 pl-2" : ""}>
      {depth === 0 && (
        <li className="mb-1">
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={`w-full text-left px-2 py-1.5 rounded text-sm ${selectedId === null ? "bg-indigo-100 text-indigo-800 font-medium" : "text-slate-700 hover:bg-slate-100"}`}
          >
            全部
          </button>
        </li>
      )}
      {nodes.map((node) => {
        const total = node.products_aggregate?.aggregate?.count ?? 0;
        const listed = node.products_listed_aggregate?.aggregate?.count ?? total;
        const isSelected = selectedId === node.id;
        const countLabel =
          listed < total ? `${listed}/${total}` : String(total);
        const countTitle =
          listed < total
            ? `已上架 ${listed} 个（小程序可见）；含 ${total - listed} 个已下架`
            : `共 ${total} 个商品`;
        const mode = categoryRouteModeLabel(node.route_ui_style);
        return (
          <li key={node.id} className="mb-1">
            <button
              type="button"
              onClick={() => onSelect(node.id)}
              className={`w-full text-left px-2 py-1.5 rounded text-sm ${isSelected ? "bg-indigo-100 text-indigo-800 font-medium" : "text-slate-700 hover:bg-slate-100"}`}
              style={depth ? { paddingLeft: 8 + depth * 12 } : undefined}
              title={`${node.name} · ${mode.text}。${countTitle}`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <div className="truncate">{node.name}</div>
                  <span
                    className={`mt-0.5 inline-block max-w-full truncate rounded px-1 py-px text-[10px] leading-tight ${mode.className}`}
                  >
                    {mode.text}
                  </span>
                </div>
                <span className="text-slate-500 text-xs flex-shrink-0 tabular-nums" title={countTitle}>
                  ({countLabel})
                </span>
              </div>
            </button>
            {node.categories?.length ? (
              <CategoryTreeFilter
                nodes={node.categories}
                selectedId={selectedId}
                onSelect={onSelect}
                depth={depth + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { token, company, companyIdsIncludingSystem, systemCompanyId, user, isAdminForSelectedCompany } =
    useAuth();
  const toast = useToast();
  const companyIdFromUrl = searchParams.get("companyId");
  const auditFromUrl = searchParams.get("audit") === "1";
  const isAuditMode = user?.role === "admin" && auditFromUrl && !!companyIdFromUrl;
  const auditCompanyId = companyIdFromUrl && !Number.isNaN(Number(companyIdFromUrl)) ? Number(companyIdFromUrl) : null;
  const effectiveCompanyIds = isAuditMode && auditCompanyId
    ? [...new Set([auditCompanyId, ...(systemCompanyId ? [systemCompanyId] : [])])]
    : companyIdsIncludingSystem;
  const effectiveCurrentCompanyId = isAuditMode && auditCompanyId ? auditCompanyId : company?.id;
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [hiddenProductIds, setHiddenProductIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [shelveFilter, setShelveFilter] = useState<"all" | "shelved" | "unshelved">("all");
  const [scopeFilter, setScopeFilter] = useState<"all" | "mine" | "headquarters">("all");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "visible" | "hidden">("all");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [wxacodeGenerating, setWxacodeGenerating] = useState<number | null>(null);

  const effectiveCompanyIdsForApi =
    scopeFilter === "all"
      ? effectiveCompanyIds
      : scopeFilter === "mine"
        ? effectiveCurrentCompanyId
          ? [effectiveCurrentCompanyId]
          : []
        : systemCompanyId
          ? [systemCompanyId]
          : [];

  /**
   * 分类树：始终拉「当前公司 + 总部」完整结构（effectiveCompanyIds），便于「只看自己」时仍能看到总部分类节点。
   * 数量聚合：随列表筛选 — 「只看自己」仅统计本公司商品（productCountCompanyIds）；「只看总部」仅统计总部；
   * 「全部」不传 productCountCompanyIds，与树范围一致。
   */
  const loadCategories = async () => {
    if (!token || !effectiveCurrentCompanyId) return;
    if (effectiveCompanyIds.length === 0) {
      setCategoryTree([]);
      return;
    }
    setCategoriesLoading(true);
    try {
      const q = new URLSearchParams({
        companyIds: effectiveCompanyIds.join(","),
        currentCompanyId: String(effectiveCurrentCompanyId),
        type: "product",
      });
      if (scopeFilter === "mine") {
        q.set("productCountCompanyIds", String(effectiveCurrentCompanyId));
      } else if (scopeFilter === "headquarters" && systemCompanyId != null) {
        q.set("productCountCompanyIds", String(systemCompanyId));
      }
      const res = await fetch(`/api/admin/company/categories?${q}`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCategoryTree(data.categories ?? []);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [token, effectiveCurrentCompanyId, effectiveCompanyIds.join(","), scopeFilter, systemCompanyId]);

  const load = async (pageNum: number) => {
    if (!token || !effectiveCurrentCompanyId) return;
    if (effectiveCompanyIdsForApi.length === 0) {
      setProducts([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    const params = new URLSearchParams({
      companyIds: effectiveCompanyIdsForApi.join(","),
      currentCompanyId: String(effectiveCurrentCompanyId),
      limit: String(pageSize),
      offset: String((pageNum - 1) * pageSize),
    });
    if (keyword) params.set("keyword", keyword);
    if (shelveFilter === "shelved") params.set("is_shelved", "false");
    if (shelveFilter === "unshelved") params.set("is_shelved", "true");
    if (categoryId != null) params.set("categoryId", String(categoryId));
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/company/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
        setHiddenProductIds(data.hiddenProductIds ?? []);
        setCurrentPage(pageNum);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [token, effectiveCurrentCompanyId, effectiveCompanyIdsForApi.join(","), keyword, shelveFilter, categoryId, scopeFilter]);

  const onSearch = () => setKeyword(searchInput.trim());

  const handleDelete = async (product: Product) => {
    if (!token || !confirm(`确定要删除商品「${product.name}」吗？`)) return;
    try {
      const res = await fetch(`/api/admin/company/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await load(currentPage);
      else {
        const err = await res.json();
        alert(err?.error || "删除失败");
      }
    } catch {
      alert("删除失败");
    }
  };

  const handleGenerateWxacode = async (
    type: "product" | "package",
    id: number,
    companyId: number
  ) => {
    if (!token) return;
    setWxacodeGenerating(id);
    try {
      const res = await fetch("/api/weixin/wxacode/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          companyId,
          ...(type === "product" ? { productId: id } : { packageId: id }),
        }),
      });
      const data = await res.json();
      if (res.ok && data?.url) {
        window.open(data.url, "_blank");
        toast.success("小程序码已生成并保存");
        load(currentPage);
      } else {
        toast.error(data?.error || "生成失败");
      }
    } catch {
      toast.error("生成失败");
    } finally {
      setWxacodeGenerating(null);
    }
  };

  const toggleShelve = async (product: Product) => {
    if (!token || !isAdminForSelectedCompany) return;
    const next = !product.is_shelved;
    try {
      const res = await fetch(`/api/admin/company/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_shelved: next }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_shelved: next } : p))
        );
      } else {
        const err = await res.json();
        alert(err?.error || "操作失败");
      }
    } catch {
      alert("操作失败");
    }
  };

  const updateCompanyHidden = async (ids: number[]) => {
    if (!token || !effectiveCurrentCompanyId) return;
    const res = await fetch(`/api/admin/company/${effectiveCurrentCompanyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ hidden_product_ids: ids }),
    });
    if (res.ok) {
      setHiddenProductIds(ids);
      await load(currentPage);
    } else {
      const err = await res.json();
      alert(err?.error || "操作失败");
    }
  };

  const handleHide = (productId: number) => {
    if (hiddenProductIds.includes(productId)) return;
    updateCompanyHidden([...hiddenProductIds, productId]);
  };

  const handleUnhide = (productId: number) => {
    updateCompanyHidden(hiddenProductIds.filter((id) => id !== productId));
  };

  const handleExportExcel = async () => {
    if (!token || !effectiveCurrentCompanyId || effectiveCompanyIdsForApi.length === 0) {
      alert("无法导出：请先选择公司");
      return;
    }
    setExporting(true);
    const limit = 100;
    const all: Product[] = [];
    let hiddenIds: number[] = [];
    let offset = 0;
    try {
      while (true) {
        const params = new URLSearchParams({
          companyIds: effectiveCompanyIdsForApi.join(","),
          currentCompanyId: String(effectiveCurrentCompanyId),
          limit: String(limit),
          offset: String(offset),
        });
        if (keyword) params.set("keyword", keyword);
        if (shelveFilter === "shelved") params.set("is_shelved", "false");
        if (shelveFilter === "unshelved") params.set("is_shelved", "true");
        if (categoryId != null) params.set("categoryId", String(categoryId));
        const res = await fetch(`/api/admin/company/products?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setExporting(false);
          alert(data?.error || "导出失败");
          return;
        }
        const list = (data.products ?? []) as Product[];
        if (offset === 0) hiddenIds = data.hiddenProductIds ?? [];
        all.push(...list);
        if (list.length < limit) break;
        offset += limit;
      }
      let filtered = all;
      if (scopeFilter !== "mine") {
        const isFromSys = (p: Product) =>
          systemCompanyId != null && (p.company_companies === systemCompanyId || p._companyId === systemCompanyId);
        const isHid = (p: Product) => hiddenIds.includes(p.id);
        if (visibilityFilter === "visible") {
          filtered = all.filter((p) => !isFromSys(p) || !isHid(p));
        } else if (visibilityFilter === "hidden") {
          filtered = all.filter((p) => isFromSys(p) && isHid(p));
        }
      }
      if (filtered.length === 0) {
        setExporting(false);
        alert("暂无数据可导出");
        return;
      }
      downloadProductsExcel(filtered);
    } catch {
      alert("导出失败");
    } finally {
      setExporting(false);
    }
  };

  const isFromSystem = (p: Product) =>
    systemCompanyId != null && (p.company_companies === systemCompanyId || p._companyId === systemCompanyId);
  const isHidden = (p: Product) => hiddenProductIds.includes(p.id);

  const displayProducts = (() => {
    let list = products;
    if (scopeFilter === "mine") return list;
    if (visibilityFilter === "all") return list;
    if (visibilityFilter === "visible") {
      return list.filter((p) => !isFromSystem(p) || !isHidden(p));
    }
    return list.filter((p) => isFromSystem(p) && isHidden(p));
  })();

  if (!effectiveCurrentCompanyId) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">商品管理</h1>
        <p className="text-slate-600">请先在顶部选择公司。</p>
      </div>
    );
  }

  const canEdit = !isAuditMode && (user?.role === "admin" || (effectiveCurrentCompanyId === company?.id && isAdminForSelectedCompany));

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      {/* 左侧分类树筛选 */}
      <aside className="w-56 flex-shrink-0 min-h-0 overflow-y-auto">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-sm font-medium text-slate-700 mb-2">按分类筛选</div>
          {categoriesLoading ? (
            <p className="text-slate-500 text-sm">加载中…</p>
          ) : (
            <CategoryTreeFilter
              nodes={categoryTree}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          )}
        </div>
      </aside>

      <div className="flex-1 min-w-0 min-h-0 flex flex-col">
        {isAuditMode && (
          <div className="flex-shrink-0 mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-amber-800 text-sm">
            核查模式：仅查看，不可操作
          </div>
        )}
        <div className="flex-shrink-0 flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-xl font-semibold text-slate-800">商品管理</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={exporting}
              className="px-3 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? "导出中…" : "导出"}
            </button>
            {canEdit && (
              <Link
                href="/dashboard/company/products/new"
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
              >
                + 添加
              </Link>
            )}
            {!canEdit && isAuditMode && (
              <span className="text-sm text-slate-500">仅查看，不可操作</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 mb-4 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "shelved", "unshelved"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setShelveFilter(key)}
                className={`rounded-lg px-3 py-1.5 text-sm ${shelveFilter === key ? "bg-indigo-600 text-white" : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
              >
                {key === "all" ? "全部" : key === "shelved" ? "已上架" : "已下架"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setScopeFilter("all")}
              className={`px-3 py-1 text-sm rounded ${scopeFilter === "all" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter("mine")}
              className={`px-3 py-1 text-sm rounded ${scopeFilter === "mine" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
            >
              只看自己公司
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter("headquarters")}
              className={`px-3 py-1 text-sm rounded ${scopeFilter === "headquarters" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
            >
              只看总部
            </button>
          </div>
          {scopeFilter !== "mine" && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setVisibilityFilter("all")}
                className={`px-3 py-1 text-xs rounded ${visibilityFilter === "all" ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600"}`}
              >
                全部
              </button>
              <button
                type="button"
                onClick={() => setVisibilityFilter("visible")}
                className={`px-3 py-1 text-xs rounded ${visibilityFilter === "visible" ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600"}`}
              >
                展示中
              </button>
              <button
                type="button"
                onClick={() => setVisibilityFilter("hidden")}
                className={`px-3 py-1 text-xs rounded ${visibilityFilter === "hidden" ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600"}`}
              >
                已隐藏
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="搜索商品名称"
              className="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={onSearch}
              className="rounded-lg bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700"
            >
              搜索
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex-1 min-h-0 flex items-center">
            <p className="text-slate-500">加载中…</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            {keyword || categoryId != null || shelveFilter !== "all" || scopeFilter !== "all" || visibilityFilter !== "all"
              ? (keyword ? `未找到匹配「${keyword}」的商品` : "暂无符合筛选条件的商品")
              : "暂无商品"}
            {canEdit && (
              <div className="mt-2">
                <Link href="/dashboard/company/products/new" className="text-indigo-600 hover:underline">
                  添加商品
                </Link>
              </div>
            )}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300"
              >
                {product.cover_image_url && (
                  <img
                    src={product.cover_image_url}
                    alt=""
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                )}
                {product.wx_scan_code && (
                  <a
                    href={product.wx_scan_code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                    title="查看商品小程序码"
                  >
                    <img
                      src={product.wx_scan_code}
                      alt={`${product.name} 小程序码`}
                      className="w-16 h-16 rounded border border-slate-200 object-contain bg-white"
                    />
                  </a>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800">{product.name}</div>
                  <div className="text-sm text-slate-500">
                    {product.product_skus?.length ?? 0} 个规格
                    {product.is_shelved ? " · 已下架" : " · 已上架"}
                    {isFromSystem(product) && (
                      <span className="ml-2 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-xs">
                        系统配置
                      </span>
                    )}
                  </div>
                </div>
                {canEdit && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isFromSystem(product) && effectiveCurrentCompanyId !== systemCompanyId ? (
                      isHidden(product) ? (
                        <button
                          type="button"
                          onClick={() => handleUnhide(product.id)}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          取消隐藏
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleHide(product.id)}
                          className="text-sm text-slate-500 hover:underline"
                        >
                          隐藏
                        </button>
                      )
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleShelve(product)}
                          className="text-sm px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                        >
                          {product.is_shelved ? "上架" : "下架"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          删除
                        </button>
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-sm">
                  {canEdit && (!isFromSystem(product) || effectiveCurrentCompanyId === systemCompanyId) && (
                    <>
                      <Link
                        href={`/dashboard/company/products/${product.id}/edit`}
                        className="text-indigo-600 hover:underline"
                      >
                        编辑
                      </Link>
                      <span className="text-slate-300">|</span>
                    </>
                  )}
                  <Link
                    href={`/dashboard/company/products/${product.id}/preview`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    预览
                  </Link>
                  {effectiveCurrentCompanyId && (
                    <>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        disabled={wxacodeGenerating === product.id}
                        onClick={() => handleGenerateWxacode("product", product.id, effectiveCurrentCompanyId)}
                        className="text-indigo-600 hover:underline disabled:opacity-50"
                      >
                        {wxacodeGenerating === product.id ? "生成中…" : "小程序码"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
            {total > 0 && (
              <div className="flex-shrink-0 mt-4 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-slate-600">
                  共 {total} 条，第 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} 条
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => load(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((p, i, arr) => {
                      const prev = arr[i - 1];
                      const showEllipsis = prev != null && p - prev > 1;
                      return (
                        <span key={p} className="flex items-center gap-1">
                          {showEllipsis && <span className="px-1 text-slate-500">…</span>}
                          <button
                            type="button"
                            onClick={() => load(p)}
                            className={`min-w-[2rem] rounded-lg px-2 py-1.5 text-sm ${
                              currentPage === p
                                ? "bg-indigo-600 text-white"
                                : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {p}
                          </button>
                        </span>
                      );
                    })}
                  <button
                    type="button"
                    onClick={() => load(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
