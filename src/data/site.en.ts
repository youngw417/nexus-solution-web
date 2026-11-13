// English version of site.ts. Phone, email, registration number and file paths come from site.ts;
// only the wording below is different.
import { site as ko } from "./site";

export const site = {
  ...ko,
  tagline: "Software built to fit your business.",
  sub: "We bring your scattered data into the cloud, build software around the way your company works, and keep it running.",
  english: "Custom Software Built Around Your Business",
  // 대표자 영문 표기 — 여권 등 공식 표기와 다르면 고쳐 주세요.
  ceo: "Young Won",
  phone: "+82 10-5023-5369",
  // English brochure PDF — made by `npm run brochure` together with the Korean one.
  brochure: "/nexus-solution-brochure-en.pdf",
  address: "102-408, 4 Pangyodaejang-ro 2-gil, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
};

export const nav = [
  { href: "/en/services", label: "Services" },
  { href: "/en/cases", label: "Cases & Industries" },
  { href: "/en/diagnosis", label: "Readiness Check" },
  { href: "/en/resources", label: "Resources" },
  { href: "/en/about", label: "About" },
];
