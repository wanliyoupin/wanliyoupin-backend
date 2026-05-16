"use client";

import { useRef, useState } from "react";
import { uploadToQiniu } from "@/app/lib/qiniu-direct-upload";
import { UploadProgressOverlay } from "@/app/components/UploadProgressOverlay";

const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";

type Props = {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
};

/** 从 URL 提取文件名 */
function getFileNameFromUrl(url: string): string {
  if (!url) return "";
  try {
    const path = url.split("?")[0];
    const name = path.split("/").pop() || "";
    return decodeURIComponent(name) || "已上传文件";
  } catch {
    return "已上传文件";
  }
}

export function FileUpload({
  value,
  onChange,
  placeholder = "点击上传资料文件（PDF、Word 等）",
  className = "",
}: Props) {
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

  const fileName = getFileNameFromUrl(value);

  return (
    <div className={className}>
      <UploadProgressOverlay show={uploading} progress={progress} />
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="bg-white border-2 border-dashed border-slate-400 rounded-lg flex items-center gap-2 px-4 py-3 hover:border-indigo-400 hover:bg-slate-50 cursor-pointer transition-colors min-h-[48px]"
      >
        {uploading ? (
          <span className="text-sm text-slate-600">上传中…</span>
        ) : value ? (
          <>
            <span className="text-slate-600">📄</span>
            <span className="flex-1 text-sm text-slate-800 truncate">{fileName}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="text-xs text-red-600 hover:underline shrink-0"
            >
              删除
            </button>
          </>
        ) : (
          <span className="text-sm text-slate-600">{placeholder}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
