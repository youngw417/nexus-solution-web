// 업무 시스템화 진단 — 문항, 채점, 유형. 사이트(React)와 API(리포트 메일)가 함께 씁니다.
// 모든 문항은 보기 4개, 점수는 0~3점. 축별 6문항이므로 축당 만점 18점.

/** @typedef {"opportunity" | "readiness"} Axis */
/** @typedef {{ id: string, axis: Axis, area: string, q: string, options: string[] }} Question */

/** @type {Question[]} */
export const questions = [
  // 시스템화 효과 — 높을수록 시스템으로 바꿨을 때 줄어드는 일이 많습니다
  { id: "o1", axis: "opportunity", area: "데이터 분산", q: "한 가지 업무(예: 주문, 재고, 고객) 데이터를 몇 개의 엑셀 파일이나 도구에 나눠 관리합니까?", options: ["1~2개", "3~5개", "6~10개", "10개 이상"] },
  { id: "o2", axis: "opportunity", area: "중복 입력", q: "같은 내용을 여러 파일이나 시스템에 반복해서 입력하는 일은 얼마나 자주 있습니까?", options: ["거의 없다", "가끔 있다", "자주 있다", "거의 매일"] },
  { id: "o3", axis: "opportunity", area: "취합 · 보고", q: "보고를 위해 데이터를 수작업으로 모으고 정리하는 데 일주일에 쓰는 시간은?", options: ["1시간 미만", "1~4시간", "4~8시간", "8시간 이상"] },
  { id: "o4", axis: "opportunity", area: "버전 · 오류", q: "최신 파일이 무엇인지 헷갈리거나, 숫자가 맞지 않아 다시 확인하는 일은?", options: ["거의 없다", "한 달에 몇 번", "일주일에 몇 번", "거의 매일"] },
  { id: "o5", axis: "opportunity", area: "현장 기록", q: "현장이나 외근에서 종이 · 사진 · 메신저로 기록하고, 나중에 다시 정리하는 업무가 있습니까?", options: ["없다", "일부 있다", "상당히 많다", "핵심 업무다"] },
  { id: "o6", axis: "opportunity", area: "영향 범위", q: "위와 같은 데이터 업무를 하는 직원은 몇 명입니까?", options: ["5명 미만", "5~20명", "20~50명", "50명 이상"] },

  // 데이터 준비도 — 높을수록 바로 시스템 구축을 시작할 수 있습니다
  { id: "r1", axis: "readiness", area: "자료 정리", q: "업무 데이터와 문서는 얼마나 정리되어 있습니까?", options: ["개인 PC에 흩어져 있다", "공유 폴더는 있지만 정리가 안 됐다", "대체로 정리되어 있다", "정해진 위치와 규칙으로 관리한다"] },
  { id: "r2", axis: "readiness", area: "업무 규칙", q: "업무 처리 순서와 양식이 정해져 있습니까?", options: ["사람마다 다르다", "대략적인 관행만 있다", "주요 양식은 정해져 있다", "절차와 양식이 문서로 정리돼 있다"] },
  { id: "r3", axis: "readiness", area: "클라우드 수용", q: "회사 데이터를 클라우드에 두는 것에 대한 회사의 입장은?", options: ["허용하지 않는다", "기준이 불명확하다", "조건을 갖추면 허용한다", "이미 클라우드 서비스를 쓰고 있다"] },
  { id: "r4", axis: "readiness", area: "추진 주체", q: "시스템 도입을 맡을 담당자가 정해져 있습니까?", options: ["없다", "관심 있는 사람은 있다", "담당자가 지정됐다", "전담 조직 · TF가 있다"] },
  { id: "r5", axis: "readiness", area: "경영진 의지", q: "경영진의 업무 시스템화 의지는 어느 정도입니까?", options: ["특별한 관심이 없다", "관심은 있다", "검토를 지시했다", "예산 · 목표를 세웠다"] },
  { id: "r6", axis: "readiness", area: "현재 도구", q: "지금 업무에 쓰는 도구는 어떤 상태입니까?", options: ["대부분 종이 · 엑셀", "엑셀과 몇 가지 무료 도구", "패키지를 도입했지만 업무와 잘 맞지 않는다", "주요 업무는 시스템으로 관리한다"] },
];

export const axisLabel = { opportunity: "시스템화 효과", readiness: "데이터 준비도" };

/**
 * @typedef {{ id: string, title: string, summary: string, actions: string[], service: string, serviceHref: string }} ResultType
 * @type {Record<string, ResultType>}
 */
