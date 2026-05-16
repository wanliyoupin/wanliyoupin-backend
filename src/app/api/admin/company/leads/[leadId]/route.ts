import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import {
  actorCompanyUserId,
  actorHasAdminLead,
  normalizeLeadStatus,
  resolveLeadActor,
} from "../../../lib/leadAuth";

type LeadRow = {
  id: number;
  company_companies: number;
  assigned_company_users?: number | null;
  created_by_company_users?: number | null;
};

async function fetchLeadBare(leadId: number): Promise<LeadRow | null> {
  const client = getHasuraClient();
  const res = await client.execute({
    query: `
      query LeadBare($id: bigint!) {
        company_leads_by_pk(id: $id) {
          id
          company_companies
          assigned_company_users
          created_by_company_users
        }
      }
    `,
    variables: { id: leadId },
  });
  return (res as { company_leads_by_pk?: LeadRow | null })?.company_leads_by_pk ?? null;
}

function canTrackerViewLead(lead: LeadRow, myCuId: number): boolean {
  return (
    lead.assigned_company_users === myCuId || lead.created_by_company_users === myCuId
  );
}

/**
 * GET /api/admin/company/leads/[leadId]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const leadId = Number((await params).leadId);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    return NextResponse.json({ error: "无效的线索 ID" }, { status: 400 });
  }

  const bare = await fetchLeadBare(leadId);
  if (!bare) return NextResponse.json({ error: "线索不存在" }, { status: 404 });

  const actor = await resolveLeadActor(req, bare.company_companies);
  if (actor instanceof NextResponse) return actor;

  if (!actorHasAdminLead(actor)) {
    const myId = actorCompanyUserId(actor);
    if (myId == null || !canTrackerViewLead(bare, myId)) {
      return NextResponse.json({ error: "无权限查看该线索" }, { status: 403 });
    }
  }

  try {
    const client = getHasuraClient();
    const res = await client.execute({
      query: `
        query LeadDetail($id: bigint!) {
          company_leads_by_pk(id: $id) {
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
            user {
              id
              mobile
              nickname
            }
            company_user {
              id
              user { id nickname mobile role }
            }
            companyUserByCreatedByCompanyUsers {
              id
              user { id nickname mobile }
            }
            companyUserByConvertedCompanyUsers {
              id
              user { id nickname mobile }
            }
            company_lead_tracks(order_by: { created_at: asc }) {
              id
              content
              attachments
              created_at
              updated_at
              created_by_company_users
              company_user {
                id
                user { id nickname mobile }
              }
            }
          }
        }
      `,
      variables: { id: leadId },
    });
    const lead = (res as { company_leads_by_pk?: Record<string, unknown> | null })?.company_leads_by_pk;
    if (!lead) {
      return NextResponse.json({ error: "线索不存在" }, { status: 404 });
    }

    /** 按 assigned_company_users 显式取跟进人，避免 Hasura 上 company_user 关系若未挂在「分配」外键上会错位 */
    let assignee_company_user: {
      id: number;
      role?: string;
      user?: { id: number; nickname?: string; mobile?: string; role?: string | null };
    } | null = null;
    const aid = lead.assigned_company_users;
    const leadCid = lead.company_companies;
    if (aid != null && leadCid != null) {
      const ar = await client.execute({
        query: `
          query AssigneeCu($id: bigint!) {
            company_users_by_pk(id: $id) {
              id
              company_companies
              role
              user { id nickname mobile role }
            }
          }
        `,
        variables: { id: aid },
      });
      const row = (
        ar as {
          company_users_by_pk?: {
            id: number;
            company_companies: number;
            role?: string;
            user?: { id: number; nickname?: string; mobile?: string; role?: string | null };
          } | null;
        }
      )?.company_users_by_pk;
      if (
        row &&
        Number(row.company_companies) === Number(leadCid)
      ) {
        assignee_company_user = {
          id: row.id,
          role: row.role,
          user: row.user,
        };
      }
    }

    return NextResponse.json({ ...lead, assignee_company_user });
  } catch (e: unknown) {
    console.error("admin lead get", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/company/leads/[leadId]
 * Body:
 *  - 分配/更新：{ assigned_company_users?, status?, name?, phone? }
 *  - 转客户：{ action: "convert", can_view_price?, price_factor?, level?, role? }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const leadId = Number((await params).leadId);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    return NextResponse.json({ error: "无效的线索 ID" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的 JSON" }, { status: 400 });
  }

  const bare = await fetchLeadBare(leadId);
  if (!bare) return NextResponse.json({ error: "线索不存在" }, { status: 404 });

  const actor = await resolveLeadActor(req, bare.company_companies);
  if (actor instanceof NextResponse) return actor;

  const admin = actorHasAdminLead(actor);
  const myId = actorCompanyUserId(actor);
  if (!admin) {
    if (myId == null || !canTrackerViewLead(bare, myId)) {
      return NextResponse.json({ error: "无权限修改该线索" }, { status: 403 });
    }
  }

  if (body.action === "convert") {
    if (!admin) {
      return NextResponse.json({ error: "仅线索管理员可执行转客户" }, { status: 403 });
    }
    return convertLead(leadId, bare.company_companies, body);
  }

  const patch: Record<string, unknown> = {};
  if (body.assigned_company_users !== undefined) {
    if (!admin) {
      return NextResponse.json({ error: "仅管理员可分配跟进人" }, { status: 403 });
    }
    const v = body.assigned_company_users;
    if (v === null) {
      patch.assigned_company_users = null;
    } else {
      const n = Number(v);
      if (!Number.isInteger(n) || n <= 0) {
        return NextResponse.json({ error: "无效的 assigned_company_users" }, { status: 400 });
      }
      patch.assigned_company_users = n;
    }
  }
  if (body.status !== undefined) {
    const st = normalizeLeadStatus(body.status);
    if (!st) {
      return NextResponse.json({ error: "无效的 status" }, { status: 400 });
    }
    if (!admin) {
      const allowedTracker = st === "following" || st === "won" || st === "lost";
      if (!allowedTracker) {
        return NextResponse.json({ error: "跟进人仅可将状态改为 following / won / lost" }, { status: 403 });
      }
    }
    if (st === "converted") {
      return NextResponse.json({ error: "请使用 action: convert 转客户" }, { status: 400 });
    }
    patch.status = st;
  }
  if (body.name !== undefined) {
    if (!admin) return NextResponse.json({ error: "仅管理员可修改姓名" }, { status: 403 });
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "name 不能为空" }, { status: 400 });
    patch.name = name;
  }
  if (body.phone !== undefined) {
    if (!admin) return NextResponse.json({ error: "仅管理员可修改电话" }, { status: 403 });
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    if (!phone) return NextResponse.json({ error: "phone 不能为空" }, { status: 400 });
    patch.phone = phone;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "无有效更新字段" }, { status: 400 });
  }

  try {
    const client = getHasuraClient();
    const res = await client.execute({
      query: `
        mutation UpdateLead($id: bigint!, $patch: company_leads_set_input!) {
          update_company_leads_by_pk(pk_columns: { id: $id }, _set: $patch) {
            id
            name
            phone
            status
            assigned_company_users
            updated_at
          }
        }
      `,
      variables: { id: leadId, patch },
    });
    const row = (res as { update_company_leads_by_pk?: unknown })?.update_company_leads_by_pk;
    if (!row) return NextResponse.json({ error: "更新失败" }, { status: 500 });
    return NextResponse.json(row);
  } catch (e: unknown) {
    console.error("admin lead patch", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}

async function convertLead(
  leadId: number,
  companyId: number,
  body: Record<string, unknown>
): Promise<NextResponse> {
  const client = getHasuraClient();
  const leadRes = await client.execute({
    query: `
      query LeadForConvert($id: bigint!) {
        company_leads_by_pk(id: $id) {
          id
          phone
          status
          converted_company_users
          company_companies
        }
      }
    `,
    variables: { id: leadId },
  });
  const lead = (
    leadRes as {
      company_leads_by_pk?: {
        id: number;
        phone: string;
        status: string;
        converted_company_users?: number | null;
        company_companies: number;
      } | null;
    }
  )?.company_leads_by_pk;
  if (!lead) return NextResponse.json({ error: "线索不存在" }, { status: 404 });
  if (lead.company_companies !== companyId) {
    return NextResponse.json({ error: "数据不一致" }, { status: 400 });
  }
  if (lead.status === "converted" || lead.converted_company_users != null) {
    return NextResponse.json({ error: "已转化，勿重复操作" }, { status: 400 });
  }

  const mobile = String(lead.phone).trim();
  if (mobile.length !== 11) {
    return NextResponse.json({ error: "线索手机号非 11 位，无法匹配用户" }, { status: 400 });
  }

  const role = body.role === "admin" || body.role === "user" ? body.role : "user";
  const level =
    body.level && ["A", "B", "C", "D", "E"].includes(String(body.level))
      ? String(body.level)
      : "A";
  const can_view_price =
    typeof body.can_view_price === "boolean" ? body.can_view_price : true;
  const price_factor =
    body.price_factor != null &&
    !Number.isNaN(Number(body.price_factor)) &&
    Number(body.price_factor) > 0
      ? Number(body.price_factor)
      : 1;

  const searchRes = await client.execute({
    query: `
      query U($m: String!) {
        users(where: { mobile: { _eq: $m } }, limit: 1) {
          id
        }
      }
    `,
    variables: { m: mobile },
  });
  let userId: number | undefined = (searchRes as { users?: { id: number }[] })?.users?.[0]?.id;
  if (!userId) {
    const createRes = await client.execute({
      query: `
        mutation C($m: String!) {
          insert_users_one(object: { mobile: $m, role: "user" }) {
            id
          }
        }
      `,
      variables: { m: mobile },
    });
    userId = (createRes as { insert_users_one?: { id: number } })?.insert_users_one?.id;
    if (!userId) {
      return NextResponse.json({ error: "创建平台用户失败" }, { status: 500 });
    }
  }

  const addCuRes = await client.execute({
    query: `
      mutation AddCu($object: company_users_insert_input!) {
        insert_company_users_one(
          object: $object
          on_conflict: {
            constraint: company_users_company_companies_user_users_key
            update_columns: [role, level, can_view_price, price_factor]
          }
        ) {
          id
          user { id mobile nickname }
        }
      }
    `,
    variables: {
      object: {
        user_users: userId,
        company_companies: companyId,
        role,
        level,
        can_view_price,
        price_factor,
      },
    },
  });
  const cu = (addCuRes as { insert_company_users_one?: { id: number } })?.insert_company_users_one;
  if (!cu?.id) {
    return NextResponse.json({ error: "写入公司客户失败" }, { status: 500 });
  }

  const nowIso = new Date().toISOString();
  const updRes = await client.execute({
    query: `
      mutation FinishConvert($id: bigint!, $cu: bigint!, $uid: bigint!, $at: timestamptz!) {
        update_company_leads_by_pk(
          pk_columns: { id: $id }
          _set: {
            status: "converted"
            converted_company_users: $cu
            converted_at: $at
            linked_user_users: $uid
          }
        ) {
          id
          status
          converted_company_users
          converted_at
          linked_user_users
        }
      }
    `,
    variables: { id: leadId, cu: cu.id, uid: userId, at: nowIso },
  });
  const updated = (updRes as { update_company_leads_by_pk?: unknown })?.update_company_leads_by_pk;
  if (!updated) {
    return NextResponse.json({ error: "更新线索状态失败" }, { status: 500 });
  }
  return NextResponse.json({ lead: updated, company_user: cu });
}
