import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { locales, score } from "../../api/shared/diagnosis.mjs";

type Lang = "ko" | "en";
type Answers = Record<string, number>;
type Step = "intro" | "quiz" | "result";

// 화면 문구. 문항과 결과 유형은 api/shared/diagnosis.mjs 에 있습니다.
const text = {
  ko: {
    sizes: ["10명 미만", "10~49명", "50~299명", "300명 이상"],
    industries: ["제조", "교육기관 · 학원", "유통 · 도매", "회계 · 세무 · 노무", "건설 · 부동산", "서비스 · 기타"],
    intro: [
      ["12문항 · 3분", "이메일 없이 바로 시작합니다."],
      ["두 가지 축", "시스템화 효과와 데이터 준비도를 함께 봅니다."],
      ["즉시 결과", "점수와 유형, 추천 첫 단계를 바로 보여 드립니다."],
    ],
    start: "진단 시작하기",
    sampleImage: "/illustrations/diagnosis-result.svg",
    sampleAlt: "진단 결과 화면 예시: 종합 점수와 시스템화 효과, 데이터 준비도 막대, 결과 유형, 추천 첫 단계, 상세 리포트 메일 발송",
    sampleCaption: "결과 화면 예시입니다. 실제 점수와 유형은 응답에 따라 달라집니다.",
    prev: "← 이전 문항",
    next: "다음 →",
    result: "진단 결과",
    overall: "시스템화 진단 종합",
    firstSteps: "추천 첫 단계",
    service: "맞는 서비스",
    more: "자세히 보기 →",
    areas: "영역별 점수 보기",
    restart: "다시 진단하기",
    sentTitle: "리포트를 보내 드렸습니다",
    sentBody: (email: string) => `${email}로 상세 리포트를 발송했습니다. 몇 분 안에 도착하지 않으면 스팸함을 확인해 주세요.`,
    reportEyebrow: "무료 상세 리포트",
    reportTitle: "상세 리포트를 메일로 받으시겠습니까?",
    reportBody: "영역별 해설과 우리 회사에 맞는 시스템화 순서를 정리해 보내 드립니다. ",
    reportBodyStrong: "내부 보고 자료로 그대로 쓰실 수 있습니다.",
    company: "회사명 *",
    name: "성함 · 직책 *",
    namePlaceholder: "홍길동 과장",
    email: "회사 이메일 *",
    size: "임직원 수",
    industry: "업종",
    select: "선택",
    consent: "리포트 발송과 후속 상담 안내를 위한 개인정보(회사명, 성함, 이메일) 수집·이용에 동의합니다. 수집한 정보는 해당 목적으로만 사용하며 1년간 보관합니다.",
    sending: "보내는 중…",
    submit: "리포트 받기",
    error: "전송에 실패했습니다. 잠시 후 다시 시도하시거나 info@nexus-ai-sol.com으로 연락 주세요.",
  },
  en: {
    sizes: ["Fewer than 10", "10–49", "50–299", "300 or more"],
    industries: ["Manufacturing", "Schools · Academies", "Distribution · Wholesale", "Accounting · Tax · Labor", "Construction · Real estate", "Services · Other"],
    intro: [
      ["12 questions · 3 min", "Start right away, no email needed."],
      ["Two measures", "We look at system impact and data readiness together."],
      ["Instant results", "See your scores, your type, and recommended first steps."],
    ],
    start: "Start the check",
    sampleImage: "/illustrations/en/diagnosis-result.svg",
    sampleAlt: "Sample results screen: overall score, bars for system impact and data readiness, result type, recommended first steps, and a detailed report by email",
    sampleCaption: "A sample results screen. Your scores and type depend on your answers.",
    prev: "← Previous",
    next: "Next →",
    result: "Your results",
    overall: "Overall score",
    firstSteps: "Recommended first steps",
    service: "Suggested service",
    more: "Learn more →",
    areas: "Show scores by area",
    restart: "Start over",
    sentTitle: "Your report is on its way",
    sentBody: (email: string) => `We sent the detailed report to ${email}. If it doesn't arrive within a few minutes, please check your spam folder.`,
    reportEyebrow: "Free detailed report",
    reportTitle: "Want the detailed report by email?",
    reportBody: "We'll send notes on each area and a suggested order for moving your work into systems. ",
    reportBodyStrong: "You can use it as is for internal reporting.",
    company: "Company *",
    name: "Name & title *",
    namePlaceholder: "Jane Kim, Manager",
    email: "Work email *",
    size: "Number of employees",
    industry: "Industry",
    select: "Select",
    consent: "I agree to the collection and use of my personal information (company, name, email) to send this report and follow up about a consultation. It is used only for that purpose and kept for one year.",
    sending: "Sending…",
    submit: "Get the report",
    error: "We couldn't send your request. Please try again shortly or email info@nexus-ai-sol.com.",
  },
};

