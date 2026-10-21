// POST /api/lead — 상담 문의 · 소개서 요청 · 진단 리포트 요청을 받아 메일로 전달합니다.
//
// 환경 변수 (Azure Portal → Static Web App → 환경 변수)
//   RESEND_API_KEY  Resend API 키. 없으면 503을 돌려주고, 사이트는 메일 앱으로 대체 안내합니다.
//   LEAD_FROM       발신 주소. Resend에서 인증한 도메인이어야 합니다. 예) Nexus Solution <hello@nexus-ai-sol.com>
//   LEAD_TO         문의를 받을 주소. 기본값 info@nexus-ai-sol.com
import { app } from "@azure/functions";
import { questions, axisLabel, score } from "../../shared/diagnosis.mjs";

const SITE = "https://www.nexus-ai-sol.com";
const KINDS = { contact: "상담 문의", brochure: "소개서 요청", diagnosis: "AI 진단 리포트 요청" };
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clip = (s, n) => String(s ?? "").trim().slice(0, n);

async function send(key, mail) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(mail),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
}

function bar(label, value, color) {
  return `<tr><td style="padding:6px 0;font-size:14px;color:#111">${esc(label)}</td><td style="padding:6px 0;width:60%">
    <div style="background:#EAEAEA;height:10px"><div style="background:${color};height:10px;width:${value}%"></div></div></td>
    <td style="padding:6px 0 6px 10px;font:13px monospace;color:#56534F;text-align:right">${value}%</td></tr>`;
}

// 진단 리포트 — 방문자가 보낸 문구는 넣지 않고, 검증된 점수로만 서버에서 만듭니다
function reportHtml(r, company) {
  const areas = r.areas
    .map((a) => bar(a.area, Math.round((a.value / 3) * 100), a.axis === "opportunity" ? "#EE1111" : "#111111"))
    .join("");
  return `<div style="font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;max-width:600px;margin:0 auto;color:#111;line-height:1.7">
  <p style="font-size:12px;letter-spacing:.12em;color:#C21010;margin:0 0 6px">AI 준비도 진단 리포트</p>
  <h1 style="font-size:24px;margin:0 0 4px">${esc(company)}</h1>
  <p style="color:#56534F;margin:0 0 24px">종합 ${r.overall}% · ${esc(r.type.title)}</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    ${bar(axisLabel.opportunity, r.opportunity, "#EE1111")}
    ${bar(axisLabel.readiness, r.readiness, "#111111")}
  </table>
  <h2 style="font-size:18px;margin:0 0 8px">${esc(r.type.title)}</h2>
  <p style="color:#56534F;margin:0 0 16px">${esc(r.type.summary)}</p>
  <p style="font-size:12px;letter-spacing:.12em;color:#C21010;margin:0 0 6px">추천 첫 단계</p>
  <ol style="margin:0 0 16px;padding-left:20px">${r.type.actions.map((a) => `<li>${esc(a)}</li>`).join("")}</ol>
  <p style="margin:0 0 28px">맞는 서비스: <a href="${SITE}${r.type.serviceHref}" style="color:#C21010">${esc(r.type.service)}</a></p>
  <p style="font-size:12px;letter-spacing:.12em;color:#8A8683;margin:0 0 6px">영역별 점수</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:28px">${areas}</table>
  <div style="border-top:2px solid #EE1111;padding-top:16px">
    <p style="margin:0 0 8px"><b>결과를 바탕으로 30분 무료 상담을 받아 보세요.</b><br>우리 회사에서 어떤 업무부터 바꾸면 좋을지 구체적으로 정리해 드립니다.</p>
    <p style="margin:0"><a href="${SITE}/contact" style="color:#C21010">상담 신청하기</a> · 010-5023-5369 · info@nexus-ai-sol.com</p>
  </div>
  <p style="font-size:12px;color:#8A8683;margin-top:28px">Nexus Solution · 경기도 성남시 분당구 판교대장로2길 4, 102-408<br>이 메일은 ${SITE} 에서 진단 리포트를 요청하셔서 발송되었습니다.</p>
</div>`;
}

app.http("lead", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: "invalid json" } };
    }

    // 숨김 필드가 채워졌으면 봇입니다. 성공한 척 응답만 합니다.
    if (body.website) return { status: 200, jsonBody: { ok: true } };

    const kind = Object.hasOwn(KINDS, body.kind) ? body.kind : "contact";
    const lead = {
      company: clip(body.company, 100),
      name: clip(body.name, 60),
      email: clip(body.email, 120),
      phone: clip(body.phone, 30),
      interest: clip(body.interest, 80),
      size: clip(body.size, 30),
      industry: clip(body.industry, 30),
      message: clip(body.message, 3000),
      page: clip(body.page, 100),
    };
    if (!lead.company || !lead.name || !EMAIL_RE.test(lead.email) || !body.consent) {
      return { status: 400, jsonBody: { error: "missing fields" } };
    }

    let result = null;
    if (kind === "diagnosis") {
      try {
        result = score(body.answers ?? {});
      } catch {
        return { status: 400, jsonBody: { error: "invalid answers" } };
      }
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      context.warn("RESEND_API_KEY is not set; lead not delivered", { kind, company: lead.company });
      return { status: 503, jsonBody: { error: "mail not configured" } };
    }
    const from = process.env.LEAD_FROM || "Nexus Solution <hello@nexus-ai-sol.com>";
    const to = process.env.LEAD_TO || "info@nexus-ai-sol.com";

    const rows = [
      ["구분", KINDS[kind]],
      ["회사명", lead.company],
      ["성함", lead.name],
      ["이메일", lead.email],
      ["연락처", lead.phone],
      ["관심 서비스", lead.interest],
      ["임직원 수", lead.size],
      ["업종", lead.industry],
      ["유입 페이지", lead.page],
    ].filter(([, v]) => v);
    if (result) {
      rows.push(["진단 결과", `${result.type.title} · 종합 ${result.overall}% (기회 ${result.opportunity}% / 준비도 ${result.readiness}%)`]);
      for (const q of questions) rows.push([`  ${q.area}`, q.options[body.answers[q.id]]]);
    }
    const notify = `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#8A8683;white-space:nowrap">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
      .join("")}</table>${lead.message ? `<p style="white-space:pre-wrap;font-family:sans-serif;font-size:14px;border-top:1px solid #ddd;padding-top:12px">${esc(lead.message)}</p>` : ""}`;

    try {
      await send(key, {
        from,
        to: [to],
        reply_to: lead.email,
        subject: `[${KINDS[kind]}] ${lead.company} · ${lead.name}`,
        html: notify,
      });
      if (result) {
        await send(key, {
          from,
          to: [lead.email],
          reply_to: to,
          subject: `[Nexus Solution] ${lead.company} AI 준비도 진단 리포트`,
          html: reportHtml(result, lead.company),
        });
      }
    } catch (err) {
      context.error("lead mail failed", err);
      return { status: 502, jsonBody: { error: "mail failed" } };
    }

    return { status: 200, jsonBody: { ok: true } };
  },
});
