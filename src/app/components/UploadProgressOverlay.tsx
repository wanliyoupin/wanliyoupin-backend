"use client";

type Props = {
  show: boolean;
  progress: number;
};

export function UploadProgressOverlay({ show, progress }: Props) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl px-8 py-6 min-w-[200px] shadow-xl">
        <p className="text-slate-800 text-sm mb-3 text-center">上传中 {progress}%</p>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
