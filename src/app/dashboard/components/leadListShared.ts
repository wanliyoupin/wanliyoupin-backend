import type { LeadExportRow } from "@/app/lib/exportLeadExcel";
import {
  formatLeadLocationText,
  parseLeadLocationFromMoreInfo,
  readLeadMoreInfoStr,
} from "@/app/dashboard/components/leadProfileFields";

export const LEAD_STATUS_LABEL: Record<string, string> = {
  new: "新建",
  lost: "失败",
  converted: "已转客户",
};

export function statusLabel(s: string) {
  return LEAD_STATUS_LABEL[s] ?? s;
}

export function readLeadDisplayName(moreInfo: unknown, name: string) {
  return readLeadMoreInfoStr(moreInfo, "companyName") || name?.trim() || "—";
}

export function readLeadListRegion(moreInfo: unknown) {
  const region = readLeadMoreInfoStr(moreInfo, "region");
  if (region) return region;
  const locText = formatLeadLocationText(parseLeadLocationFromMoreInfo(moreInfo));
  return locText || "—";
}

export function readLeadCustomerLevel(moreInfo: unknown, status: string) {
  const custom = readLeadMoreInfoStr(moreInfo, "customerLevel");
  if (custom) return custom;
  const m: Record<string, string> = {
    new: "普通C级",
    lost: "无效D级",
    converted: "重点A级",
  };
  return m[status] ?? "—";
}

export type FetchLeadsExportParams = {
  token: string;
  companyId?: number | null;
  statusFilter?: string;
  keyword?: string;
};

/** 分页拉取当前筛选条件下全部线索（供导出） */
export async function fetchAllLeadsForExport(
  params: FetchLeadsExportParams
): Promise<LeadExportRow[]> {
  const { token, companyId, statusFilter, keyword } = params;
  const pageSizeExport = 100;
  let offset = 0;
  let totalCount = 0;
  const all: LeadExportRow[] = [];

  do {
    const qs = new URLSearchParams({
      limit: String(pageSizeExport),
      offset: String(offset),
    });
    if (companyId != null) qs.set("companyId", String(companyId));
    if (statusFilter) qs.set("status", statusFilter);
    if (keyword) qs.set("keyword", keyword);

    const res = await fetch(`/api/admin/company/leads?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "导出失败");

    const batch = (data.leads ?? []) as LeadExportRow[];
    totalCount = data.total ?? 0;
    all.push(...batch);
    offset += pageSizeExport;
    if (batch.length < pageSizeExport) break;
  } while (all.length < totalCount);

  return all;
}
