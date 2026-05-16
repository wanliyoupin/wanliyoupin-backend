"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import { ImageUpload } from "@/app/components/ImageUpload";
import { FileUpload } from "@/app/components/FileUpload";

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const companyId = id ? parseInt(id, 10) : NaN;
  const { token, user } = useAuth();

  const [name, setName] = useState("");
  const [logo_url, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [contact_code, setContactCode] = useState("");
  const [wechat_code, setWechatCode] = useState("");
  const [resource_file_url, setResourceFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || Number.isNaN(companyId) || companyId < 1) {
      setFetching(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/admin/company/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setFetching(false);
          return;
        }
        const data = await res.json();
        setName(data.name ?? "");
        setLogoUrl(data.logo_url ?? "");
        setDescription(data.description ?? "");
        setContactCode(data.contact_code ?? "");
        setWechatCode(data.wechat_code ?? "");
        setResourceFileUrl(data.resource_file_url ?? "");
      } finally {
        setFetching(false);
      }
    })();
  }, [token, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("请填写公司名称");
      return;
    }
    if (Number.isNaN(companyId) || companyId < 1 || !token) {
      setError("无效公司或未登录");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/company/${companyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          logo_url: logo_url || null,
          description: description.trim() || null,
          contact_code: contact_code || null,
          wechat_code: wechat_code || null,
          resource_file_url: resource_file_url.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "保存失败");
        return;
      }
      router.push("/dashboard/companies");
    } catch {
      setError("网络异常");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div>
        <p className="text-slate-600">仅平台管理员可编辑公司。</p>
        <Link href="/dashboard/companies" className="text-indigo-600 mt-2 inline-block">返回公司列表</Link>
      </div>
    );
  }

  if (fetching) return <p className="text-slate-500">加载中…</p>;
  if (Number.isNaN(companyId) || companyId < 1) {
    return (
      <div>
        <p className="text-slate-600">无效的公司 ID。</p>
        <Link href="/dashboard/companies" className="text-indigo-600 mt-2 inline-block">返回公司列表</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/dashboard/companies" className="text-slate-500 hover:text-slate-700 text-sm">← 公司列表</Link>
        <h1 className="text-xl font-semibold text-slate-800">编辑公司</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司名称 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="请输入公司名称"
            maxLength={50}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司 Logo</label>
          <ImageUpload value={logo_url} onChange={setLogoUrl} square placeholder="点击上传 Logo" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司介绍</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="用于关于我们、联系我们展示"
            rows={3}
            maxLength={500}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">联系我们二维码</label>
          <ImageUpload value={contact_code} onChange={setContactCode} square placeholder="点击上传" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">微信二维码</label>
          <ImageUpload value={wechat_code} onChange={setWechatCode} square placeholder="点击上传" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">资源库文件</label>
          <FileUpload
            value={resource_file_url}
            onChange={setResourceFileUrl}
            placeholder="点击上传资料文件（PDF、Word 等）"
          />
          <input
            type="url"
            value={resource_file_url}
            onChange={(e) => setResourceFileUrl(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="或输入文件链接（可选）"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "保存中…" : "保存"}
          </button>
          <Link
            href="/dashboard/companies"
            className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