export const types = {
  leap: {
    id: "leap",
    title: "바로 시스템으로 옮길 수 있는 회사",
    summary: "엑셀로 처리하는 일이 많아 시스템으로 바꾸면 줄어드는 일이 큽니다. 데이터와 업무 규칙도 어느 정도 정리되어 있어, 바로 구축을 시작할 수 있습니다.",
    actions: ["가장 불편한 업무 하나를 골라 첫 시스템으로 만들기", "기존 엑셀 데이터를 클라우드 DB로 이전", "효과를 확인한 뒤 다른 업무로 넓히기"],
    service: "맞춤 업무 소프트웨어 개발",
    serviceHref: "/services#build",
  },
  guard: {
    id: "guard",
    title: "효과는 크지만, 데이터 정리가 먼저인 회사",
    summary: "시스템으로 바꾸면 줄어드는 일이 많습니다. 다만 데이터가 흩어져 있고 업무 규칙이 정해지지 않아, 바로 만들면 다시 엑셀로 돌아갈 수 있습니다. 데이터부터 정리하면 속도가 붙습니다.",
    actions: ["흩어진 엑셀 파일과 양식 현황 파악", "중복 데이터를 정리하고 하나의 DB 구조 설계", "시스템화 우선순위와 단계별 계획 수립"],
    service: "데이터 정리 진단",
    serviceHref: "/services#assess",
  },
  explore: {
    id: "explore",
    title: "기반은 갖췄고, 연결이 필요한 회사",
    summary: "데이터와 도구는 어느 정도 갖춰져 있습니다. 새로 크게 만들기보다, 지금 쓰는 도구를 서로 연결하고 빈 곳만 채우는 편이 효과적입니다.",
    actions: ["지금 쓰는 도구와 데이터 흐름 정리", "중복 입력이 생기는 지점을 연동으로 제거", "필요한 기능만 맞춤으로 추가"],
    service: "기존 솔루션 연동 · 맞춤화",
    serviceHref: "/services#integrate",
  },
  start: {
    id: "start",
    title: "작은 업무 하나부터 시작하기 좋은 회사",
    summary: "아직 시스템화의 필요와 기반이 모두 초기 단계입니다. 큰 투자보다, 가장 불편한 엑셀 하나를 정리해 효과를 직접 확인하는 편이 맞습니다.",
    actions: ["가장 자주 쓰는 엑셀 파일 하나 고르기", "그 데이터를 정리해 간단한 클라우드 화면으로 전환", "3개월 뒤 효과를 보고 다음 단계 결정"],
    service: "데이터 정리 진단",
    serviceHref: "/services#assess",
  },
};

// ---------- English ----------
// 문항 id · 축 · 보기 순서는 한국어와 같아야 합니다. 채점은 언어와 상관없이 같습니다.

/** @type {Question[]} */
export const questionsEn = [
  { id: "o1", axis: "opportunity", area: "Scattered data", q: "For a single area of work (orders, inventory, customers), how many spreadsheets or tools is the data spread across?", options: ["1–2", "3–5", "6–10", "More than 10"] },
  { id: "o2", axis: "opportunity", area: "Duplicate entry", q: "How often do you enter the same information into more than one file or system?", options: ["Almost never", "Sometimes", "Often", "Almost every day"] },
  { id: "o3", axis: "opportunity", area: "Compiling reports", q: "How many hours a week go into gathering and tidying data by hand for reports?", options: ["Under 1 hour", "1–4 hours", "4–8 hours", "More than 8 hours"] },
  { id: "o4", axis: "opportunity", area: "Versions & errors", q: "How often are you unsure which file is the latest, or have to re-check numbers that don't match?", options: ["Almost never", "A few times a month", "A few times a week", "Almost every day"] },
  { id: "o5", axis: "opportunity", area: "Field records", q: "Do you have work recorded in the field on paper, in photos, or in chat apps and then written up again later?", options: ["None", "Some", "Quite a lot", "It's core to our work"] },
  { id: "o6", axis: "opportunity", area: "People affected", q: "How many employees do this kind of data work?", options: ["Fewer than 5", "5–20", "20–50", "More than 50"] },

  { id: "r1", axis: "readiness", area: "Organized files", q: "How well organized are your business data and documents?", options: ["Scattered across personal PCs", "There's a shared folder, but it's disorganized", "Mostly organized", "Kept in set locations with set rules"] },
  { id: "r2", axis: "readiness", area: "Work rules", q: "Are your work steps and forms defined?", options: ["Everyone does it differently", "Only rough habits", "The main forms are defined", "Procedures and forms are documented"] },
  { id: "r3", axis: "readiness", area: "Cloud acceptance", q: "What is your company's position on keeping company data in the cloud?", options: ["Not allowed", "No clear policy", "Allowed if conditions are met", "We already use cloud services"] },
  { id: "r4", axis: "readiness", area: "Ownership", q: "Is someone assigned to lead a system rollout?", options: ["No one", "Someone is interested", "A person has been assigned", "There's a dedicated team or task force"] },
  { id: "r5", axis: "readiness", area: "Leadership commitment", q: "How committed is leadership to moving work into systems?", options: ["No particular interest", "Interested", "Has asked for a review", "Has set a budget and goals"] },
  { id: "r6", axis: "readiness", area: "Current tools", q: "What state are the tools you work with today in?", options: ["Mostly paper and spreadsheets", "Spreadsheets and a few free tools", "We adopted packaged software, but it doesn't fit our work well", "Our main work runs on systems"] },
];

