"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import {
  buildMoreInfoUpdatePayload,
  parseLeadProfileForm,
  parseLeadLocationFromMoreInfo,
  formatLeadLocationText,
  type LeadProfileForm,
} from "@/app/dashboard/components/leadProfileFields";
import { LeadProfileFormFields } from "@/app/dashboard/components/LeadProfileFormFields";

export type LeadDetailScope = "company" | "admin";

type TrackRow = {
  id: number;
  content: string;
  attachments?: unknown;
  created_at: string;
  company_user?: { user?: { nickname?: string; mobile?: string } };
};

type LeadDetail = {
  id: number;
  name: string;
  phone: string;
  status: string;
  company_companies: number;
  company?: { id: number; name: string } | null;
  created_by_company_users?: number | null;
  converted_company_users?: number | null;
  converted_at?: string | null;
  linked_user_users?: number | null;
  more_info?: unknown;
  companyUserByCreatedByCompanyUsers?: {
    id: number;
    user?: { id: number; nickname?: string; mobile?: string };
  } | null;
  company_lead_tracks?: TrackRow[];
};

type TrackAttachment = { file_type: string; file_url: string; name: string };

type ParsedTrackAttachment = {
  file_url: string;
  name?: string;
  file_type?: string;
};

function parseTrackAttachments(raw: unknown): ParsedTrackAttachment[] {
  if (!Array.isArray(raw)) return [];
  const out: ParsedTrackAttachment[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    const url = typeof o.file_url === "string" ? o.file_url.trim() : "";
    if (!url) continue;
    out.push({
      file_url: url,
      name: typeof o.name === "string" ? o.name : undefined,
      file_type: typeof o.file_type === "string" ? o.file_type : undefined,
    });
  }
  return out;
}

function isImageAttachment(a: ParsedTrackAttachment): boolean {
  const ft = (a.file_type ?? "").toLowerCase();
  if (ft.startsWith("image/")) return true;
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)(\?|#|$)/i.test(a.file_url);
}

