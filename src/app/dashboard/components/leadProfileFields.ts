/** 与小程序、导出模板一致的 more_info 字段 */

export const BUSINESS_TYPE_OPTIONS = ["全包", "半包", "设计", "夫妻"] as const;
export const CUSTOMER_LEVEL_OPTIONS = ["重点A级", "潜力B级", "普通C级", "无效D级"] as const;
export const FIRST_EVALUATION_OPTIONS = [
  "沟通流畅",
  "认同感强",
  "热情好客",
  "敷衍了事",
  "排斥反感",
] as const;

export type LeadProfileForm = {
  name: string;
  phone: string;
  contactPerson: string;
  wechat: string;
  region: string;
  businessType: string;
  visitDate: string;
  customerLevel: string;
  firstEvaluation: string;
  catalogDelivery: string;
  firstVisitDesc: string;
  firstOrderAt: string;
  orderCount: string;
  orderAmount: string;
  remark: string;
  storefrontImageUrl: string;
};

const MORE_INFO_KEYS = [
  "contactPerson",
  "wechat",
  "region",
  "businessType",
  "visitDate",
  "customerLevel",
  "firstEvaluation",
  "catalogDelivery",
  "firstVisitDesc",
  "firstOrderAt",
  "orderCount",
  "orderAmount",
  "remark",
  "storefrontImageUrl",
  "companyName",
] as const;

export function readLeadMoreInfoStr(moreInfo: unknown, key: string): string {
  if (moreInfo == null || typeof moreInfo !== "object" || Array.isArray(moreInfo)) return "";
  const v = (moreInfo as Record<string, unknown>)[key];
  if (v == null) return "";
  return String(v).trim();
}

/** 线索 more_info.location */
export type LeadLocation = {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
};

export function parseLeadLocationFromMoreInfo(moreInfo: unknown): LeadLocation | null {
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

export function formatLeadLocationText(loc: LeadLocation | null): string {
  if (!loc) return "";
  if (loc.address) return loc.address;
  if (loc.name) return loc.name;
  return `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`;
}

function readStr(moreInfo: unknown, key: string): string {
  return readLeadMoreInfoStr(moreInfo, key);
}

export function parseLeadProfileForm(
  lead: { name: string; phone: string; more_info?: unknown }
): LeadProfileForm {
  const mi = lead.more_info;
  let storefrontImageUrl = readStr(mi, "storefrontImageUrl") || readStr(mi, "storefrontImage");
  return {
    name: readStr(mi, "companyName") || lead.name?.trim() || "",
    phone: lead.phone?.trim() || "",
    contactPerson: readStr(mi, "contactPerson"),
    wechat: readStr(mi, "wechat"),
    region: readStr(mi, "region"),
    businessType: readStr(mi, "businessType"),
    visitDate: readStr(mi, "visitDate"),
    customerLevel: readStr(mi, "customerLevel"),
    firstEvaluation: readStr(mi, "firstEvaluation"),
    catalogDelivery: readStr(mi, "catalogDelivery"),
    firstVisitDesc: readStr(mi, "firstVisitDesc"),
    firstOrderAt: readStr(mi, "firstOrderAt"),
    orderCount: readStr(mi, "orderCount"),
    orderAmount: readStr(mi, "orderAmount"),
    remark: readStr(mi, "remark"),
    storefrontImageUrl,
  };
}

export function buildMoreInfoUpdatePayload(form: LeadProfileForm): Record<string, string | null> {
  const payload: Record<string, string | null> = {};
  for (const key of MORE_INFO_KEYS) {
    let v = "";
    if (key === "companyName") v = form.name.trim();
    else v = String(form[key as keyof LeadProfileForm] ?? "").trim();
    payload[key] = v || null;
  }
  return payload;
}

export function todayDateString(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function emptyLeadProfileForm(): LeadProfileForm {
  return {
    name: "",
    phone: "",
    contactPerson: "",
    wechat: "",
    region: "",
    businessType: "",
    visitDate: todayDateString(),
    customerLevel: "",
    firstEvaluation: "",
    catalogDelivery: "",
    firstVisitDesc: "",
    firstOrderAt: "",
    orderCount: "",
    orderAmount: "",
    remark: "",
    storefrontImageUrl: "",
  };
}