export const axisLabelEn = { opportunity: "System Impact", readiness: "Data Readiness" };

/** @type {Record<string, ResultType>} */
export const typesEn = {
  leap: {
    id: "leap",
    title: "Ready to move to a system now",
    summary: "A lot of your work runs on spreadsheets, so moving to a system will take away a lot of effort. Your data and work rules are in reasonable shape, so you can start building right away.",
    actions: ["Pick your most painful task and make it your first system", "Migrate existing spreadsheet data to a cloud database", "Confirm the results, then extend to other work"],
    service: "Custom Business Software",
    serviceHref: "/en/services#build",
  },
  guard: {
    id: "guard",
    title: "High impact, but your data needs organizing first",
    summary: "Moving to a system would take away a lot of effort. But your data is scattered and your work rules aren't settled, so building right away could send you back to spreadsheets. Organize the data first and things will move faster.",
    actions: ["Take stock of your scattered spreadsheets and forms", "Clean up duplicate data and design a single database structure", "Set systemization priorities and a phased plan"],
    service: "Data Assessment",
    serviceHref: "/en/services#assess",
  },
  explore: {
    id: "explore",
    title: "The foundation is there — what you need is connection",
    summary: "Your data and tools are largely in place. Rather than building something big and new, connecting the tools you already use and filling only the gaps will work better.",
    actions: ["Map the tools you use and how data flows between them", "Remove duplicate entry by integrating at those points", "Add only the features you need, built to fit"],
    service: "Integration & Customization",
    serviceHref: "/en/services#integrate",
  },
  start: {
    id: "start",
    title: "A good fit for starting with one small task",
    summary: "Both the need for a system and the groundwork are still at an early stage. Rather than a big investment, it makes sense to tidy up your single most painful spreadsheet and see the effect for yourself.",
    actions: ["Pick the one spreadsheet you use most", "Clean up that data and turn it into a simple cloud screen", "Review the results after three months and decide the next step"],
    service: "Data Assessment",
    serviceHref: "/en/services#assess",
  },
};

/** 언어별 문항 · 축 이름 · 유형 */
export const locales = {
  ko: { questions, axisLabel, types },
  en: { questions: questionsEn, axisLabel: axisLabelEn, types: typesEn },
};

/**
 * 답변(문항 id → 0~3)을 받아 축별 점수와 유형을 계산합니다.
 * @param {Record<string, number>} answers
 * @param {"ko" | "en"} [lang] 결과 문구의 언어. 점수는 언어와 상관없이 같습니다.
 */
export function score(answers, lang = "ko") {
  const { questions, types } = locales[lang] ?? locales.ko;
  /** @type {Record<Axis, number>} */
  const sum = { opportunity: 0, readiness: 0 };
  /** @type {{ id: string, axis: Axis, area: string, value: number }[]} */
  const areas = [];
  for (const q of questions) {
    const v = answers[q.id];
    if (!Number.isInteger(v) || v < 0 || v > 3) throw new Error(`invalid answer: ${q.id}`);
    sum[q.axis] += v;
    areas.push({ id: q.id, axis: q.axis, area: q.area, value: v });
  }
  const pct = (/** @type {number} */ n) => Math.round((n / 18) * 100);
  const opportunity = pct(sum.opportunity);
  const readiness = pct(sum.readiness);
  const hiO = opportunity >= 50;
  const hiR = readiness >= 50;
  const type = hiO ? (hiR ? types.leap : types.guard) : hiR ? types.explore : types.start;
  return { opportunity, readiness, overall: Math.round((opportunity + readiness) / 2), type, areas };
}
