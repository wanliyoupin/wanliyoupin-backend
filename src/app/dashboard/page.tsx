import { redirect } from "next/navigation";

/** 进入后台默认进入个人中心，避免停留在无权限的公司管理路径 */
export default function DashboardHome() {
  redirect("/dashboard/profile");
}
