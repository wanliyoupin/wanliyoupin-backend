"use client";

import {
  BUSINESS_TYPE_OPTIONS,
  CUSTOMER_LEVEL_OPTIONS,
  FIRST_EVALUATION_OPTIONS,
  type LeadProfileForm,
} from "@/app/dashboard/components/leadProfileFields";

type Props = {
  form: LeadProfileForm;
  onChange: (key: keyof LeadProfileForm, value: string) => void;
  onStorefrontUpload?: (file: File) => void;
  storefrontUploading?: boolean;
  disabled?: boolean;
};

const inputClass =
  "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50";
const labelClass = "mb-1 block text-sm font-semibold text-slate-800";
const sectionClass = "space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5";
const sectionTitleClass = "text-sm font-bold text-slate-900";

export function LeadProfileFormFields({
  form,
  onChange,
  onStorefrontUpload,
  storefrontUploading = false,
  disabled = false,
}: Props) {
  return (
    <div className="space-y-5">
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>基本信息</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>
              公司名称 <span className="text-red-600">*</span>
            </span>
            <input
              className={inputClass}
              value={form.name}
              disabled={disabled}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="必填"
            />
          </label>
          <label className="block">
            <span className={labelClass}>负责人</span>
            <input
              className={inputClass}
              value={form.contactPerson}
              disabled={disabled}
              onChange={(e) => onChange("contactPerson", e.target.value)}
              placeholder="法人代表/材料主管/设计师/财务"
            />
          </label>
          <label className="block">
            <span className={labelClass}>
              联系电话 <span className="text-red-600">*</span>
            </span>
            <input
              className={inputClass}
              value={form.phone}
              disabled={disabled}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="手机号"
            />
          </label>
          <label className="block">
            <span className={labelClass}>微信号</span>
            <input
              className={inputClass}
              value={form.wechat}
              disabled={disabled}
              onChange={(e) => onChange("wechat", e.target.value)}
              placeholder="选填"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>地区</span>
            <input
              className={inputClass}
              value={form.region}
              disabled={disabled}
              onChange={(e) => onChange("region", e.target.value)}
              placeholder="同步到县级"
            />
          </label>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>门头图片</h3>
        <p className="mt-1 text-xs text-slate-600">地图选点请在小程序端录入；后台可上传门头照片。</p>
        <div className="mt-3 flex flex-wrap items-start gap-4">
          {form.storefrontImageUrl ? (
            <a
              href={form.storefrontImageUrl}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-lg border border-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.storefrontImageUrl}
                alt="门头"
                className="h-28 w-40 object-cover"
              />
            </a>
          ) : (
            <div className="flex h-28 w-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-xs text-slate-500">
              未上传
            </div>
          )}
          <div className="min-w-[240px] flex-1 space-y-2">
            {onStorefrontUpload && (
              <input
                type="file"
                accept="image/*"
                disabled={disabled || storefrontUploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onStorefrontUpload(f);
                  e.target.value = "";
                }}
                className="block w-full text-sm text-slate-800 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-800 disabled:opacity-50"
              />
            )}
            <input
              className={inputClass}
              value={form.storefrontImageUrl}
              disabled={disabled}
              onChange={(e) => onChange("storefrontImageUrl", e.target.value)}
              placeholder="或粘贴图片 URL"
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>客户分类</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>企业类型</span>
            <select
              className={inputClass}
              value={form.businessType}
              disabled={disabled}
              onChange={(e) => onChange("businessType", e.target.value)}
            >
              <option value="">请选择</option>
              {BUSINESS_TYPE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>开发/拜访时间</span>
            <input
              type="date"
              className={inputClass}
              value={form.visitDate}
              disabled={disabled}
              onChange={(e) => onChange("visitDate", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>客户类别</span>
            <select
              className={inputClass}
              value={form.customerLevel}
              disabled={disabled}
              onChange={(e) => onChange("customerLevel", e.target.value)}
            >
              <option value="">请选择</option>
              {CUSTOMER_LEVEL_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>首次沟通评价</span>
            <select
              className={inputClass}
              value={form.firstEvaluation}
              disabled={disabled}
              onChange={(e) => onChange("firstEvaluation", e.target.value)}
            >
              <option value="">请选择</option>
              {FIRST_EVALUATION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>拜访与开单</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>图册发放</span>
            <input
              className={inputClass}
              value={form.catalogDelivery}
              disabled={disabled}
              onChange={(e) => onChange("catalogDelivery", e.target.value)}
              placeholder="如：灯具图册/1本；现场发放"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>首次拜访描述</span>
            <textarea
              className={`${inputClass} min-h-[88px]`}
              value={form.firstVisitDesc}
              disabled={disabled}
              onChange={(e) => onChange("firstVisitDesc", e.target.value)}
              placeholder="实际拜访情况介绍"
            />
          </label>
          <label className="block">
            <span className={labelClass}>开单时间</span>
            <input
              type="date"
              className={inputClass}
              value={form.firstOrderAt}
              disabled={disabled}
              onChange={(e) => onChange("firstOrderAt", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>累计开单数</span>
            <input
              className={inputClass}
              value={form.orderCount}
              disabled={disabled}
              onChange={(e) => onChange("orderCount", e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="block">
            <span className={labelClass}>累计开单金额</span>
            <input
              className={inputClass}
              value={form.orderAmount}
              disabled={disabled}
              onChange={(e) => onChange("orderAmount", e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>备注</span>
            <textarea
              className={`${inputClass} min-h-[72px]`}
              value={form.remark}
              disabled={disabled}
              onChange={(e) => onChange("remark", e.target.value)}
              placeholder="选填"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
