import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";

/**
 * 更新平台用户角色（仅平台管理员）
 * PATCH /api/admin/users/[id]
 * Body: { role: "user" | "admin" }
 * 禁止：微信访客不可改角色；不可将任意用户设为 wx_guest_user（访客仅匿名登录创建）
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const payload = HasuraJwtToken.verifyToken(token);
    const claims = payload?.["https://hasura.io/jwt/claims"] as
      | { "x-hasura-default-role"?: string; "x-hasura-allowed-roles"?: string[] }
      | undefined;
    const defaultRole = claims?.["x-hasura-default-role"];
    const allowedRoles = claims?.["x-hasura-allowed-roles"] ?? [];
    if (defaultRole !== "admin" && !allowedRoles.includes("admin")) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { id } = await params;
    const userId = id ? parseInt(id, 10) : NaN;
    if (Number.isNaN(userId) || userId < 1) {
      return NextResponse.json({ error: "无效的用户 ID" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const role = body.role === "user" || body.role === "admin" ? body.role : undefined;
    if (!role) {
      return NextResponse.json(
        { error: "role 必须为 user 或 admin（微信访客不可通过后台修改）" },
        { status: 400 }
      );
    }

    const client = getHasuraClient();
    const currentRes = (await client.execute({
      query: `
        query AdminUserRole($userId: bigint!) {
          users_by_pk(id: $userId) { id role }
        }
      `,
      variables: { userId },
    })) as { users_by_pk?: { id: number; role?: string | null } | null };
    const current = currentRes?.users_by_pk;
    if (!current) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }
    if (current.role === "wx_guest_user") {
      return NextResponse.json({ error: "微信访客为匿名账号，不支持修改角色" }, { status: 403 });
    }

    const mutation = `
      mutation UpdateUserRole($userId: bigint!, $role: String!) {
        update_users_by_pk(pk_columns: { id: $userId }, _set: { role: $role }) {
          id role updated_at
        }
      }
    `;
    const res = await client.execute({
      query: mutation,
      variables: { userId, role },
    }) as { update_users_by_pk?: { id: number; role: string; updated_at: string } };
    const updated = res?.update_users_by_pk;
    if (!updated) {
      return NextResponse.json({ error: "用户不存在或更新失败" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("admin users PATCH", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
