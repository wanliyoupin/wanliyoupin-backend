import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/api/admin/lib/auth";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";
import {
  actorCompanyUserId,
  canManageLead,
  getCompanyMembership,
  resolveLeadActor,
} from "../../../../lib/leadAuth";

type LeadBare = {
  id: number;
  company_companies: number;
  created_by_company_users?: number | null;
};

async function fetchLeadBare(leadId: number): Promise<LeadBare | null> {
  const client = getHasuraClient();
  const res = await client.execute({
    query: `
      query L($id: bigint!) {
        company_leads_by_pk(id: $id) {
          id
          company_companies
          created_by_company_users
        }
      }
    `,
    variables: { id: leadId },
  });
  return (res as { company_leads_by_pk?: LeadBare | null })?.company_leads_by_pk ?? null;
}

/**
 * POST /api/admin/company/leads/[leadId]/tracks
 * Body: { content: string, attachments?: unknown (JSON array) }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const leadId = Number((await params).leadId);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    return NextResponse.json({ error: "无效的线索 ID" }, { status: 400 });
  }

  let body: { content?: string; attachments?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的 JSON" }, { status: 400 });
  }
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json({ error: "请填写跟进内容" }, { status: 400 });
  }

  let attachments: unknown = body.attachments ?? [];
  if (attachments !== null && attachments !== undefined && !Array.isArray(attachments)) {
    return NextResponse.json({ error: "attachments 须为 JSON 数组" }, { status: 400 });
  }
  if (attachments == null) attachments = [];

  const bare = await fetchLeadBare(leadId);
  if (!bare) return NextResponse.json({ error: "线索不存在" }, { status: 404 });

  const actor = await resolveLeadActor(req, bare.company_companies);
  if (actor instanceof NextResponse) return actor;

  let myCuId = actorCompanyUserId(actor);
  /** 平台管理员 JWT 不会带 company_users；若该用户在该司有成员行，用其 id 写入跟进人 */
  if (myCuId == null && actor.kind === "platform_admin") {
    const auth = getAuthFromRequest(req);
    if (auth instanceof NextResponse) return auth;
    const m = await getCompanyMembership(auth.userId, bare.company_companies);
    myCuId = m?.id ?? null;
  }
  if (myCuId == null) {
    return NextResponse.json(
      { error: "添加跟进需使用该公司下的成员账号（platform admin 无 company_users 时不可用）" },
      { status: 403 }
    );
  }
  if (!canManageLead(actor, bare, myCuId)) {
    return NextResponse.json({ error: "无权限为该线索添加跟进" }, { status: 403 });
  }

  try {
    const client = getHasuraClient();
    const res = await client.execute({
      query: `
        mutation AddTrack($object: company_lead_tracks_insert_input!) {
          insert_company_lead_tracks_one(object: $object) {
            id
            content
            attachments
            created_at
            created_by_company_users
          }
        }
      `,
      variables: {
        object: {
          company_lead_company_leads: leadId,
          content,
          attachments,
          created_by_company_users: myCuId,
        },
      },
    });
    const row = (res as { insert_company_lead_tracks_one?: unknown })?.insert_company_lead_tracks_one;
    if (!row) return NextResponse.json({ error: "写入失败" }, { status: 500 });
    return NextResponse.json(row);
  } catch (e: unknown) {
    console.error("admin lead track", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务异常" },
      { status: 500 }
    );
  }
}
