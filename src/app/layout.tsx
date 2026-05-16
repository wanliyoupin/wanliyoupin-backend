import "./globals.css";
import { AuthProvider } from "./lib/auth-context";

export const metadata = {
  title: "管理后台",
  description: "Web 管理后台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
