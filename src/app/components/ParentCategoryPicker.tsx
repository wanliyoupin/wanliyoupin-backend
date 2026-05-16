"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/lib/auth-context";

type CategoryNode = {
  id: number;
  name: string;
  icon_url?: string | null;
  level: number;
  type?: string;
  company_companies?: number;
  categories?: CategoryNode[];
};

type Props = {
  value: number | null | undefined;
  /** (parentId, level) - 选父级时 level = 父级.level + 1，无父级时 level = 0 */
  onChange: (parentId: number | null, level: number) => void;
  /** 编辑时传入当前分类 ID，用于排除自身及后代 */
  excludeCategoryId?: number;
  disabled?: boolean;
  companyId: number;
};

/** 收集某节点及其所有后代 ID */
function collectDescendantIds(nodes: CategoryNode[], targetId: number): Set<number> {
  const ids = new Set<number>();
  function walk(n: CategoryNode) {
    ids.add(n.id);
    n.categories?.forEach(walk);
  }
  function findAndCollect(nodes: CategoryNode[]): boolean {
    for (const n of nodes) {
      if (n.id === targetId) {
        walk(n);
        return true;
      }
      if (n.categories && findAndCollect(n.categories)) return true;
    }
    return false;
  }
  findAndCollect(nodes);
  return ids;
}

/** 递归过滤排除的节点 */
function filterExcluded(nodes: CategoryNode[], excludeIds: Set<number>): CategoryNode[] {
  return nodes
    .filter((n) => !excludeIds.has(n.id))
    .map((n) => ({
      ...n,
      categories: n.categories ? filterExcluded(n.categories, excludeIds) : [],
    }));
}

function findCategoryName(nodes: CategoryNode[], id: number): string | null {
  for (const n of nodes) {
    if (n.id === id) return n.name ?? null;
    if (n.categories) {
      const found = findCategoryName(n.categories, id);
      if (found) return found;
    }
  }
  return null;
}

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: CategoryNode;
  depth: number;
  selectedId: number | null | undefined;
  onSelect: (node: CategoryNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const children = node.categories ?? [];
  const hasChildren = children.length > 0;

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <div
        className={`flex items-center justify-between gap-2 py-2.5 px-3 transition-colors ${
          depth > 0 ? "bg-slate-50/80" : "bg-white"
        } ${selectedId === node.id ? "bg-indigo-50" : "hover:bg-slate-50"}`}
        style={{ paddingLeft: 12 + depth * 16 }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => hasChildren && setExpanded((e) => !e)}
            className="w-5 h-5 flex items-center justify-center text-slate-400 shrink-0"
          >
            {hasChildren ? (expanded ? "▼" : "▶") : " "}
          </button>
          {node.icon_url ? (
            <img src={node.icon_url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-semibold text-xs">
              {(node.name || "")[0] || "?"}
            </div>
          )}
          <span className="text-sm text-slate-800 truncate">{node.name}</span>
        </div>
        <button
          type="button"
          onClick={() => onSelect(node)}
          className="shrink-0 px-2.5 py-1 bg-indigo-600 text-white text-xs rounded-full hover:bg-indigo-700"
        >
          选择
        </button>
      </div>
      {hasChildren && expanded && (
        <div className="border-l border-slate-200 ml-4">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ParentCategoryPicker({
  value,
  onChange,
  excludeCategoryId,
  disabled,
  companyId,
}: Props) {
  const { token, company, companyIdsIncludingSystem, systemCompanyId } = useAuth();
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<"all" | "mine" | "headquarters">("all");
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const companyIds =
    scope === "all"
      ? companyIdsIncludingSystem
      : scope === "mine"
        ? companyId ? [companyId] : []
        : systemCompanyId
          ? [systemCompanyId]
          : [];

  const loadCategories = useCallback(async () => {
    if (!token || !companyId || companyIds.length === 0) {
      setCategories([]);
      return;
    }
    setLoading(true);
    try {
      const q = new URLSearchParams({
        companyIds: companyIds.join(","),
        currentCompanyId: String(companyId),
        type: "product",
      });
      const res = await fetch(`/api/admin/company/categories?${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const raw: CategoryNode[] = data?.categories ?? [];
      setCategories(raw);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [token, companyId, companyIds.join(",")]);

  useEffect(() => {
    if (open) loadCategories();
  }, [open, loadCategories]);

  useEffect(() => {
    if (value != null && token && companyId && categories.length === 0 && !open) {
      loadCategories();
    }
  }, [value, token, companyId, open, categories.length, loadCategories]);

  useEffect(() => {
    if (value != null && categories.length > 0) {
      const name = findCategoryName(categories, value);
      if (name) setSelectedName(name);
    } else if (value == null) {
      setSelectedName(null);
    }
  }, [value, categories]);

  const excludeIds = (() => {
    if (!excludeCategoryId) return new Set<number>();
    return collectDescendantIds(categories, excludeCategoryId);
  })();

  const displayCategories = filterExcluded(categories, excludeIds);

  const handleSelect = (node: CategoryNode | null) => {
    if (node == null) {
      onChange(null, 0);
      setSelectedName(null);
    } else {
      onChange(node.id, node.level + 1);
      setSelectedName(node.name);
    }
    setOpen(false);
  };

  const displayText =
    selectedName ?? (value != null ? "已选" : "顶级分类（无父级）");

  return (
    <div>
      <button
        type="button"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={`w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
          disabled
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100"
        }`}
      >
        <span className={!selectedName && value == null ? "text-slate-500" : ""}>
          {displayText}
        </span>
        <span className="text-slate-400">›</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-30"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800">选择分类</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-2xl text-slate-400 hover:text-slate-600 leading-none"
              >
                ×
              </button>
            </div>

            {/* 筛选：全部 | 只看当前公司 | 只看总部 */}
            <div className="flex gap-2 px-4 py-2 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  scope === "all" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                全部
              </button>
              <button
                type="button"
                onClick={() => setScope("mine")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  scope === "mine" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                只看当前公司
              </button>
              <button
                type="button"
                onClick={() => setScope("headquarters")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  scope === "headquarters" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                只看总部
              </button>
            </div>

            {/* 不选择分类 */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-4 py-3 border-b border-slate-100 text-sm ${
                value == null ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              不选择分类
            </button>

            {/* 分类树 */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <div className="py-12 text-center text-slate-500 text-sm">加载中…</div>
              ) : displayCategories.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">暂无分类</div>
              ) : (
                <div className="py-1">
                  {displayCategories.map((node) => (
                    <TreeNode
                      key={node.id}
                      node={node}
                      depth={0}
                      selectedId={value}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