function Bar({ value, tone = "accent", label }: { value: number; tone?: "accent" | "ink"; label: string }) {
  return (
    <div className="h-2.5 bg-surface-2" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
      <div className={`h-full transition-[width] duration-700 ${tone === "accent" ? "bg-accent" : "bg-ink"}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function Diagnosis({ lang = "ko" }: { lang?: Lang }) {
  const t = text[lang];
  const { questions, axisLabel } = locales[lang];
  const [step, setStep] = useState<Step>("intro");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  // 문항이 바뀔 때 스크린리더와 키보드 사용자가 새 질문으로 이동하도록 포커스를 옮깁니다
  useEffect(() => {
    if (step !== "intro") headingRef.current?.focus();
  }, [step, i]);

  const pick = (qid: string, v: number) => {
    const next = { ...answers, [qid]: v };
    setAnswers(next);
    if (i < questions.length - 1) setI(i + 1);
    else setStep("result");
  };

  if (step === "intro") {
    return (
      <div className="grid gap-6">
      <div className="border border-line bg-surface p-6 sm:p-10">
        <ul className="mb-8 grid gap-4 p-0 sm:grid-cols-3" style={{ listStyle: "none" }}>
          {t.intro.map(([h, b]) => (
            <li key={h} className="border-t-2 border-accent pt-3">
              <b className="block font-display text-[16px]">{h}</b>
              <span className="text-[14px] text-ink-2">{b}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-primary cursor-pointer" onClick={() => setStep("quiz")}>{t.start}</button>
      </div>
      <figure className="m-0">
        <img src={t.sampleImage} width={640} height={440} className="block h-auto w-full border border-line" alt={t.sampleAlt} />
        <figcaption className="mt-2 text-[12.5px] text-ink-3">{t.sampleCaption}</figcaption>
      </figure>
      </div>
    );
  }

  if (step === "quiz") {
    const q = questions[i];
    const progress = Math.round((i / questions.length) * 100);
    return (
      <div className="border border-line bg-surface p-6 sm:p-10">
        <div className="mb-2 flex items-baseline justify-between font-mono text-[12px] text-ink-3">
          <span>{axisLabel[q.axis]} · {q.area}</span>
          <span>{i + 1} / {questions.length}</span>
        </div>
        <div className="mb-8 h-1 bg-surface-2"><div className="h-full bg-accent transition-[width]" style={{ width: `${progress}%` }} /></div>

        <fieldset className="m-0 border-0 p-0">
          <legend className="contents">
            <h2 ref={headingRef} tabIndex={-1} className="h3 mb-6 !text-[clamp(19px,2.6vw,23px)] outline-none">{q.q}</h2>
          </legend>
          <div className="grid gap-2.5">
            {q.options.map((opt, v) => {
              const selected = answers[q.id] === v;
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pick(q.id, v)}
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3.5 text-left text-[15.5px] transition-colors ${
                    selected ? "border-accent bg-accent-soft text-ink" : "border-line-2 bg-surface text-ink hover:border-accent"
                  }`}
                >
                  <span className={`grid h-6 w-6 flex-none place-items-center border font-mono text-[11px] ${selected ? "border-btn bg-btn text-btn-ink" : "border-line-2 text-ink-3"}`}>
                    {String.fromCharCode(65 + v)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-display text-[14px] font-bold text-ink-2 hover:text-accent-ink disabled:invisible"
            onClick={() => setI(i - 1)}
            disabled={i === 0}
          >
            {t.prev}
          </button>
          {answers[q.id] !== undefined && i < questions.length - 1 && (
            <button type="button" className="cursor-pointer border-0 bg-transparent p-0 font-display text-[14px] font-bold text-ink-2 hover:text-accent-ink" onClick={() => setI(i + 1)}>
              {t.next}
            </button>
          )}
        </div>
      </div>
    );
  }

  return <Result lang={lang} answers={answers} headingRef={headingRef} onRestart={() => { setAnswers({}); setI(0); setStep("intro"); }} />;
}

