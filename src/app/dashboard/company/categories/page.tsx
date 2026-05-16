"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";

type CategoryNode = {
  id: number;
  name: string;
  icon_url?: string | null;
  parent_categories?: number | null;
  level: number;
  route_ui_style: string;
  sort_order: number;
  type: string;
  company_companies?: number;
  categories?: CategoryNode[];
  products_aggregate?: { aggregate: { count: number } };
  /** 未删除且未下架，与小程序商品列表一致 */
  products_listed_aggregate?: { aggregate: { count: number } };
  packages_aggregate?: { aggregate: { count: number } };
  expanded?: boolean;
};

/** 小程序端展示模式（与编辑页「继续展示分类 / 展示产品」一致） */
function getRouteUiStyleLabel(node: CategoryNode): { text: string; isProducts: boolean } {
  const isProducts = node.route_ui_style === "products";
  return {
    text: isProducts ? "展示产品" : "继续展示分类",
    isProducts,
  };
}

/** 当前分类下子分类个数、商品/套餐个数文案 */
function getCategoryCounts(node: CategoryNode): string {
  const childCount = node.categories?.length ?? 0;
  const productCount = node.products_aggregate?.aggregate?.count ?? 0;
  const productListed = node.products_listed_aggregate?.aggregate?.count ?? productCount;
  const packageCount = node.packages_aggregate?.aggregate?.count ?? 0;
  const parts: string[] = [];
  if (childCount > 0) parts.push(`${childCount} 个子分类`);
  if (node.type === "product" && productCount > 0) {
    if (productListed < productCount) {
      parts.push(`${productCount} 个商品（${productListed} 已上架，小程序可见）`);
    } else {
      parts.push(`${productCount} 个商品`);
    }
  }
  if (node.type === "package" && packageCount > 0) parts.push(`${packageCount} 个套餐`);
  if (node.type !== "product" && node.type !== "package") {
    if (productCount > 0) parts.push(`${productCount} 个商品`);
    if (packageCount > 0) parts.push(`${packageCount} 个套餐`);
  }
  return parts.length ? parts.join("、") : "0";
}

/** 根据展开状态扁平化树 */
function flattenTree(nodes: CategoryNode[], depth: number): { node: CategoryNode; depth: number }[] {
  const result: { node: CategoryNode; depth: number }[] = [];
  for (const node of nodes) {
    result.push({ node, depth });
    if (node.expanded !== false && node.categories?.length) {
      result.push(...flattenTree(node.categories, depth + 1));
    }
  }
  return result;
}

/** 递归设置 expanded */
function ensureExpanded(nodes: CategoryNode[], expanded = true): CategoryNode[] {
  return nodes.map((n) => ({
    ...n,
    expanded: n.expanded ?? expanded,
    categories: n.categories ? ensureExpanded(n.categories, expanded) : [],
  }));
}

/** 递归切换节点展开状态 */
function toggleNodeExpanded(nodes: CategoryNode[], targetId: number): CategoryNode[] {
  return nodes.map((n) => {
    if (n.id === targetId) {
      return { ...n, expanded: !(n.expanded !== false) };
    }
    return {
      ...n,
      categories: n.categories ? toggleNodeExpanded(n.categories, targetId) : [],
    };
  });
}

