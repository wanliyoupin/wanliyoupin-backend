/**
 * 七牛云直传（与小程序一致）
 * 1. 从后端获取上传凭证
 * 2. 前端直接将文件上传到七牛云，不经过后端
 */

type TokenData = {
  token: string;
  bucket: string;
  baseUrl?: string;
  dirPath?: string;
  uploadUrl: string;
};

/** 获取七牛云上传凭证 */
export async function getUploadToken(): Promise<TokenData> {
  const res = await fetch("/api/qiniu-upload/token");
  const data = await res.json();
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "获取上传凭证失败");
  }
  if (!data.data?.token) {
    throw new Error("上传凭证无效");
  }
  return data.data;
}

/** 生成文件 key（与小程序格式一致） */
function generateKey(file: File, dirPath?: string): string {
  const ext = file.name?.includes(".") ? "." + file.name.split(".").pop()?.toLowerCase() : ".jpg";
  let path = (dirPath || "").trim();
  if (path && !path.endsWith("/")) path += "/";
  if (path.startsWith("/")) path = path.slice(1);
  return `${path}${Date.now()}_${Math.random().toString(36).slice(2, 11)}${ext}`;
}

/**
 * 直传文件到七牛云（带进度）
 * @param file 文件
 * @param onProgress 进度回调 0-100
 * @returns 上传成功后的访问 URL
 */
export async function uploadToQiniu(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const tokenData = await getUploadToken();
  const key = generateKey(file, tokenData.dirPath);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", tokenData.token);
    formData.append("key", key);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(Math.min(100, percent));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status !== 200) {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error || err.message || `上传失败: ${xhr.status}`));
        } catch {
          reject(new Error(`上传失败: ${xhr.status}`));
        }
        return;
      }
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.key) {
          const base = (tokenData.baseUrl || "").replace(/\/$/, "");
          const url = base ? `${base}/${res.key}` : res.key;
          resolve(url);
        } else if (res.error) {
          reject(new Error(res.error));
        } else {
          reject(new Error("上传响应异常"));
        }
      } catch {
        reject(new Error("解析上传响应失败"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("网络错误")));
    xhr.addEventListener("abort", () => reject(new Error("上传已取消")));

    xhr.open("POST", tokenData.uploadUrl);
    xhr.send(formData);
  });
}

/**
 * 上传文件，七牛直传失败时回退到管理端上传接口
 * @param file 文件
 * @param onProgress 进度回调 0-100（回退时可能不精确）
 * @param authToken 管理端 token，用于回退上传
 */
export async function uploadWithFallback(
  file: File,
  onProgress?: (percent: number) => void,
  authToken?: string | null
): Promise<string> {
  try {
    return await uploadToQiniu(file, onProgress);
  } catch (err) {
    if (!authToken) throw err;
    onProgress?.(50);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "上传失败");
    if (!data?.url) throw new Error("上传成功但未返回 URL");
    onProgress?.(100);
    return data.url;
  }
}
