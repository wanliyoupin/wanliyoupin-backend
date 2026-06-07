"use client";

import { useRef, useState } from "react";
import { uploadToQiniu } from "@/app/lib/qiniu-direct-upload";
import { UploadProgressOverlay } from "@/app/components/UploadProgressOverlay";
import { isBannerVideo } from "@/app/lib/bannerMedia";

type Props = {
  value: string;
  fileType?: string;
  onChange: (url: string, fileType: "image" | "video") => void;
  placeholder?: string;
  className?: string;
};

function detectFileType(file: File): "image" | "video" {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  if (/\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name)) return "video";
  return "image";
}

export function BannerMediaUpload({
  value,
  fileType,
  onChange,
  placeholder = "点击上传图片或视频",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const showVideo = value && (fileType === "video" || isBannerVideo({ file_url: value, file_type: fileType }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadToQiniu(file, (p) => setProgress(p));
      onChange(url, detectFileType(file));
    } catch (err) {
      alert(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={className}>
      <UploadProgressOverlay show={uploading} progress={progress} />
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="bg-white border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center hover:border-indigo-400 hover:bg-slate-50 cursor-pointer overflow-hidden transition-colors w-full min-h-[160px]"
      >
        {uploading ? (
          <span className="text-sm text-slate-600">上传中…</span>
        ) : value && showVideo ? (
          <video src={value} className="max-h-48 w-full object-contain bg-black" controls preload="metadata" />
        ) : value ? (
          <img src={value} alt="" className="max-h-48 object-contain" />
        ) : (
          <span className="text-sm text-slate-600 px-4 text-center">{placeholder}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
