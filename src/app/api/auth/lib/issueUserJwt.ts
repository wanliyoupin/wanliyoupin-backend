import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";

/** 与手机号登录一致：非 admin 统一走 Hasura role `user`，便于沿用现有行级权限 */
export function issueUserJwt(user: { id: number | string; role: string }): string {
  const isAdmin = user.role === "admin";
  return HasuraJwtToken.generateToken({
    userId: String(user.id),
    allowedRoles: isAdmin ? ["user", "admin"] : ["user"],
    defaultRole: isAdmin ? "admin" : "user",
  });
}
