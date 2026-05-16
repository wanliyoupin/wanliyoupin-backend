"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/lib/auth-context";

type CategoryNode = {
  id: number;
  name: string;
  categories?: CategoryNode[];
};

type Props = {
  type: "product" | "package";
  value: number | null;
  onChange: (id: number | null, pathLabel?: string) => void;
  allowClear?: boolean;
  className?: string;
};

function buildPathLabel(node: CategoryNode, path: string[] = []): string {
  const p = [...path, node.name];
  return p.join(" / ");
}

/** 在树中查找节点并返回其路径标签 */
function findPathLabelById(nodes: CategoryNode[], targetId: number, path: string[] = []): string | null {
  for (const node of nodes) {
    const p = [...path, node.name];
    if (node.id === targetId) return p.join(" / ");
    if (node.categories?.length) {
      const found = findPathLabelById(node.categories, targetId, p);
      if (found) return found;
    }
  }
  return null;
}

function TreeList({
  nodes,
  depth,
  selectedId,
  onSelect,
  pathPrefix,
}: {
  nodes: CategoryNode[];
  depth: number;
  selectedId: number | null;
  onSelect: (id: number | null, pathLabel: string) => void;
  pathPrefix: string[];
}) {
  return (
    <ul className={depth ? "ml-3 border-l border-slate-200 pl-2" : ""}>
      {nodes.map((node) => {
        const pathLabel = buildPathLabel(node, pathPrefix);
        const isSelected = selectedId === node.id;
        return (
          <li key={node.id} className="mb-1">
            <button
              type="button"
              onClick={() => onSelect(node.id, pathLabel)}
              className={`w-full text-left px-2 py-1.5 rounded text-sm ${isSelected ? "bg-indigo-100 text-indigo-800 font-medium" : "text-slate-700 hover:bg-slate-100"}`}
              style={depth ? { paddingLeft: 8 + depth * 12 } : undefined}
            >
              {node.name}
            </button>
            {node.categories?.length ? (
              <TreeList
                nodes={node.categories}
                depth={depth + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                pathPrefix={[...pathPrefix, node.name]}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function CategoryPicker({ type, value, onChange, allowClear, className = "" }: Props) {
  const { token, company, companyIdsIncludingSystem, systemCompanyId } = useAuth();
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<"all" | "mine" | "headquarters">("all");
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const companyIds =
    scope === "all"
      ? companyIdsIncludingSystem
      : scope === "mine"
        ? company?.id
          ? [company.id]
          : []
        : systemCompanyId
          ? [systemCompanyId]
          : [];

  const loadTree = useCallback(async () => {
    if (!token || !company || companyIds.length === 0) {
      setTree([]);
      return;
    }
    setLoading(true);
    try {
      const q = new URLSearchParams({
        companyIds: companyIds.join(","),
        currentCompanyId: String(company.id),
        type,
      });
      const res = await fetch(`/api/admin/company/categories?${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTree(data.categories ?? []);
    } finally {
      setLoading(false);
    }
  }, [token, company?.id, companyIds.join(","), type]);

  useEffect(() => {
    if (open) loadTree();
  }, [open, loadTree]);

  // 编辑页回显：有 value 但无 selectedLabel 时，加载树后解析出分类名称
  useEffect(() => {
    if (value != null && selectedLabel == null && tree.length > 0) {
      const label = findPathLabelById(tree, value);
      if (label) setSelectedLabel(label);
    }
  }, [value, selectedLabel, tree]);

  // 有预选值但树未加载时，先加载树以便解析名称
  useEffect(() => {
    if (value != null && selectedLabel == null && !open && tree.length === 0) {
      loadTree();
    }
  }, [value, selectedLabel, open, tree.length, loadTree]);

  const handleSelect = (id: number | null, pathLabel: string) => {
    onChange(id, pathLabel);
    setSelectedLabel(id != null ? pathLabel : null);
    setOpen(false);
  };

  const displayText = selectedLabel ?? (value != null ? `已选 (ID: ${value})` : "请选择分类");

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-left w-full min-w-[200px] text-slate-800 hover:bg-slate-50"
        >
          {displayText}
        </button>
        {allowClear && (value != null || selectedLabel) && (
          <button
            type="button"
            onClick={() => { onChange(null); setSelectedLabel(null); }}
            className="text-sm text-slate-500 hover:underline"
          >
            清除
          </button>
        )}
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-20"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-200 font-medium text-slate-800">
              {type === "product" ? "选择商品分类" : "选择套餐分类"}
            </div>
            {/* 范围筛选 */}
            <div className="flex gap-2 px-3 py-2 border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  scope === "all" ? "bg-indigo-100 text-indigo-700" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                全部
              </button>
              <button
                type="button"
                onClick={() => setScope("mine")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  scope === "mine" ? "bg-indigo-100 text-indigo-700" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                只看自己公司
              </button>
              <button
                type="button"
                onClick={() => setScope("headquarters")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  scope === "headquarters" ? "bg-indigo-100 text-indigo-700" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                只看总部
              </button>
            </div>
            <div className="p-3 overflow-y-auto flex-1">
              {loading ? (
                <p className="text-slate-500 text-sm">加载中…</p>
              ) : (
                <>
                  {allowClear && (
                    <button
                      type="button"
                      onClick={() => handleSelect(null, "")}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 ${value === null ? "bg-indigo-100 text-indigo-800" : "text-slate-700 hover:bg-slate-100"}`}
                    >
                      不选分类
                    </button>
                  )}
                  <TreeList
                    nodes={tree}
                    depth={0}
                    selectedId={value}
                    onSelect={handleSelect}
                    pathPrefix={[]}
                  />
                </>
              )}
            </div>
            <div className="p-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
