import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";
import crypto from "crypto";

/**
 * 设置/修改密码 API
 * POST /api/auth/set-password
 *
 * Header: Authorization: Bearer <token>
 * Body: { oldPassword?: string, newPassword: string }
 * - 若用户已有密码：需传 oldPassword 验证
 * - 若用户无密码（首次设置）：仅传 newPassword
 */
export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    let payload: { userId: string };
    try {
      payload = HasuraJwtToken.verifyToken(token);
    } catch {
      return NextResponse.json({ error: "登录已过期，请重新登录" }, { status: 401 });
    }

    const userId = Number(payload.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "无效用户" }, { status: 400 });
    }

    const body = await req.json();
    const { oldPassword, newPassword } = body ?? {};

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json({ error: "请输入新密码" }, { status: 400 });
    }

    const trimmed = newPassword.trim();
    if (trimmed.length < 6) {
      return NextResponse.json({ error: "密码至少 6 位" }, { status: 400 });
    }

    const client = getHasuraClient();

    const queryUser = `
      query GetUserPassword($userId: bigint!) {
        users_by_pk(id: $userId) {
          id
          password
        }
      }
    `;
    const userRes = await client.execute({
      query: queryUser,
      variables: { userId },
    });
    const user = (userRes as { users_by_pk?: { id: number; password: string | null } })?.users_by_pk;
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const hasExistingPassword = !!user.password && user.password.length > 0;

    if (hasExistingPassword) {
      if (!oldPassword || typeof oldPassword !== "string") {
        return NextResponse.json({ error: "请输入原密码" }, { status: 400 });
      }
      const oldHash = crypto.createHash("md5").update(oldPassword).digest("hex");
      if (user.password !== oldHash) {
        return NextResponse.json({ error: "原密码错误" }, { status: 401 });
      }
    }

    const newHash = crypto.createHash("md5").update(trimmed).digest("hex");

    const mutation = `
      mutation UpdateUserPassword($userId: bigint!, $password: String!) {
        update_users_by_pk(pk_columns: { id: $userId }, _set: { password: $password }) {
          id
        }
      }
    `;
    await client.execute({
      query: mutation,
      variables: { userId, password: newHash },
    });

    return NextResponse.json({ success: true, message: "密码设置成功" });
  } catch (e: unknown) {
    console.error("设置密码失败:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
