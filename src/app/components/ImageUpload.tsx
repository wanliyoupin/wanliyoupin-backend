"use client";

import { useRef, useState } from "react";
import { uploadToQiniu } from "@/app/lib/qiniu-direct-upload";
import { UploadProgressOverlay } from "@/app/components/UploadProgressOverlay";

type Props = {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  /** 方形缩略图（如 logo）时 true */
  square?: boolean;
};

export function ImageUpload({ value, onChange, placeholder = "点击上传图片", className = "", square }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadToQiniu(file, (p) => setProgress(p));
      onChange(url);
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
        className={`bg-white border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center hover:border-indigo-400 hover:bg-slate-50 cursor-pointer overflow-hidden transition-colors ${square ? "w-32 h-32" : "w-full min-h-[120px]"}`}
      >
        {uploading ? (
          <span className="text-sm text-slate-600">上传中…</span>
        ) : value ? (
          <img src={value} alt="" className={square ? "w-full h-full object-cover" : "max-h-40 object-contain"} />
        ) : (
          <span className="text-sm text-slate-600">{placeholder}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
