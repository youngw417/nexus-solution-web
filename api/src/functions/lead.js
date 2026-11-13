// POST /api/lead — 상담 문의 · 소개서 요청 · 진단 리포트 요청을 받아 메일로 전달합니다.
//
// 환경 변수 (Azure Portal → Static Web App → 환경 변수)
//   RESEND_API_KEY  Resend API 키. 없으면 503을 돌려주고, 사이트는 메일 앱으로 대체 안내합니다.
//   LEAD_FROM       발신 주소. Resend에서 인증한 도메인이어야 합니다. 예) Nexus Solution <hello@nexus-ai-sol.com>
//   LEAD_TO         문의를 받을 주소. 기본값 info@nexus-ai-sol.com
import { app } from "@azure/functions";
import { questions, locales, score } from "../../shared/diagnosis.mjs";

const SITE = "https://www.nexus-ai-sol.com";
const KINDS = { contact: "상담 문의", brochure: "소개서 요청", diagnosis: "시스템화 진단 리포트 요청" };
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

// 진단 리포트에 쓰는 문구 (방문자가 진단한 언어로 보냅니다)
const REPORT = {
  ko: {
    font: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
    label: "업무 시스템화 진단 리포트",
    overall: "종합",
    firstSteps: "추천 첫 단계",
    service: "맞는 서비스",
    areas: "영역별 점수",
    ctaTitle: "결과를 바탕으로 30분 무료 상담을 받아 보세요.",
    ctaBody: "어떤 업무부터 시스템으로 바꾸면 좋을지 구체적으로 정리해 드립니다.",
    ctaLink: "상담 신청하기",
    contactPath: "/contact",
    phone: "010-5023-5369",
    address: "경기도 성남시 분당구 판교대장로2길 4, 102-408",
    sentBecause: (site) => `이 메일은 ${site} 에서 진단 리포트를 요청하셔서 발송되었습니다.`,
    subject: (company) => `[Nexus Solution] ${company} 업무 시스템화 진단 리포트`,
  },
  en: {
    font: "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif",
    label: "System Readiness Report",
    overall: "Overall",
    firstSteps: "Recommended first steps",
    service: "Suggested service",
    areas: "Scores by area",
    ctaTitle: "Book a free 30-minute consultation based on your results.",
    ctaBody: "We'll lay out specifically which work to move into a system first.",
    ctaLink: "Request a consultation",
    contactPath: "/en/contact",
    phone: "+82 10-5023-5369",
    address: "102-408, 4 Pangyodaejang-ro 2-gil, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
    sentBecause: (site) => `You are receiving this email because you requested a readiness report at ${site}.`,
    subject: (company) => `[Nexus Solution] System Readiness Report for ${company}`,
  },
};

// 진단 리포트 — 방문자가 보낸 문구는 넣지 않고, 검증된 점수로만 서버에서 만듭니다
function reportHtml(r, company, lang) {
  const L = REPORT[lang];
  const { axisLabel } = locales[lang];
  const areas = r.areas
    .map((a) => bar(a.area, Math.round((a.value / 3) * 100), a.axis === "opportunity" ? "#EE1111" : "#111111"))
    .join("");
  return `<div style="font-family:${L.font};max-width:600px;margin:0 auto;color:#111;line-height:1.7">
  <p style="font-size:12px;letter-spacing:.12em;color:#C21010;margin:0 0 6px">${L.label}</p>
  <h1 style="font-size:24px;margin:0 0 4px">${esc(company)}</h1>
  <p style="color:#56534F;margin:0 0 24px">${L.overall} ${r.overall}% · ${esc(r.type.title)}</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    ${bar(axisLabel.opportunity, r.opportunity, "#EE1111")}
    ${bar(axisLabel.readiness, r.readiness, "#111111")}
  </table>
  <h2 style="font-size:18px;margin:0 0 8px">${esc(r.type.title)}</h2>
  <p style="color:#56534F;margin:0 0 16px">${esc(r.type.summary)}</p>
  <p style="font-size:12px;letter-spacing:.12em;color:#C21010;margin:0 0 6px">${L.firstSteps}</p>
  <ol style="margin:0 0 16px;padding-left:20px">${r.type.actions.map((a) => `<li>${esc(a)}</li>`).join("")}</ol>
  <p style="margin:0 0 28px">${L.service}: <a href="${SITE}${r.type.serviceHref}" style="color:#C21010">${esc(r.type.service)}</a></p>
  <p style="font-size:12px;letter-spacing:.12em;color:#8A8683;margin:0 0 6px">${L.areas}</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:28px">${areas}</table>
  <div style="border-top:2px solid #EE1111;padding-top:16px">
    <p style="margin:0 0 8px"><b>${L.ctaTitle}</b><br>${L.ctaBody}</p>
    <p style="margin:0"><a href="${SITE}${L.contactPath}" style="color:#C21010">${L.ctaLink}</a> · ${L.phone} · info@nexus-ai-sol.com</p>
  </div>
  <p style="font-size:12px;color:#8A8683;margin-top:28px">Nexus Solution · ${L.address}<br>${L.sentBecause(SITE)}</p>
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
    // 방문자가 본 사이트 언어. 사내 알림 메일은 항상 한국어, 방문자에게 가는 리포트만 이 언어로 보냅니다.
    const lang = body.lang === "en" ? "en" : "ko";
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
      ["언어", lang === "en" ? "English" : ""],
    ].filter(([, v]) => v);
    if (result) {
      rows.push(["진단 결과", `${result.type.title} · 종합 ${result.overall}% (시스템화 효과 ${result.opportunity}% / 데이터 준비도 ${result.readiness}%)`]);
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
          subject: REPORT[lang].subject(lead.company),
          html: reportHtml(lang === "ko" ? result : score(body.answers, lang), lead.company, lang),
        });
      }
    } catch (err) {
      context.error("lead mail failed", err);
      return { status: 502, jsonBody: { error: "mail failed" } };
    }

    return { status: 200, jsonBody: { ok: true } };
  },
});
