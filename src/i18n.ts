// 언어 전환 — 한국어는 / 아래, 영어는 /en 아래에 같은 구조로 둡니다.
// 페이지 문구는 src/pages/ (한국어) 와 src/pages/en/ (영어) 에, 공통 문구는 data/content.ts 와 data/content.en.ts 에 있습니다.
// 헤더 · 푸터 · 문의 양식처럼 두 언어가 함께 쓰는 부품의 문구는 아래 ui 에서 관리합니다.

export type Lang = "ko" | "en";

/** 주소가 /en 으로 시작하면 영어 페이지입니다. */
export function langOf(url: URL): Lang {
  return /^\/en(\/|$)/.test(url.pathname) ? "en" : "ko";
}

/** 사이트 안 경로를 해당 언어의 경로로 바꿉니다. 예) ("/contact", "en") → "/en/contact" */
export function localePath(href: string, lang: Lang): string {
  const bare = href.replace(/^\/en(?=\/|$|#)/, "") || "/";
  if (lang === "ko") return bare;
  return bare === "/" ? "/en" : `/en${bare}`;
}

export const ui = {
  ko: {
    htmlLang: "ko",
    ogLocale: "ko_KR",
    titleDefault: "회사에 꼭 맞는 소프트웨어",
    description:
      "Nexus Solution은 엑셀과 문서에 흩어진 데이터를 클라우드로 모으고, 회사에 꼭 맞는 업무 소프트웨어를 만들어 운영까지 맡습니다. 판교 기반 맞춤 소프트웨어 개발 · 오픈소스 ERP 연동 · AI 부가 서비스.",
    skip: "본문으로 건너뛰기",
    home: "Nexus Solution 홈",
    mainMenu: "주 메뉴",
    mobileMenu: "모바일 메뉴",
    footerMenu: "하단 메뉴",
    openMenu: "메뉴 열기",
    contact: "상담 문의",
    toDark: "어두운 화면으로 전환",
    toLight: "밝은 화면으로 전환",
    langSwitch: "언어 선택",
    ceo: "대표",
    bizRegNo: "사업자등록번호",
    cta: {
      eyebrow: "무료 시스템화 진단",
      title: "어디서부터 시스템으로 바꿀지, 3분이면 보입니다",
      body: "12개 문항에 답하면 시스템화 효과와 데이터 준비도를 바로 확인할 수 있습니다. 이메일 없이 시작합니다.",
      start: "진단 시작하기",
    },
    form: {
      submit: "상담 신청하기",
      messageLabel: "문의 내용",
      messagePlaceholder: "현재 불편한 업무나 궁금한 점을 적어 주세요. (예: 주문 · 재고를 엑셀 5개로 관리하는데 하나로 합치고 싶습니다)",
      company: "회사명",
      name: "성함 · 직책",
      namePlaceholder: "홍길동 과장",
      email: "이메일",
      phone: "연락처",
      phonePlaceholder: "010-0000-0000",
      interest: "관심 서비스",
      interestNone: "아직 정하지 않았습니다",
      consent: "상담을 위한 개인정보(회사명, 성함, 이메일, 연락처) 수집·이용에 동의합니다. 수집한 정보는 상담 목적으로만 사용하며 상담 종료 후 1년간 보관합니다.",
      sending: "보내는 중…",
      doneTitle: "접수되었습니다. 감사합니다.",
      doneBody: "영업일 기준 3일 안에 {email}로 연락드리겠습니다. 급하시면 {phone}로 전화 주세요.",
      failed: "전송에 실패했습니다.",
      byMail: "메일로 보내기",
      orCall: "또는 {phone}로 연락 주세요.",
      mailSubject: "[웹사이트 문의]",
      mailCompany: "회사명",
      mailName: "성함",
      mailEmail: "이메일",
      mailPhone: "연락처",
      mailInterest: "관심 서비스",
    },
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    titleDefault: "Custom Software Built Around Your Business",
    description:
      "Nexus Solution brings the data scattered across your spreadsheets and documents into the cloud, builds business software that fits the way your company works, and keeps it running. Custom software development, open-source ERP integration, and AI add-ons.",
    skip: "Skip to content",
    home: "Nexus Solution home",
    mainMenu: "Main menu",
    mobileMenu: "Mobile menu",
    footerMenu: "Footer menu",
    openMenu: "Open menu",
    contact: "Contact",
    toDark: "Switch to dark mode",
    toLight: "Switch to light mode",
    langSwitch: "Language",
    ceo: "CEO",
    bizRegNo: "Business registration no.",
    cta: {
      eyebrow: "Free readiness check",
      title: "See where to start in three minutes",
      body: "Answer 12 questions to see your system impact and data readiness right away. No email needed to start.",
      start: "Start the check",
    },
    form: {
      submit: "Request a consultation",
      messageLabel: "Message",
      messagePlaceholder: "Tell us what's slowing you down or what you'd like to know. (e.g. We track orders and inventory in five spreadsheets and want to bring them together.)",
      company: "Company",
      name: "Name & title",
      namePlaceholder: "Jane Kim, Manager",
      email: "Email",
      phone: "Phone",
      phonePlaceholder: "+82 10-0000-0000",
      interest: "Service of interest",
      interestNone: "Not sure yet",
      consent: "I agree to the collection and use of my personal information (company, name, email, phone) for this consultation. It is used only for that purpose and kept for one year after the consultation ends.",
      sending: "Sending…",
      doneTitle: "Thank you. We've received your request.",
      doneBody: "We'll reply to {email} within three business days. If it's urgent, call us at {phone}.",
      failed: "We couldn't send your request.",
      byMail: "Send it by email",
      orCall: "or call us at {phone}.",
      mailSubject: "[Website inquiry]",
      mailCompany: "Company",
      mailName: "Name",
      mailEmail: "Email",
      mailPhone: "Phone",
      mailInterest: "Service of interest",
    },
  },
} as const;
