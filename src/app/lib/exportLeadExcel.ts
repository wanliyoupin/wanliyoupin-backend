/**
 * 线索导出：对齐「万丽优品-销售管客户管理模板（跑盘数据专用01版）」
 */
import * as XLSX from "xlsx";

export type LeadExportRow = {
  id?: number;
  name?: string;
  phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  more_info?: unknown;
  company_user?: { user?: { nickname?: string; mobile?: string } } | null;
  companyUserByCreatedByCompanyUsers?: { user?: { nickname?: string; mobile?: string } } | null;
  company_lead_tracks?: { content?: string; created_at?: string }[];
};

export const WANLI_LEAD_TEMPLATE_HEADERS: string[] = [
  "",
  "序号",
  "地区（必填项）同步全地图到县级",
  "公司门头（图片上传）必填项",
  "IP定位（微信定位上传）必填项",
  "公司名称          必填项                 （自带门头识别填写功能和手动补充填写修改功能）",
  "负责人     （法人代表/材料主管/设计师/财务）",
  "联系电话          （手机号）必填项",
  "微信号/选填项",
  "企业类型           全包-              半包-              设计-              夫妻-            （预留自由添加选项）必填项",
  "开发时间    拜访时间-默认当天提交日期，保留自由选择日期。必填项",
  "客户类别   -重点A级-  -潜力B级-  -普通C级-  -无效D级-",
  "对接人首次沟通评价：多选项-沟通流畅-认同感强-热情好客-敷衍了事-排斥反感-（保留自由添加选项）必填项",
  "图册发放情况-灯具图册/1本-家具图册/1本-卫浴图册/1本；发放途径：现场/快递",
  "首次客户拜访情况描述      （实际拜访情况介绍）-必填项，自由编写",
  "第一次回访跟进情况介绍                          （72小时/电联/微联）",
  "第二次回访跟进情况介绍             （2周内/电联/微联）",
  "第三次回访跟进情况介绍             （3周内/电联/微联）",
  "第四次回访跟进情况介绍              （4周内/电联/微联）",
  "开单时间       （首次下单时间）",
  "累计开单数量",
  "累计开单金额",
  "备注",
];

const STATUS_LABEL: Record<string, string> = {
  new: "新建",
  lost: "失败",
  converted: "已转客户",
};

function readMoreInfoStr(moreInfo: unknown, key: string): string {
  if (moreInfo == null || typeof moreInfo !== "object" || Array.isArray(moreInfo)) return "";
  const v = (moreInfo as Record<string, unknown>)[key];
  if (v == null) return "";
  return String(v).trim();
}

function parseLocation(moreInfo: unknown): {
  latitude?: number;
  longitude?: number;
  name?: string;
  address?: string;
} | null {
  if (moreInfo == null || typeof moreInfo !== "object" || Array.isArray(moreInfo)) return null;
  const loc = (moreInfo as Record<string, unknown>).location;
  if (loc == null || typeof loc !== "object" || Array.isArray(loc)) return null;
  const o = loc as Record<string, unknown>;
  const latitude = Number(o.latitude);
  const longitude = Number(o.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return {
    latitude,
    longitude,
    name: typeof o.name === "string" ? o.name : undefined,
    address: typeof o.address === "string" ? o.address : undefined,
  };
}

function formatDateOnly(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}


function statusToCustomerLevel(status: string, moreInfo: unknown): string {
  const custom = readMoreInfoStr(moreInfo, "customerLevel");
  if (custom) return custom;
  const m: Record<string, string> = {
    new: "普通C级",
    lost: "无效D级",
    converted: "重点A级",
  };
  return m[status] ?? "";
}

function formatIpLocation(moreInfo: unknown): string {
  const loc = parseLocation(moreInfo);
  if (!loc) return readMoreInfoStr(moreInfo, "ipLocation");
  const parts: string[] = [`${loc.latitude},${loc.longitude}`];
  if (loc.name) parts.push(loc.name);
  if (loc.address) parts.push(loc.address);
  return parts.join(" ");
}

function formatRegion(moreInfo: unknown): string {
  const region = readMoreInfoStr(moreInfo, "region");
  if (region) return region;
  const loc = parseLocation(moreInfo);
  return loc?.address || loc?.name || "";
}

function trackContent(track?: { content?: string }): string {
  return track?.content?.trim() ?? "";
}

export function leadsToWanliTemplateRows(
  leads: LeadExportRow[],
  companyName: string
): (string | number)[][] {
  const year = new Date().getFullYear();
  const title = `${companyName || "销售"}-销售客户数据管理中心${year}年导出`;
  const titleRow: (string | number)[] = ["", title];
  while (titleRow.length < WANLI_LEAD_TEMPLATE_HEADERS.length) titleRow.push("");

  const rows: (string | number)[][] = [titleRow, [...WANLI_LEAD_TEMPLATE_HEADERS]];

  leads.forEach((lead, idx) => {
    const mi = lead.more_info;
    const tracks = [...(lead.company_lead_tracks ?? [])].sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return ta - tb;
    });
    const firstVisit =
      readMoreInfoStr(mi, "firstVisitDesc") ||
      readMoreInfoStr(mi, "firstVisit") ||
      "";

    rows.push([
      "",
      idx + 1,
      formatRegion(mi),
      readMoreInfoStr(mi, "storefrontImageUrl") || readMoreInfoStr(mi, "storefrontImage"),
      formatIpLocation(mi),
      readMoreInfoStr(mi, "companyName") || lead.name || "",
      readMoreInfoStr(mi, "contactPerson"),
      lead.phone || "",
      readMoreInfoStr(mi, "wechat"),
      readMoreInfoStr(mi, "businessType"),
      readMoreInfoStr(mi, "visitDate") || formatDateOnly(lead.created_at),
      statusToCustomerLevel(String(lead.status ?? ""), mi),
      readMoreInfoStr(mi, "firstEvaluation"),
      readMoreInfoStr(mi, "catalogDelivery"),
      firstVisit,
      trackContent(tracks[0]),
      trackContent(tracks[1]),
      trackContent(tracks[2]),
      trackContent(tracks[3]),
      readMoreInfoStr(mi, "firstOrderAt") ||
        (lead.status === "converted"
          ? formatDateOnly(lead.updated_at)
          : ""),
      readMoreInfoStr(mi, "orderCount"),
      readMoreInfoStr(mi, "orderAmount"),
      readMoreInfoStr(mi, "remark") ||
        (lead.status && STATUS_LABEL[lead.status]
          ? `系统状态：${STATUS_LABEL[lead.status]}`
          : ""),
    ]);
  });

  return rows;
}

export function buildLeadExportWorkbook(
  leads: LeadExportRow[],
  companyName: string
): ArrayBuffer {
  const rows = leadsToWanliTemplateRows(leads, companyName);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "销售客户管理模板01版");
  return XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
}

export function downloadLeadExportXlsx(leads: LeadExportRow[], companyName: string, fileName?: string) {
  const buffer = buildLeadExportWorkbook(leads, companyName);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = (companyName || "线索").replace(/[/\\?*[\]:]/g, "_").slice(0, 20);
  a.href = url;
  a.download = fileName ?? `${safe}_线索导出_${Date.now()}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