function isVideoAttachment(a: ParsedTrackAttachment): boolean {
  const ft = (a.file_type ?? "").toLowerCase();
  if (ft.startsWith("video/")) return true;
  return /\.(mp4|webm|ogg|ogv|mov|m4v|mkv)(\?|#|$)/i.test(a.file_url);
}

function TrackAttachmentsGallery({ items }: { items: ParsedTrackAttachment[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {items.map((a, i) => {
        const label = a.name?.trim() || "附件";
        if (isImageAttachment(a)) {
          return (
            <a
              key={`${a.file_url}-${i}`}
              href={a.file_url}
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-sm ring-1 ring-slate-900/5 transition hover:ring-indigo-300 hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.file_url}
                alt={label}
                className="max-h-56 max-w-[min(100%,20rem)] w-auto object-contain"
                loading="lazy"
              />
              <span className="absolute bottom-0 left-0 right-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 py-2 pt-6 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                {label} · 点击查看原图
              </span>
            </a>
          );
        }
        if (isVideoAttachment(a)) {
          return (
            <div
              key={`${a.file_url}-${i}`}
              className="overflow-hidden rounded-xl border border-slate-200/80 bg-black shadow-sm ring-1 ring-slate-900/5"
            >
              <video
                src={a.file_url}
                controls
                preload="metadata"
                className="max-h-64 max-w-[min(100%,28rem)] w-full"
              >
                {label}
              </video>
              <div className="border-t border-white/10 bg-slate-950 px-2 py-1.5">
                <a
                  href={a.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-medium text-indigo-300 hover:text-indigo-200 hover:underline"
                >
                  新窗口打开视频
                </a>
              </div>
            </div>
          );
        }
        return (
          <a
            key={`${a.file_url}-${i}`}
            href={a.file_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50"
          >
            <span className="truncate">{label}</span>
            <span className="shrink-0 text-slate-400">↗</span>
          </a>
        );
      })}
    </div>
  );
}

function PendingAttachmentsPreview({ files }: { files: TrackAttachment[] }) {
  if (files.length === 0) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {files.map((f, i) => {
        const isImg = f.file_type.startsWith("image/");
        const isVid = f.file_type.startsWith("video/");
        return (
          <li
            key={`${f.file_url}-${i}`}
            className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-600"
          >
            {isImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={f.file_url}
                alt={f.name}
                className="h-20 w-28 object-cover"
                loading="lazy"
              />
            ) : isVid ? (
              <video src={f.file_url} className="h-20 w-36 object-cover" muted preload="metadata" />
            ) : (
              <div className="flex h-16 w-28 items-center justify-center bg-slate-200 text-[10px] text-slate-500">
                文件
              </div>
            )}
            <div className="max-w-[10rem] truncate px-2 py-1 font-medium">{f.name}</div>
          </li>
        );
      })}
    </ul>
  );
}

function statusLabel(s: string) {
  const m: Record<string, string> = {
    new: "新建",
    lost: "失败",
    converted: "已转客户",
  };
  return m[s] ?? s;
}

export function LeadDetailClient({ scope }: { scope: LeadDetailScope }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const leadId = Number(params.id);
  const companyIdQs = searchParams.get("companyId");
  const leadsListHref =
    scope === "admin"
      ? companyIdQs != null && !Number.isNaN(Number(companyIdQs))
        ? `/dashboard/admin/leads?companyId=${Number(companyIdQs)}`
        : "/dashboard/admin/leads"
      : "/dashboard/company/leads";

  const { token, company, user, company_users } = useAuth();

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [profileForm, setProfileForm] = useState<LeadProfileForm | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [statusValue, setStatusValue] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const [trackContent, setTrackContent] = useState("");
  const [trackFiles, setTrackFiles] = useState<TrackAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [storefrontUploading, setStorefrontUploading] = useState(false);

  const isPlatformAdmin = user?.role === "admin";
  const myCompanyUserId = company
    ? company_users.find((cu) => Number(cu.company.id) === Number(company.id))?.id
    : undefined;

  const canManage =
    !!lead &&
    (isPlatformAdmin ||
      (myCompanyUserId != null &&
        lead.created_by_company_users === myCompanyUserId));

  const canEditProfile = !!canManage && lead!.status !== "converted";
  const canAddTrack = !!canManage && lead!.status !== "converted";

  const patchField = (key: keyof LeadProfileForm, value: string) => {
    setProfileForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const onProfileSave = async () => {
    if (!token || !profileForm) return;
    const name = profileForm.name.trim();
    const phone = profileForm.phone.trim();
    if (!name || !phone) {
      setActionMsg("请填写公司名称与手机号");
      return;
    }
    setProfileSaving(true);
    setActionMsg("");
    try {
      await patchLead({
        name,
        phone,
        moreInfo: buildMoreInfoUpdatePayload(profileForm),
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const loadLead = useCallback(async () => {
    if (!token || !Number.isInteger(leadId) || !(leadId >= 1)) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/company/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "加载失败");
        setLead(null);
        return;
      }
      setLead(data as LeadDetail);
      setProfileForm(parseLeadProfileForm(data as LeadDetail));
      const st = data.status ?? "new";
      setStatusValue(st === "lost" ? "lost" : "new");
    } finally {
      setLoading(false);
    }
  }, [token, leadId]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const patchLead = async (body: Record<string, unknown>) => {
    if (!token) return;
    setActionMsg("");
    const res = await fetch(`/api/admin/company/leads/${leadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setActionMsg(data.error ?? "操作失败");
      return;
    }
    setActionMsg("已保存");
    loadLead();
  };

  const onStatusSave = () => {
    if (!statusValue || statusValue === lead?.status) return;
    patchLead({ status: statusValue });
  };

  const convertLead = async () => {
    if (!token || !confirm("确认将线索转为公司客户？将按线索手机号创建或关联用户，并写入 company_users。"))
      return;
    setActionMsg("");
    const res = await fetch(`/api/admin/company/leads/${leadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "convert" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setActionMsg(data.error ?? "转化失败");
      return;
    }
    setActionMsg("已转客户");
    loadLead();
  };

  const uploadFile = async (file: File) => {
    if (!token) return;
    setUploading(true);
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
      const url = data.url as string;
      setTrackFiles((prev) => [
        ...prev,
        {
          file_type: file.type.startsWith("video") ? "video" : "image",
          file_url: url,
          name: file.name,
        },
      ]);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const uploadStorefrontImage = async (file: File) => {
    if (!token || !profileForm) return;
    setStorefrontUploading(true);
    setActionMsg("");
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
      setActionMsg("门头图片已上传，请点击「保存线索资料」");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "上传失败");
    } finally {
      setStorefrontUploading(false);
    }
  };

  const submitTrack = async () => {
    if (!token) return;
    const content = trackContent.trim();
    if (!content) {
      setActionMsg("请填写跟进内容");
      return;
    }
    setActionMsg("");
    const res = await fetch(`/api/admin/company/leads/${leadId}/tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, attachments: trackFiles }),
    });
    const data = await res.json();
    if (!res.ok) {
      setActionMsg(data.error ?? "提交失败");
      return;
    }
    setTrackContent("");
    setTrackFiles([]);
    loadLead();
  };

  if (!Number.isInteger(leadId) || !(leadId >= 1)) {
    return <p className="text-red-600">无效的线索</p>;
  }

  if (loading && !lead) {
    return <p className="text-base font-medium text-slate-700">加载中…</p>;
  }

  if (err || !lead) {
    return (
      <div className="space-y-2">
        <p className="text-red-600">{err || "未找到线索"}</p>
        <Link
          href={leadsListHref}
          className="text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline"
        >
          返回列表
        </Link>
      </div>
    );
  }

  const companyOk =
    scope === "admin"
      ? user?.role === "admin"
      : company != null && Number(company.id) === Number(lead.company_companies);

  if (!companyOk) {
    return (
      <div className="space-y-3">
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          {scope === "company"
            ? "当前线索不属于您在顶部选中的公司。请切换公司后再查看，或使用「管理员 → 线索管理」跨公司查看。"
            : "仅平台管理员可访问本页。"}
        </p>
        <Link
          href={leadsListHref}
          className="text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline"
        >
          返回列表
        </Link>
      </div>
    );
  }

  const adminLeadContextHint =
    scope === "admin" && lead.company?.name ? (
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-950 shadow-sm">
        <span className="font-semibold">线索归属公司：</span>
        {lead.company.name}
      </div>
    ) : null;

  const statusBadgeClass =
    lead.status === "lost"
      ? "bg-rose-100 text-rose-800 ring-rose-600/20"
      : lead.status === "converted"
        ? "bg-violet-100 text-violet-800 ring-violet-600/20"
        : "bg-slate-100 text-slate-800 ring-slate-600/15";

  const leadLocation = parseLeadLocationFromMoreInfo(lead.more_info);
  const leadLocationText = formatLeadLocationText(leadLocation);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <Link
          href={leadsListHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-800"
        >
          <span aria-hidden>←</span>
          线索列表
        </Link>
      </div>

      {adminLeadContextHint}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-900/5 ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">线索详情</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {lead.name}
                <span className="ml-2 text-base font-semibold text-slate-500">#{lead.id}</span>
              </h1>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusBadgeClass}`}
            >
              {statusLabel(lead.status)}
            </span>
          </div>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm">
              <dt className="text-xs font-semibold text-slate-500">手机</dt>
              <dd className="mt-0.5 font-mono text-base font-semibold text-slate-900">{lead.phone}</dd>
            </div>
            {lead.converted_at && (
              <div className="rounded-xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500">转化时间</dt>
                <dd className="mt-0.5 font-medium text-slate-900">
                  {lead.converted_at.slice(0, 19).replace("T", " ")}
                </dd>
              </div>
            )}
            {lead.companyUserByCreatedByCompanyUsers?.user && (
              <div className="rounded-xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500">录入人</dt>
                <dd className="mt-0.5 font-medium text-slate-900">
                  {lead.companyUserByCreatedByCompanyUsers.user.nickname ||
                    lead.companyUserByCreatedByCompanyUsers.user.mobile ||
                    "—"}
                </dd>
              </div>
            )}
            {leadLocationText && (
              <div className="rounded-xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm sm:col-span-2">
                <dt className="text-xs font-semibold text-slate-500">IP 定位</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{leadLocationText}</dd>
                {leadLocation && (
                  <dd className="mt-1 font-mono text-xs text-slate-500">
                    {leadLocation.latitude.toFixed(5)}, {leadLocation.longitude.toFixed(5)}
                  </dd>
                )}
              </div>
            )}
          </dl>
        </div>

        <div className="space-y-4 px-6 py-5 sm:px-8">

        {actionMsg && (
          <p
            className={`text-sm ${actionMsg.includes("失败") || actionMsg.includes("无效") || actionMsg.includes("请填写") ? "text-red-600" : "text-green-700"}`}
          >
            {actionMsg}
          </p>
        )}

        {canEditProfile && profileForm && (
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">编辑线索资料</h2>
              <p className="mt-1 text-sm text-slate-600">与跑盘模板字段一致，保存后同步至导出表格。</p>
            </div>
            <LeadProfileFormFields
              form={profileForm}
              onChange={patchField}
              onStorefrontUpload={uploadStorefrontImage}
              storefrontUploading={storefrontUploading}
            />
            <button
              type="button"
              disabled={profileSaving}
              onClick={() => void onProfileSave()}
              className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {profileSaving ? "保存中…" : "保存线索资料"}
            </button>
          </div>
        )}

        {canManage && lead.status !== "converted" && (
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-900">状态</label>
                <select
                  className="rounded border border-slate-400 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                >
                  <option value="new">新建</option>
                  <option value="lost">失败</option>
                </select>
              </div>
              <button
                type="button"
                onClick={onStatusSave}
                className="rounded border border-slate-400 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                更新状态
              </button>
              <button
                type="button"
                onClick={convertLead}
                className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                转为客户
              </button>
            </div>
          </div>
        )}
        </div>
      </div>

      {canAddTrack && (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md shadow-slate-900/5 ring-1 ring-slate-900/5 sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            ✎
          </span>
          写跟进
        </h2>
        <p className="mt-1 text-sm text-slate-600">记录沟通内容；图片与视频会展示在下方时间线中。</p>
        <textarea
          className="mt-4 min-h-[120px] w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner placeholder:text-slate-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          placeholder="填写本次跟进内容…"
          value={trackContent}
          onChange={(e) => setTrackContent(e.target.value)}
        />
        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-slate-800">附件（可选）</label>
          <input
            type="file"
            accept="image/*,video/*"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f);
              e.target.value = "";
            }}
            className="block w-full text-sm font-medium text-slate-800 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
          />
          <PendingAttachmentsPreview files={trackFiles} />
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={submitTrack}
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {uploading ? "上传中…" : "提交跟进"}
        </button>
      </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md shadow-slate-900/5 ring-1 ring-slate-900/5 sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
            ◷
          </span>
          跟进记录
        </h2>
        {(lead.company_lead_tracks?.length ?? 0) === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm font-medium text-slate-600">
            暂无记录，提交第一条跟进吧
          </p>
        ) : (
          <ul className="relative mt-6 space-y-0 pl-2 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-8px)] before:w-px before:bg-gradient-to-b before:from-indigo-200 before:via-slate-200 before:to-transparent sm:pl-3">
            {lead.company_lead_tracks!.map((t) => {
              const atts = parseTrackAttachments(t.attachments);
              return (
                <li key={t.id} className="relative pb-8 pl-10 last:pb-0">
                  <span className="absolute left-[10px] top-1.5 flex h-3 w-3 rounded-full border-2 border-white bg-indigo-500 shadow ring-2 ring-indigo-100" />
                  <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/80 p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-5">
                    <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-900">
                      {t.content}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100/80 pt-3 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">
                        {t.company_user?.user?.nickname || t.company_user?.user?.mobile || "成员"}
                      </span>
                      <span className="text-slate-400">·</span>
                      <time className="font-mono tabular-nums text-slate-500">
                        {t.created_at?.slice(0, 19).replace("T", " ")}
                      </time>
                    </div>
                    <TrackAttachmentsGallery items={atts} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
