import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import { HasuraJwtToken } from "@/config-lib/hasura/HasuraJwtToken";
import crypto from "crypto";

/**
 * 密码登录 API
 * POST /api/auth/password-login
 * 
 * Body: { mobile: string, password: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { mobile, password } = await req.json();

    if (!mobile || !password) {
      return NextResponse.json(
        { error: "手机号和密码不能为空" },
        { status: 400 }
      );
    }

    const client = getHasuraClient();

    // 1. 查询用户是否存在
    const queryUserQuery = `
      query QueryUserByMobile($mobile: String!) {
        users(where: { mobile: { _eq: $mobile } }, limit: 1) {
          id
          mobile
          password
          nickname
          avatar_url
          role
        }
      }
    `;

    const queryResult = await client.execute({
      query: queryUserQuery,
      variables: { mobile },
    });

    const users = queryResult?.users || [];
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    const user = users[0];

    // 2. 验证密码（MD5 32位小写）
    const passwordHash = crypto.createHash("md5").update(password).digest("hex");
    
    if (user.password !== passwordHash) {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      );
    }

    // 3. 生成JWT token
    const token = HasuraJwtToken.generateToken({
      userId: String(user.id),
      allowedRoles: user.role === "admin" ? ["user", "admin"] : ["user"],
      defaultRole: user.role === "admin" ? "admin" : "user",
    });

    // 4. 返回用户信息和 token（company_users 由前端单独请求，便于角色变动后及时更新）
    return NextResponse.json({
      userId: user.id,
      token,
      user: {
        id: user.id,
        mobile: user.mobile,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        role: user.role,
      },
    });
  } catch (e: any) {
    console.error("密码登录失败:", e);
    return NextResponse.json(
      { error: e.message || "服务异常" },
      { status: 500 }
    );
  }
}
