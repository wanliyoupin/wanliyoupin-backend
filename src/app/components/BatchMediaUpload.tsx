"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/app/lib/auth-context";
import { uploadWithFallback } from "@/app/lib/qiniu-direct-upload";

export type MediaItem = {
  file_type: "image" | "video";
  file_url: string;
};

type UploadingItem = {
  id: string;
  file_type: "image" | "video";
  tempUrl: string;
  progress: number;
};

type Props = {
  value: MediaItem[];
  onChange: (list: MediaItem[]) => void;
  title?: string;
  maxCount?: number;
};

export function BatchMediaUpload({
  value,
  onChange,
  title = "媒体",
  maxCount = 9,
}: Props) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingItems, setUploadingItems] = useState<UploadingItem[]>([]);
  const valueRef = useRef<MediaItem[]>(value);

  const safeValue = Array.isArray(value) ? value : [];
  valueRef.current = safeValue;

  const totalCount = safeValue.length + uploadingItems.length;
  const remaining = Math.max(0, maxCount - totalCount);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    // 必须先复制到数组再清空 input，否则清空后 FileList 会变为空
    const fileArray = Array.from(input.files || []);
    input.value = "";

    if (!fileArray.length) return;

    const toAdd = Math.min(fileArray.length, remaining);
    for (let i = 0; i < toAdd; i++) {
      const file = fileArray[i];
      const isVideo = file.type.startsWith("video/");
      addAndUpload(isVideo ? "video" : "image", file);
    }
  };

  const addAndUpload = (fileType: "image" | "video", file: File) => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const tempUrl = URL.createObjectURL(file);

    const item: UploadingItem = { id, file_type: fileType, tempUrl, progress: 0 };
    setUploadingItems((prev) => [...prev, item]);

    uploadWithFallback(
      file,
      (p) => {
        setUploadingItems((prev) =>
          prev.map((x) => (x.id === id ? { ...x, progress: p } : x))
        );
      },
      token
    )
      .then((url) => {
        const newItem: MediaItem = { file_type: fileType, file_url: url };
        const next = [...valueRef.current, newItem];
        valueRef.current = next;
        onChange(next);
        setUploadingItems((prev) => prev.filter((x) => x.id !== id));
        URL.revokeObjectURL(tempUrl);
      })
      .catch((err) => {
        alert(err instanceof Error ? err.message : "上传失败");
        setUploadingItems((prev) => prev.filter((x) => x.id !== id));
        URL.revokeObjectURL(tempUrl);
      });
  };

  const remove = (index: number) => {
    const next = safeValue.filter((_, i) => i !== index);
    onChange(next);
  };

  const preview = (item: MediaItem) => {
    window.open(item.file_url, "_blank");
  };

  const hasContent = safeValue.length > 0 || uploadingItems.length > 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">{title}</span>
        {remaining > 0 ? (
          <>
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                inputRef.current?.click();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              className="inline-block px-3 py-1.5 text-sm rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              + 添加
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="sr-only"
              onChange={handleFileChange}
            />
          </>
        ) : (
          <span className="inline-block px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed">
            + 添加
          </span>
        )}
      </div>

      {!hasContent ? (
        <p className="text-sm text-slate-500 py-4 text-center">
          暂无媒体文件，点击「添加」上传
        </p>
      ) : (
        <div className="space-y-3">
          {safeValue.map((item, index) => (
            <div
              key={`done-${index}-${item.file_url}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
            >
              <button
                type="button"
                onClick={() => preview(item)}
                className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-slate-200"
              >
                {item.file_type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    视频
                  </div>
                ) : (
                  <img src={item.file_url} alt="" className="w-full h-full object-cover" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-slate-600">
                  {item.file_type === "video" ? "视频" : "图片"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-slate-500 hover:text-red-600"
              >
                删除
              </button>
            </div>
          ))}
          {uploadingItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-slate-200">
                {item.file_type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    视频
                  </div>
                ) : (
                  <img src={item.tempUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-slate-600">
                  {item.file_type === "video" ? "视频" : "图片"}
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{item.progress}%</span>
                </div>
              </div>
              <span className="text-sm text-slate-400">上传中</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
