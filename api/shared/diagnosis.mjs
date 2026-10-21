// AI 준비도 진단 — 문항, 채점, 유형. 사이트(React)와 API(리포트 메일)가 함께 씁니다.
// 모든 문항은 보기 4개, 점수는 0~3점. 축별 6문항이므로 축당 만점 18점.

/** @typedef {"opportunity" | "readiness"} Axis */
/** @typedef {{ id: string, axis: Axis, area: string, q: string, options: string[] }} Question */

/** @type {Question[]} */
export const questions = [
  // 기회 크기 — 높을수록 AI로 줄일 수 있는 업무가 많습니다
  { id: "o1", axis: "opportunity", area: "문서 작업", q: "보고서·제안서·공문 같은 문서 작성에 직원 한 명이 일주일에 쓰는 시간은?", options: ["3시간 미만", "3~8시간", "8~15시간", "15시간 이상"] },
  { id: "o2", axis: "opportunity", area: "반복 업무", q: "매번 비슷한 형식으로 반복되는 문서·데이터 작업은 업무의 어느 정도입니까?", options: ["거의 없다", "일부 (25% 미만)", "상당 부분 (25~50%)", "대부분 (50% 이상)"] },
  { id: "o3", axis: "opportunity", area: "정보 탐색", q: "필요한 자료·규정·과거 문서를 찾는 데 하루에 쓰는 시간은?", options: ["10분 미만", "10~30분", "30분~1시간", "1시간 이상"] },
  { id: "o4", axis: "opportunity", area: "데이터 정리", q: "엑셀 등으로 데이터를 수작업으로 취합·정리하는 일은 얼마나 자주 있습니까?", options: ["거의 없다", "한 달에 몇 번", "일주일에 몇 번", "거의 매일"] },
  { id: "o5", axis: "opportunity", area: "커뮤니케이션", q: "이메일 작성, 문의 응대, 회의록 정리에 드는 시간은 어느 정도입니까?", options: ["거의 없다", "하루 30분 미만", "하루 30분~1시간", "하루 1시간 이상"] },
  { id: "o6", axis: "opportunity", area: "영향 범위", q: "위와 같은 문서·데이터 업무를 하는 직원은 몇 명입니까?", options: ["5명 미만", "5~20명", "20~50명", "50명 이상"] },

  // 준비도 — 높을수록 바로 도입을 시작할 수 있습니다
  { id: "r1", axis: "readiness", area: "현재 사용", q: "직원들이 업무에 AI 도구(ChatGPT, Copilot 등)를 쓰고 있습니까?", options: ["전혀 쓰지 않는다", "일부가 개인적으로 쓴다", "여러 부서에서 개인적으로 쓴다", "회사 차원에서 도입했다"] },
  { id: "r2", axis: "readiness", area: "사용 정책", q: "사내 AI 사용 규정이 있습니까?", options: ["없고 논의도 없다", "필요성을 논의 중이다", "초안이 있다", "규정을 시행 중이다"] },
  { id: "r3", axis: "readiness", area: "보안 기준", q: "보안 문제로 AI 사용을 제한하고 계십니까?", options: ["전면 금지했다", "기준이 불명확해 사실상 못 쓴다", "일부 허용 기준이 있다", "데이터 등급별 기준에 따라 허용한다"] },
  { id: "r4", axis: "readiness", area: "추진 주체", q: "AI 도입을 주관할 담당자가 정해져 있습니까?", options: ["없다", "관심 있는 사람은 있다", "담당자가 지정됐다", "전담 조직·TF가 있다"] },
  { id: "r5", axis: "readiness", area: "경영진 의지", q: "경영진의 AI 도입 의지는 어느 정도입니까?", options: ["특별한 관심이 없다", "관심은 있다", "검토를 지시했다", "예산·목표를 세웠다"] },
  { id: "r6", axis: "readiness", area: "자료 정리", q: "사내 문서와 데이터는 얼마나 정리되어 있습니까?", options: ["개인 PC에 흩어져 있다", "공유 폴더는 있지만 정리가 안 됐다", "대체로 정리되어 있다", "문서관리 시스템으로 관리한다"] },
];

export const axisLabel = { opportunity: "AI 기회 크기", readiness: "도입 준비도" };

/**
 * @typedef {{ id: string, title: string, summary: string, actions: string[], service: string, serviceHref: string }} ResultType
 * @type {Record<string, ResultType>}
 */
export const types = {
  leap: {
    id: "leap",
    title: "바로 실행할 준비가 된 회사",
    summary: "AI로 줄일 수 있는 업무가 많고, 도입을 받쳐 줄 기반도 갖춰져 있습니다. 지금 필요한 것은 우선순위를 정해 실제로 업무를 바꾸는 일입니다.",
    actions: ["효과가 가장 큰 업무 2~3개를 골라 파일럿 진행", "도입 효과를 측정해 전사 확대 근거 마련", "반복 업무는 자동화 시스템으로 굳히기"],
    service: "AI 전환 컨설팅",
    serviceHref: "/services#consulting",
  },
  guard: {
    id: "guard",
    title: "기회는 크지만, 기준이 먼저인 회사",
    summary: "AI로 줄일 수 있는 업무가 많습니다. 다만 사용 기준과 추진 주체가 정해지지 않아 도입이 멈출 가능성이 큽니다. 기준을 먼저 세우면 속도가 붙습니다.",
    actions: ["사내 AI 사용 규정과 데이터 등급별 기준 수립", "AI 도입 담당자 지정", "기준 안에서 효과가 큰 업무부터 시범 적용"],
    service: "AI 사용 정책 · 보안 가이드라인 수립",
    serviceHref: "/services#policy",
  },
  explore: {
    id: "explore",
    title: "준비는 됐고, 쓸 곳을 찾을 때인 회사",
    summary: "AI를 받아들일 기반은 갖춰져 있지만, 어떤 업무에 써야 효과가 큰지 아직 분명하지 않습니다. 부서별로 적용 후보를 찾는 것이 첫 단계입니다.",
    actions: ["부서별 시간이 많이 드는 업무 목록 만들기", "현업 담당자와 함께 AI 적용 후보 도출", "효과·난이도 기준으로 우선순위 정하기"],
    service: "AI 디스커버리 워크숍",
    serviceHref: "/services#workshop",
  },
  start: {
    id: "start",
    title: "작게 시작하기 좋은 회사",
    summary: "아직 AI 도입의 필요와 기반이 모두 초기 단계입니다. 큰 투자보다, 한 부서에서 작게 시도해 효과를 직접 확인하는 편이 맞습니다.",
    actions: ["관심 있는 한 부서에서 실무 워크숍 진행", "개인 수준의 안전한 사용 수칙부터 공유", "3개월 뒤 효과를 보고 다음 단계 결정"],
    service: "AI 디스커버리 워크숍",
    serviceHref: "/services#workshop",
  },
};

/**
 * 답변(문항 id → 0~3)을 받아 축별 점수와 유형을 계산합니다.
 * @param {Record<string, number>} answers
 */
export function score(answers) {
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
