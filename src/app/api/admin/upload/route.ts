import { NextRequest, NextResponse } from "next/server";
import { QiniuUploader } from "@/config-lib/qiniu/QiniuUploader";
import { qiniuConfig } from "@/config-lib/qiniu/config";
import { getAuthFromRequest } from "../lib/auth";

const uploader = new QiniuUploader(qiniuConfig);

/**
 * POST /api/admin/upload
 * 管理端图片/文件上传（需登录）。Body: multipart/form-data, field name: file
 * 返回 { url: string }
 */
export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 });
    }
    const result = await uploader.uploadFile(file);
    const url = result.url ?? (result.path ? `${qiniuConfig.baseUrl || ""}${result.path}` : "");
    if (!url) {
      return NextResponse.json({ error: "上传成功但无法生成访问地址" }, { status: 500 });
    }
    return NextResponse.json({ url });
  } catch (e: unknown) {
    console.error("admin upload", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "上传失败" },
      { status: 500 }
    );
  }
}
