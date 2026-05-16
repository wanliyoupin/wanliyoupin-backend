import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import {
  actorCompanyUserId,
  actorHasAdminLead,
  isJwtPlatformAdmin,
  normalizeLeadStatus,
  resolveLeadActor,
  type LeadActor,
} from "../../lib/leadAuth";
import { getAuthFromRequest } from "../../lib/auth";

/**
 * GET /api/admin/company/leads?companyId=&status=&keyword=&limit=&offset=
 * 省略 companyId 时：仅 JWT 平台管理员可查全平台线索。
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawCompany = searchParams.get("companyId");
  let scopedCompanyId: number | null = null;
  if (rawCompany != null && String(rawCompany).trim() !== "") {
    const n = Number(rawCompany);
    if (!Number.isInteger(n) || n <= 0) {
      return NextResponse.json({ error: "无效的 companyId" }, { status: 400 });
    }
    scopedCompanyId = n;
  }

  let actor: LeadActor;
  if (scopedCompanyId != null) {
    const a = await resolveLeadActor(req, scopedCompanyId);
    if (a instanceof NextResponse) return a;
    actor = a;
  } else {
    const auth = getAuthFromRequest(req);
    if (auth instanceof NextResponse) return auth;
    if (!isJwtPlatformAdmin(req)) {
      return NextResponse.json({ error: "仅平台管理员可查看全平台线索" }, { status: 403 });
    }
    actor = { kind: "platform_admin" };
  }

  const statusFilter = searchParams.get("status")?.trim() || undefined;
  const keyword = searchParams.get("keyword")?.trim() || undefined;
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

  const variables: Record<string, unknown> = { limit, offset };
  const varDecls: string[] = ["$limit: Int!", "$offset: Int!"];
  const andParts: string[] = [];

  if (scopedCompanyId != null) {
    variables.companyId = scopedCompanyId;
    varDecls.unshift("$companyId: bigint!");
    andParts.push("{ company_companies: { _eq: $companyId } }");
  }

  if (statusFilter) {
    andParts.push("{ status: { _eq: $status } }");
    variables.status = statusFilter;
    varDecls.push("$status: String!");
  }
  if (keyword) {
    variables.kw = `%${keyword}%`;
    varDecls.push("$kw: String!");
    andParts.push(
      `{ _or: [ { name: { _ilike: $kw } }, { phone: { _ilike: $kw } } ] }`
    );
  }

  if (!actorHasAdminLead(actor)) {
    const myId = actorCompanyUserId(actor);
    if (myId == null) {
      return NextResponse.json({ error: "无法筛选线索" }, { status: 403 });
    }
    variables.myCuId = myId;
    varDecls.push("$myCuId: bigint!");
    andParts.push(
      `{ _or: [ { assigned_company_users: { _eq: $myCuId } }, { created_by_company_users: { _eq: $myCuId } } ] }`
    );
  }

  const whereClause =
    andParts.length > 0 ? `{ _and: [ ${andParts.join(", ")} ] }` : "{}";

  const query = `
    query LeadList(${varDecls.join(", ")}) {
      company_leads(
        where: ${whereClause}
        limit: $limit
        offset: $offset
        order_by: { updated_at: desc }
      ) {
        id
        name
        phone
        status
        company_companies
        company {
          id
          name
        }
        assigned_company_users
        created_by_company_users
        converted_company_users
        converted_at
        linked_user_users
        created_at
        updated_at
        companyUserByCreatedByCompanyUsers {
          id
          user { id nickname mobile }
        }
        company_user {
          id
          user { id nickname mobile }
        }
        companyUserByConvertedCompanyUsers {
          id
          user { id nickname mobile }
        }
      }
      company_leads_aggregate(where: ${whereClause}) {
        aggregate { count }
      }
    }
  `;

  try {
    const client = getHasuraClient();
    const res = await client.execute({ query, variables });
    const data = res as {
      company_leads?: unknown[];
      company_leads_aggregate?: { aggregate?: { count?: number } };
    };
    return NextResponse.json({
      leads: data?.company_leads ?? [],
      total: data?.company_leads_aggregate?.aggregate?.count ?? 0,
    });
  } catch (e: unknown) {
    console.error("admin company leads list", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/company/leads
 * Body: { companyId, name, phone, status? } — status 默认 new
 */
export async function POST(req: NextRequest) {
  let body: { companyId?: number; name?: string; phone?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的 JSON" }, { status: 400 });
  }
  const companyId = body.companyId != null ? Number(body.companyId) : NaN;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (!Number.isInteger(companyId) || companyId <= 0 || !name || !phone) {
    return NextResponse.json({ error: "缺少 companyId / name / phone" }, { status: 400 });
  }

  const actor = await resolveLeadActor(req, companyId);
  if (actor instanceof NextResponse) return actor;
  if (!actorHasAdminLead(actor)) {
    return NextResponse.json({ error: "仅线索管理员可录入线索" }, { status: 403 });
  }

  const statusRaw = body.status != null ? normalizeLeadStatus(body.status) : "new";
  const status = statusRaw === "assigned" ? "assigned" : "new";

  const createdBy = actorCompanyUserId(actor);

  try {
    const client = getHasuraClient();
    const mutation = `
      mutation InsertLead($object: company_leads_insert_input!) {
        insert_company_leads_one(object: $object) {
          id
          name
          phone
          status
          company_companies
          created_by_company_users
          created_at
        }
      }
    `;
    const object: Record<string, unknown> = {
      company_companies: companyId,
      name,
      phone,
      status,
    };
    if (createdBy != null) object.created_by_company_users = createdBy;

    const res = await client.execute({
      query: mutation,
      variables: { object },
    });
    const row = (res as { insert_company_leads_one?: unknown })?.insert_company_leads_one;
    if (!row) {
      return NextResponse.json({ error: "创建失败" }, { status: 500 });
    }
    return NextResponse.json(row);
  } catch (e: unknown) {
    console.error("admin company leads create", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