function Result({ lang, answers, headingRef, onRestart }: { lang: Lang; answers: Answers; headingRef: React.RefObject<HTMLHeadingElement | null>; onRestart: () => void }) {
  const t = text[lang];
  const { axisLabel } = locales[lang];
  const r = score(answers, lang);
  return (
    <div className="grid gap-6">
      <div className="border border-line bg-surface p-6 sm:p-10">
        <p className="eyebrow"><span className="bars" aria-hidden="true"><i></i><i></i><i></i></span>{t.result}</p>
        <div className="mb-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <div>
            <p className="m-0 font-mono text-[12px] text-ink-3">{t.overall}</p>
            <p className="m-0 font-display text-[64px] leading-none font-extrabold tracking-[-.04em]">{r.overall}<span className="text-[28px] text-ink-3">%</span></p>
          </div>
          <div className="grid gap-4">
            <div>
              <div className="mb-1.5 flex justify-between text-[14px]"><b className="font-display">{axisLabel.opportunity}</b><span className="font-mono">{r.opportunity}%</span></div>
              <Bar value={r.opportunity} label={axisLabel.opportunity} />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-[14px]"><b className="font-display">{axisLabel.readiness}</b><span className="font-mono">{r.readiness}%</span></div>
              <Bar value={r.readiness} tone="ink" label={axisLabel.readiness} />
            </div>
          </div>
        </div>

        <h2 ref={headingRef} tabIndex={-1} className="h2 mb-3 outline-none">{r.type.title}</h2>
        <p className="mb-6 max-w-[64ch] text-ink-2">{r.type.summary}</p>

        <div className="grid-rule md:grid-cols-[1.4fr_1fr]">
          <div className="p-5">
            <p className="mb-3 font-mono text-[11px] tracking-[.12em] text-accent-ink uppercase">{t.firstSteps}</p>
            <ol className="m-0 grid gap-2 list-decimal pl-5 text-[14.5px] marker:text-accent">
              {r.type.actions.map((a: string) => <li key={a}>{a}</li>)}
            </ol>
          </div>
          <div className="flex flex-col gap-2 p-5">
            <p className="m-0 font-mono text-[11px] tracking-[.12em] text-ink-3 uppercase">{t.service}</p>
            <b className="font-display text-[16px]">{r.type.service}</b>
            <a href={r.type.serviceHref} className="mt-auto font-display text-[14px] font-bold text-accent-ink">{t.more}</a>
          </div>
        </div>

        <details className="mt-6 group">
          <summary className="cursor-pointer font-display text-[14px] font-bold text-ink-2 hover:text-accent-ink">{t.areas}</summary>
          <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {r.areas.map((a: { id: string; axis: "opportunity" | "readiness"; area: string; value: number }) => (
              <div key={a.id}>
                <div className="mb-1 flex justify-between text-[13px] text-ink-2"><span>{a.area}</span><span className="font-mono">{a.value}/3</span></div>
                <Bar value={(a.value / 3) * 100} tone={a.axis === "opportunity" ? "accent" : "ink"} label={a.area} />
              </div>
            ))}
          </div>
        </details>

        <button type="button" onClick={onRestart} className="mt-6 cursor-pointer border-0 bg-transparent p-0 text-[13px] text-ink-3 underline hover:text-accent-ink">{t.restart}</button>
      </div>

      <ReportForm lang={lang} answers={answers} />
    </div>
  );
}

function ReportForm({ lang, answers }: { lang: Lang; answers: Answers }) {
  const t = text[lang];
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [sentTo, setSentTo] = useState("");

  async function submit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: "diagnosis", page: location.pathname, lang, answers }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSentTo(data.email);
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="border border-line border-t-2 border-t-accent bg-surface p-6 sm:p-8">
        <p className="h3 mb-2">{t.sentTitle}</p>
        <p className="m-0 text-ink-2">{t.sentBody(sentTo)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="border border-line border-t-2 border-t-accent bg-surface p-6 sm:p-8">
      <p className="mb-1 font-mono text-[11px] tracking-[.12em] text-accent-ink uppercase">{t.reportEyebrow}</p>
      <h2 className="h3 mb-2 !text-[21px]">{t.reportTitle}</h2>
      <p className="mb-6 text-[14.5px] text-ink-2">{t.reportBody}<b className="font-medium text-ink">{t.reportBodyStrong}</b></p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field"><label htmlFor="d-company">{t.company}</label><input className="input" id="d-company" name="company" required autoComplete="organization" /></div>
        <div className="field"><label htmlFor="d-name">{t.name}</label><input className="input" id="d-name" name="name" required autoComplete="name" placeholder={t.namePlaceholder} /></div>
        <div className="field sm:col-span-2"><label htmlFor="d-email">{t.email}</label><input className="input" id="d-email" name="email" type="email" required autoComplete="email" /></div>
        <div className="field">
          <label htmlFor="d-size">{t.size}</label>
          <select className="input" id="d-size" name="size" defaultValue=""><option value="">{t.select}</option>{t.sizes.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="d-industry">{t.industry}</label>
          <select className="input" id="d-industry" name="industry" defaultValue=""><option value="">{t.select}</option>{t.industries.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
        <label className="flex items-start gap-2.5 text-[13.5px] text-ink-2 sm:col-span-2">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 flex-none accent-[var(--accent)]" />
          <span>{t.consent}</span>
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="btn btn-primary cursor-pointer disabled:cursor-wait disabled:opacity-60">
          {state === "sending" ? t.sending : t.submit}
        </button>
        {state === "error" && (
          <p className="m-0 text-[13.5px] text-accent-ink" role="alert">{t.error}</p>
        )}
      </div>
    </form>
  );
}