function CategoryTreeItem({
  item,
  systemCompanyId,
  effectiveCurrentCompanyId,
  hiddenCategoryIds,
  onDelete,
  onHide,
  onUnhide,
  onToggleExpand,
  isAdmin,
}: {
  item: { node: CategoryNode; depth: number };
  systemCompanyId: number | null;
  effectiveCurrentCompanyId: number | null;
  hiddenCategoryIds: number[];
  onDelete: (id: number) => void;
  onHide: (id: number) => void;
  onUnhide: (id: number) => void;
  onToggleExpand: (node: CategoryNode) => void;
  isAdmin: boolean;
}) {
  const { node, depth } = item;
  const isFromSystem = systemCompanyId != null && node.company_companies === systemCompanyId;
  /** 当前选中的是总部公司：总部管理员可编辑；否则仅可隐藏/取消隐藏 */
  const isViewingAsHeadquartersAdmin = effectiveCurrentCompanyId != null && effectiveCurrentCompanyId === systemCompanyId;
  const isHidden = hiddenCategoryIds.includes(node.id);
  const hasChildren = (node.categories?.length ?? 0) > 0;
  const routeUi = getRouteUiStyleLabel(node);

  return (
    <div className="mb-2" style={{ marginLeft: depth * 20 }}>
      <div
        className={`flex items-center gap-3 py-2 px-3 rounded-lg border transition-colors ${
          depth === 0 ? "bg-white border-slate-200 border-l-4 border-l-indigo-500" : "bg-slate-50/80 border-slate-200"
        } hover:border-slate-300`}
      >
        <button
          type="button"
          onClick={() => onToggleExpand(node)}
          className="w-5 h-5 flex items-center justify-center text-slate-500 shrink-0"
        >
          {hasChildren ? (node.expanded !== false ? "▼" : "▶") : " "}
        </button>
        {node.icon_url ? (
          <img src={node.icon_url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-semibold text-sm">
            {(node.name || "")[0] || "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="font-medium text-slate-800">{node.name}</span>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                node.type === "package" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {node.type === "package" ? "套餐" : "产品"}
            </span>
            <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">L{node.level}</span>
            <span
              title={
                routeUi.isProducts
                  ? "用户进入该分类时，小程序直接展示本分类下商品列表"
                  : "用户进入该分类时，小程序优先展示子分类（无子分类则展示本分类商品）"
              }
              className={`text-xs px-1.5 py-0.5 rounded font-medium border ${
                routeUi.isProducts
                  ? "bg-violet-50 text-violet-800 border-violet-200"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              {routeUi.text}
            </span>
            {isFromSystem && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">系统配置</span>
            )}
            <span className="text-xs text-slate-500">{getCategoryCounts(node)}</span>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            {isFromSystem && !isViewingAsHeadquartersAdmin ? (
              isHidden ? (
                <button
                  type="button"
                  onClick={() => onUnhide(node.id)}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  取消隐藏
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onHide(node.id)}
                  className="text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded hover:bg-amber-100"
                >
                  隐藏
                </button>
              )
            ) : (
              <>
                <Link
                  href={`/dashboard/company/categories/${node.id}/edit`}
                  className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                >
                  编辑
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(node.id)}
                  className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                >
                  删除
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const { token, company, companyIdsIncludingSystem, systemCompanyId, user, isAdminForSelectedCompany } =
    useAuth();
  const companyIdFromUrl = searchParams.get("companyId");
  const auditFromUrl = searchParams.get("audit") === "1";
  const isAuditMode = user?.role === "admin" && auditFromUrl && !!companyIdFromUrl;
  const auditCompanyId =
    companyIdFromUrl && !Number.isNaN(Number(companyIdFromUrl)) ? Number(companyIdFromUrl) : null;
  const effectiveCurrentCompanyId = isAuditMode && auditCompanyId ? auditCompanyId : company?.id;

  const [allCategories, setAllCategories] = useState<CategoryNode[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"product" | "package" | null>(null);
  const [scopeFilter, setScopeFilter] = useState<"all" | "mine" | "headquarters">("all");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "visible" | "hidden">("all");

  const effectiveCompanyIds =
    scopeFilter === "all"
      ? isAuditMode && auditCompanyId
        ? [...new Set([auditCompanyId, ...(systemCompanyId ? [systemCompanyId] : [])])]
        : companyIdsIncludingSystem
      : scopeFilter === "mine"
        ? effectiveCurrentCompanyId
          ? [effectiveCurrentCompanyId]
          : []
        : systemCompanyId
          ? [systemCompanyId]
          : [];

  const load = useCallback(async () => {
    if (!token || !effectiveCurrentCompanyId) {
      setLoading(false);
      return;
    }
    if (effectiveCompanyIds.length === 0) {
      setAllCategories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = new URLSearchParams({
        companyIds: effectiveCompanyIds.join(","),
        currentCompanyId: String(effectiveCurrentCompanyId),
      });
      if (typeFilter) q.set("type", typeFilter);
      const res = await fetch(`/api/admin/company/categories?${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const raw = data.categories ?? [];
        setAllCategories(ensureExpanded(raw));
        setHiddenCategoryIds(data.hiddenCategoryIds ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [
    token,
    effectiveCurrentCompanyId,
    effectiveCompanyIds.join(","),
    typeFilter,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setCategories(ensureExpanded(allCategories));
  }, [allCategories]);

  const handleToggleExpand = useCallback((node: CategoryNode) => {
    setCategories((prev) => toggleNodeExpanded(prev, node.id));
  }, []);

  const handleDelete = async (id: number) => {
    if (!token || !confirm("确定要删除该分类吗？")) return;
    try {
      const res = await fetch(`/api/admin/company/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await load();
      else {
        const err = await res.json();
        alert(err?.error || "删除失败");
      }
    } catch (e) {
      alert("删除失败");
    }
  };

  const updateCompanyHidden = async (ids: number[]) => {
    if (!token || !effectiveCurrentCompanyId) return;
    const res = await fetch(`/api/admin/company/${effectiveCurrentCompanyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ hidden_category_ids: ids }),
    });
    if (res.ok) {
      setHiddenCategoryIds(ids);
      await load();
    } else {
      const err = await res.json();
      alert(err?.error || "操作失败");
    }
  };

  const handleHide = (categoryId: number) => {
    if (hiddenCategoryIds.includes(categoryId)) return;
    updateCompanyHidden([...hiddenCategoryIds, categoryId]);
  };

  const handleUnhide = (categoryId: number) => {
    updateCompanyHidden(hiddenCategoryIds.filter((id) => id !== categoryId));
  };

  const isFromSystem = (node: CategoryNode) =>
    systemCompanyId != null && node.company_companies === systemCompanyId;
  const isCategoryHidden = (node: CategoryNode) => hiddenCategoryIds.includes(node.id);

  const visibilityFlatList = (() => {
    const flat = flattenTree(categories, 0);
    if (scopeFilter === "mine") return flat;
    if (visibilityFilter === "all") return flat;
    if (visibilityFilter === "visible") {
      return flat.filter((item) => !isFromSystem(item.node) || !isCategoryHidden(item.node));
    }
    return flat.filter((item) => isFromSystem(item.node) && isCategoryHidden(item.node));
  })();

  if (!effectiveCurrentCompanyId) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">分类管理</h1>
        <p className="text-slate-600">请先在顶部选择公司。</p>
      </div>
    );
  }

  const canEdit =
    !isAuditMode &&
    (user?.role === "admin" ||
      (effectiveCurrentCompanyId === company?.id && isAdminForSelectedCompany));

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {isAuditMode && (
        <div className="flex-shrink-0 mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-amber-800 text-sm">
          核查模式：仅查看，不可操作
        </div>
      )}
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800">分类管理</h1>
        {canEdit ? (
          <Link
            href="/dashboard/company/categories/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            + 添加
          </Link>
        ) : (
          <span className="text-sm text-slate-500">仅查看，不可操作</span>
        )}
      </div>

      {/* 类型筛选：全部 | 产品 | 套餐 */}
      <div className="flex-shrink-0 flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTypeFilter(null)}
            className={`px-3 py-1.5 text-sm rounded ${
              typeFilter === null ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            全部
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("product")}
            className={`px-3 py-1.5 text-sm rounded ${
              typeFilter === "product" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            产品
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("package")}
            className={`px-3 py-1.5 text-sm rounded ${
              typeFilter === "package" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            套餐
          </button>
        </div>

        {/* 范围筛选：全部 | 只看自己公司 | 只看总部 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setScopeFilter("all")}
            className={`px-3 py-1 text-sm rounded ${
              scopeFilter === "all" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            全部
          </button>
          <button
            type="button"
            onClick={() => setScopeFilter("mine")}
            className={`px-3 py-1 text-sm rounded ${
              scopeFilter === "mine" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            只看自己公司
          </button>
          <button
            type="button"
            onClick={() => setScopeFilter("headquarters")}
            className={`px-3 py-1 text-sm rounded ${
              scopeFilter === "headquarters" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            只看总部
          </button>
        </div>

        {/* 可见性筛选：全部 | 展示中 | 已隐藏（仅当范围不是「只看自己公司」时显示） */}
        {scopeFilter !== "mine" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVisibilityFilter("all")}
              className={`px-3 py-1 text-xs rounded ${
                visibilityFilter === "all" ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600"
              }`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => setVisibilityFilter("visible")}
              className={`px-3 py-1 text-xs rounded ${
                visibilityFilter === "visible" ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600"
              }`}
            >
              展示中
            </button>
            <button
              type="button"
              onClick={() => setVisibilityFilter("hidden")}
              className={`px-3 py-1 text-xs rounded ${
                visibilityFilter === "hidden" ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600"
              }`}
            >
              已隐藏
            </button>
          </div>
        )}
        <p className="text-xs text-slate-500 mt-2 max-w-3xl leading-relaxed">
          <span className="font-medium text-slate-600">展示模式：</span>
          「继续展示分类」= 小程序进入后先看子分类入口；「展示产品」= 小程序进入后在本页展示该分类下商品（不含子分类下的商品）。
        </p>
      </div>

      {loading ? (
        <div className="flex-1 min-h-0 flex items-center">
          <p className="text-slate-500">加载中…</p>
        </div>
      ) : visibilityFlatList.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          <p className="mb-2">暂无分类</p>
          <p className="text-sm text-slate-500 mb-4">{canEdit ? "点击右上角添加分类" : "当前为查看模式"}</p>
          {canEdit && (
            <Link
              href="/dashboard/company/categories/new"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              添加分类
            </Link>
          )}
        </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
          {visibilityFlatList.map((item) => (
            <CategoryTreeItem
              key={item.node.id}
              item={item}
              systemCompanyId={systemCompanyId}
              effectiveCurrentCompanyId={effectiveCurrentCompanyId}
              hiddenCategoryIds={hiddenCategoryIds}
              onDelete={handleDelete}
              onHide={handleHide}
              onUnhide={handleUnhide}
              onToggleExpand={handleToggleExpand}
              isAdmin={canEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
