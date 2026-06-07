"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import { LeadProfileFormFields } from "@/app/dashboard/components/LeadProfileFormFields";
import {
  buildMoreInfoUpdatePayload,
  emptyLeadProfileForm,
  type LeadProfileForm,
} from "@/app/dashboard/components/leadProfileFields";

export type LeadCreateScope = "company" | "admin";

type Props = {
  scope: LeadCreateScope;
};

export function LeadCreateClient({ scope }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, company, user, canAccessCompanyLeads } = useAuth();

  const companyIdFromQs = searchParams.get("companyId");
  const adminCompanyId = useMemo(() => {
    if (scope !== "admin" || !companyIdFromQs) return null;
    const n = Number(companyIdFromQs);
    return Number.isInteger(n) && n > 0 ? n : null;
  }, [scope, companyIdFromQs]);

  const effectiveCompanyId =
    scope === "admin" ? adminCompanyId : company?.id != null ? Number(company.id) : null;

  const canCreate =
    scope === "admin"
      ? user?.role === "admin" && effectiveCompanyId != null
      : user?.role === "admin" || canAccessCompanyLeads;

  const listHref =
    scope === "admin"
      ? effectiveCompanyId != null
        ? `/dashboard/admin/leads?companyId=${effectiveCompanyId}`
        : "/dashboard/admin/leads"
      : "/dashboard/company/leads";

  const [form, setForm] = useState<LeadProfileForm>(() => emptyLeadProfileForm());
  const [submitting, setSubmitting] = useState(false);
  const [storefrontUploading, setStorefrontUploading] = useState(false);
  const [err, setErr] = useState("");

  const patchField = (key: keyof LeadProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadStorefront = async (file: File) => {
    if (!token) return;
    setStorefrontUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "上传失败");
      patchField("storefrontImageUrl", data.url as string);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "上传失败");
    } finally {
      setStorefrontUploading(false);
    }
  };

  const validate = (): boolean => {
    const name = form.name.trim();
    const phone = form.phone.trim();
    if (!name) {
      setErr("请填写公司名称");
      return false;
    }
    if (!phone || phone.length < 7) {
      setErr("请填写有效手机号");
      return false;
    }
    return true;
  };

  const submit = async () => {
    setErr("");
    if (!token || !effectiveCompanyId || !validate() || submitting) return;

    const name = form.name.trim();
    const phone = form.phone.trim();
    const moreInfo = buildMoreInfoUpdatePayload(form);
    moreInfo.companyName = name;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/company/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyId: effectiveCompanyId, name, phone, moreInfo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "创建失败");
        return;
      }
      const detailHref =
        scope === "admin"
          ? `/dashboard/admin/leads/${data.id}?companyId=${effectiveCompanyId}`
          : `/dashboard/company/leads/${data.id}`;
      router.push(detailHref);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "创建失败");
    } finally {
      setSubmitting(false);
    }
  };

  if (scope === "company" && !canAccessCompanyLeads && user?.role !== "admin") {
    return <p className="text-base font-medium text-slate-700">无权限录入线索</p>;
  }

  if (scope === "admin" && user?.role !== "admin") {
    return (
      <p className="text-base font-medium text-slate-700">
        仅平台管理员可在此录入线索。公司成员请使用「我的公司 → 线索管理」。
      </p>
    );
  }

  if (!canCreate || effectiveCompanyId == null) {
    return (
      <div className="space-y-3">
        <p className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {scope === "admin"
            ? "请先在列表页选择目标公司，再点击「录入线索」。"
            : "请先在顶部选择所属公司。"}
        </p>
        <Link href={listHref} className="text-sm font-medium text-indigo-700 hover:underline">
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link
          href={listHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-800"
        >
          <span aria-hidden>←</span>
          返回列表
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">录入线索</h1>
        <p className="mt-1 text-sm text-slate-600">
          字段与小程序跑盘模板一致
          {scope === "company" && company?.name ? ` · 当前公司：${company.name}` : ""}
        </p>
      </div>

      <LeadProfileFormFields
        form={form}
        onChange={patchField}
        onStorefrontUpload={uploadStorefront}
        storefrontUploading={storefrontUploading}
      />

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={submitting}
          onClick={() => void submit()}
          className="rounded bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "提交中…" : "提交录入"}
        </button>
        <Link
          href={listHref}
          className="rounded border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          取消
        </Link>
      </div>
    </div>
  );
}
