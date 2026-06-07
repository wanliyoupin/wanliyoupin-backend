"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import { ImageUpload } from "@/app/components/ImageUpload";
import { BannerMediaUpload } from "@/app/components/BannerMediaUpload";
import { FileUpload } from "@/app/components/FileUpload";
import { useToast } from "@/app/components/Toast";
import { isBannerVideo, normalizeBannerItem, type BannerMediaItem } from "@/app/lib/bannerMedia";

type BannerItem = BannerMediaItem;

export default function CompanySettingsPage() {
  const searchParams = useSearchParams();
  const { token, company, user, isAdminForSelectedCompany } = useAuth();
  const toast = useToast();
  const companyIdFromUrl = searchParams.get("companyId");
  const auditFromUrl = searchParams.get("audit") === "1";
  const effectiveCompanyId =
    user?.role === "admin" && companyIdFromUrl && !Number.isNaN(Number(companyIdFromUrl))
      ? Number(companyIdFromUrl)
      : company?.id;
  const isAuditMode = user?.role === "admin" && auditFromUrl && !!companyIdFromUrl;
  const [name, setName] = useState("");
  const [logo_url, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [contact_code, setContactCode] = useState("");
  const [wechat_code, setWechatCode] = useState("");
  const [wx_scan_code, setWxScanCode] = useState("");
  const [wxacodeGenerating, setWxacodeGenerating] = useState(false);
  const [resource_file_url, setResourceFileUrl] = useState("");
  const [default_for_can_view_price, setDefaultForCanViewPrice] = useState(false);
  const [default_for_price_factor, setDefaultForPriceFactor] = useState("1");
  const [mode_for_price, setModeForPrice] = useState<"company" | "user">("user");
  const [topBanners, setTopBanners] = useState<BannerItem[]>([]);
  const [bottomBanners, setBottomBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [bannerModal, setBannerModal] = useState<"top" | "bottom" | null>(null);
  const [bannerIndex, setBannerIndex] = useState(-1);
  const [editingBanner, setEditingBanner] = useState<{ file_url: string; file_type: "image" | "video"; title: string; link: string }>({
    file_url: "",
    file_type: "image",
    title: "",
    link: "",
  });

  useEffect(() => {
    if (!effectiveCompanyId || !token) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/company/${effectiveCompanyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setName(data.name ?? "");
        setLogoUrl(data.logo_url ?? "");
        setDescription(data.description ?? "");
        setContactCode(data.contact_code ?? "");
        setWechatCode(data.wechat_code ?? "");
        setWxScanCode(data.wx_scan_code ?? "");
        setResourceFileUrl(data.resource_file_url ?? "");
        setDefaultForCanViewPrice(data.default_for_can_view_price ?? false);
        setDefaultForPriceFactor(
          data.default_for_price_factor != null ? String(data.default_for_price_factor) : "1"
        );
        const m = data.mode_for_price;
        setModeForPrice(m === "company" ? "company" : "user");
        const map = (b: unknown, i: number) => normalizeBannerItem(b, i);
        setTopBanners(Array.isArray(data.banner_top) ? data.banner_top.map(map) : []);
        setBottomBanners(Array.isArray(data.banner_bottom) ? data.banner_bottom.map(map) : []);
      } finally {
        setFetching(false);
      }
    })();
  }, [effectiveCompanyId, token]);

  const saveBanner = () => {
    if (!editingBanner.file_url) {
      alert("请先上传图片或视频");
      return;
    }
    const item: BannerItem = {
      file_type: editingBanner.file_type,
      file_url: editingBanner.file_url,
      title: editingBanner.title || undefined,
      link: editingBanner.link || undefined,
      sort: bannerIndex < 0 ? (bannerModal === "top" ? topBanners.length : bottomBanners.length) : bannerIndex,
    };
    if (bannerModal === "top") {
      if (bannerIndex < 0) setTopBanners((prev) => [...prev, item]);
      else setTopBanners((prev) => prev.map((b, i) => (i === bannerIndex ? item : b)));
    } else {
      if (bannerIndex < 0) setBottomBanners((prev) => [...prev, item]);
      else setBottomBanners((prev) => prev.map((b, i) => (i === bannerIndex ? item : b)));
    }
    setBannerModal(null);
    setEditingBanner({ file_url: "", file_type: "image", title: "", link: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("请填写公司名称");
      return;
    }
    const factor = Number(default_for_price_factor);
    if (Number.isNaN(factor) || factor <= 0) {
      setError("默认价格系数需大于 0");
      return;
    }
    if (!effectiveCompanyId || !token) {
      setError("无权限或未选择公司");
      return;
    }
    const canEdit = !isAuditMode && (user?.role === "admin" || (effectiveCompanyId === company?.id && isAdminForSelectedCompany));
    if (!canEdit) {
      setError(isAuditMode ? "核查模式仅可查看" : "无权限");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/company/${effectiveCompanyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          logo_url: logo_url || null,
          banner_top: topBanners,
          banner_bottom: bottomBanners,
          description: description.trim() || null,
          contact_code: contact_code || null,
          wechat_code: wechat_code || null,
          resource_file_url: resource_file_url.trim() || null,
          default_for_can_view_price: default_for_can_view_price,
          default_for_price_factor: factor,
          mode_for_price,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "保存失败");
        return;
      }
      alert("保存成功");
    } catch {
      setError("网络异常");
    } finally {
      setLoading(false);
    }
  };

  if (!effectiveCompanyId) {
    return (
      <div>
        <p className="text-slate-600">请先选择公司。</p>
        <Link href="/dashboard/company/settings" className="text-indigo-600 mt-2 inline-block">
          返回
        </Link>
      </div>
    );
  }

  if (fetching) return <p className="text-slate-500">加载中…</p>;

  return (
    <div>
      {isAuditMode && (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-amber-800 text-sm">
          核查模式：仅查看，不可操作
        </div>
      )}
      <h1 className="text-xl font-semibold text-slate-800 mb-4">公司设置</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司名称 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="请输入公司名称"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司 Logo</label>
          <ImageUpload value={logo_url} onChange={setLogoUrl} square placeholder="点击上传 Logo" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">顶部轮播图</label>
          <div className="flex flex-wrap gap-2">
            {topBanners.map((b, i) => (
              <div key={i} className="relative group">
                {isBannerVideo(b) ? (
                  <video src={b.file_url} className="w-24 h-24 object-cover rounded border bg-black" muted preload="metadata" />
                ) : (
                  <img src={typeof b === "string" ? b : b.file_url} alt="" className="w-24 h-24 object-cover rounded border" />
                )}
                {isBannerVideo(b) && (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5 rounded-b">视频</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 bg-black/50 rounded">
                  <button
                    type="button"
                    onClick={() => {
                      setBannerModal("top");
                      setBannerIndex(i);
                      const x = topBanners[i];
                      setEditingBanner({
                        file_url: typeof x === "string" ? x : x.file_url,
                        file_type: typeof x === "string" ? "image" : (x.file_type === "video" || isBannerVideo(x) ? "video" : "image"),
                        title: typeof x === "string" ? "" : (x.title ?? ""),
                        link: typeof x === "string" ? "" : (x.link ?? ""),
                      });
                    }}
                    className="text-white text-xs px-2 py-1 bg-slate-600 rounded"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopBanners((prev) => prev.filter((_, j) => j !== i))}
                    className="text-white text-xs px-2 py-1 bg-red-600 rounded"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setBannerModal("top");
                setBannerIndex(-1);
                setEditingBanner({ file_url: "", file_type: "image", title: "", link: "" });
              }}
              className="w-24 h-24 bg-white border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center text-slate-600 text-sm hover:border-indigo-400 hover:bg-slate-50 transition-colors"
            >
              + 添加
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">底部轮播图</label>
          <div className="flex flex-wrap gap-2">
            {bottomBanners.map((b, i) => (
              <div key={i} className="relative group">
                {isBannerVideo(b) ? (
                  <video src={b.file_url} className="w-24 h-24 object-cover rounded border bg-black" muted preload="metadata" />
                ) : (
                  <img src={typeof b === "string" ? b : b.file_url} alt="" className="w-24 h-24 object-cover rounded border" />
                )}
                {isBannerVideo(b) && (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5 rounded-b">视频</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 bg-black/50 rounded">
                  <button
                    type="button"
                    onClick={() => {
                      setBannerModal("bottom");
                      setBannerIndex(i);
                      const x = bottomBanners[i];
                      setEditingBanner({
                        file_url: typeof x === "string" ? x : x.file_url,
                        file_type: typeof x === "string" ? "image" : (x.file_type === "video" || isBannerVideo(x) ? "video" : "image"),
                        title: typeof x === "string" ? "" : (x.title ?? ""),
                        link: typeof x === "string" ? "" : (x.link ?? ""),
                      });
                    }}
                    className="text-white text-xs px-2 py-1 bg-slate-600 rounded"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => setBottomBanners((prev) => prev.filter((_, j) => j !== i))}
                    className="text-white text-xs px-2 py-1 bg-red-600 rounded"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setBannerModal("bottom");
                setBannerIndex(-1);
                setEditingBanner({ file_url: "", file_type: "image", title: "", link: "" });
              }}
              className="w-24 h-24 bg-white border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center text-slate-600 text-sm hover:border-indigo-400 hover:bg-slate-50 transition-colors"
            >
              + 添加
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司介绍</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            maxLength={500}
            placeholder="用于关于我们、联系我们展示"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">联系我们二维码</label>
          <ImageUpload value={contact_code} onChange={setContactCode} square placeholder="点击上传" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">微信二维码</label>
          <ImageUpload value={wechat_code} onChange={setWechatCode} square placeholder="点击上传（订单详情等展示）" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司小程序码</label>
          <p className="text-xs text-slate-500 mb-1">扫码进入该公司首页，需小程序已发布</p>
          <div className="flex items-center gap-3">
            {wx_scan_code && (
              <img src={wx_scan_code} alt="公司小程序码" className="w-32 h-32 object-contain border rounded" />
            )}
            <button
              type="button"
              disabled={wxacodeGenerating || isAuditMode}
              onClick={async () => {
                if (!effectiveCompanyId || !token) return;
                setWxacodeGenerating(true);
                try {
                  const res = await fetch("/api/weixin/wxacode/generate", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ type: "company", companyId: effectiveCompanyId }),
                  });
                  const data = await res.json();
                  if (res.ok && data?.url) {
                    setWxScanCode(data.url);
                    window.open(data.url, "_blank");
                    toast.success("小程序码已生成并保存");
                  } else {
                    toast.error(data?.error || "生成失败");
                  }
                } catch {
                  toast.error("生成失败");
                } finally {
                  setWxacodeGenerating(false);
                }
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              {wxacodeGenerating ? "生成中…" : "生成小程序码"}
            </button>
          </div>
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
            className="mt-2 w-full bg-white border border-slate-400 rounded-lg px-3 py-2 text-slate-800 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="或输入文件链接（可选）"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">价格模式</label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setModeForPrice("company")}
              disabled={isAuditMode}
              className={`flex-1 min-w-[140px] rounded-lg border px-3 py-2 text-left text-sm transition ${
                mode_for_price === "company"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              } ${isAuditMode ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className="font-medium block">公司统一</span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                价格系数全员与访客统一用下方默认值；能否看价仅约束微信访客，正式成员均可看价
              </span>
            </button>
            <button
              type="button"
              onClick={() => setModeForPrice("user")}
              disabled={isAuditMode}
              className={`flex-1 min-w-[140px] rounded-lg border px-3 py-2 text-left text-sm transition ${
                mode_for_price === "user"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              } ${isAuditMode ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className="font-medium block">按用户单独</span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                在成员列表为每人设置系数与可否看价；未入库成员沿用下方默认
              </span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="default_for_can_view_price"
              checked={default_for_can_view_price}
              onChange={(e) => setDefaultForCanViewPrice(e.target.checked)}
              className="rounded border-slate-300"
            />
            <label htmlFor="default_for_can_view_price" className="text-sm text-slate-700">
              {mode_for_price === "company" ? "微信访客默认可查看价格" : "默认能否查看价格"}
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-6">
            {mode_for_price === "company"
              ? "「公司统一」：仅对微信访客（wx_guest_user）是否可看价生效；正式成员均可看价。"
              : "「按用户」：已在成员表中的用户以列表为准；尚无成员行的用户（含微信访客）使用下方默认可看价与系数。"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">默认价格系数</label>
          <input
            type="text"
            value={default_for_price_factor}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d.]/g, "");
              setDefaultForPriceFactor(v);
            }}
            className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="如 1 表示原价，0.9 表示 9 折"
          />
          <p className="text-xs text-slate-500 mt-1">
            {mode_for_price === "company"
              ? "「公司统一」：全员与微信访客展示价均乘以该系数；1 为原价，0.9 约九折。"
              : "「按用户」：新成员默认系数；已在列表中的成员请在成员里单独修改；1 为原价。"}
          </p>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || isAuditMode}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "保存中…" : isAuditMode ? "仅查看" : "保存"}
          </button>
        </div>
      </form>

      {/* 轮播图编辑弹窗 */}
      {bannerModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-10"
          onClick={() => setBannerModal(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-medium text-slate-800 mb-4">
              {bannerModal === "top" ? "编辑顶部轮播图" : "编辑底部轮播图"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">图片 / 视频</label>
                <BannerMediaUpload
                  value={editingBanner.file_url}
                  fileType={editingBanner.file_type}
                  onChange={(url, fileType) =>
                    setEditingBanner((p) => ({ ...p, file_url: url, file_type: fileType }))
                  }
                  placeholder="点击上传图片或视频"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">标题（可选）</label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-500"
                  placeholder="请输入标题"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">跳转链接（可选）</label>
                <input
                  type="text"
                  value={editingBanner.link}
                  onChange={(e) => setEditingBanner((p) => ({ ...p, link: e.target.value }))}
                  className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-500"
                  placeholder="请输入跳转链接"
                  maxLength={200}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={saveBanner}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"
              >
                确定
              </button>
              <button
                type="button"
                onClick={() => setBannerModal(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
