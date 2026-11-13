// English version of content.ts — same structure, same order. When you change one file, change the other too.
import type { Service, Case, Industry } from "./content";

export const process = [
  { n: "01", title: "Assess", en: "Assess", body: "We look at your spreadsheets, documents, and current workflow firsthand and decide what should become a system." },
  { n: "02", title: "Design", en: "Design", body: "We design the cloud database and screens, and prioritize the features that will make the biggest difference." },
  { n: "03", title: "Build", en: "Build", body: "We build in two-week cycles with a demo each time, testing and refining with your real data." },
  { n: "04", title: "Migrate & train", en: "Launch", body: "We move your existing spreadsheet data over and train your team so they can use it from day one." },
  { n: "05", title: "Run & improve", en: "Run", body: "We handle hosting and maintenance, and keep building in the requests that come up as you use it." },
];

// Prices are not published on the site or in the brochure. Quotes are given per company after a consultation.
export const services: Service[] = [
  {
    id: "assess",
    image: "/illustrations/en/excel-to-db.svg",
    role: "Entry",
    name: "Data Assessment",
    budget: "Business data assessment and systemization plan",
    format: ["2–3 weeks", "Interviews by department", "Review of real spreadsheets and documents"],
    includes: [
      "Map of where your data lives",
      "Duplicate, error, and gap analysis",
      "Cloud database design",
      "Systemization priorities",
    ],
    deliverables: "Data status report · database design · phased roadmap and quote",
    fit: "Companies with so many spreadsheets they don't know where to start",
    note: "If you go on to a build contract, the assessment fee is deducted from the build cost.",
  },
  {
    id: "build",
    image: "/illustrations/en/custom-app.svg",
    role: "Core",
    name: "Custom Business Software",
    budget: "Business system development · digital transformation (DX)",
    format: ["From 6 weeks", "Demo every two weeks", "Tested with real data"],
    includes: [
      "Migration of existing spreadsheet data",
      "Web and mobile business apps",
      "Permissions and approval flows",
      "Dashboards and automated reports",
      "Field photos and document evidence",
      "One year of operations and improvements",
    ],
    deliverables: "A working system · operations manual · staff training",
    fit: "Companies getting by on spreadsheets because off-the-shelf software doesn't fit their work",
  },
  {
    id: "run",
    image: "/illustrations/en/ops-report.svg",
    role: "Operations",
    name: "Managed Operations",
    budget: "System maintenance and operations support",
    format: ["Monthly contract", "Monthly operations report", "Regular improvement meetings"],
    includes: [
      "Cloud hosting and backups",
      "Issue response",
      "Monthly feature improvements",
      "Usage reports",
    ],
    deliverables: "A stable, running system · monthly operations report · change history",
    fit: "Companies that want a dependable system without an in-house IT person",
  },
  {
    id: "integrate",
    image: "/illustrations/en/integrate.svg",
    role: "Optional",
    name: "Integration & Customization",
    budget: "Existing system integration and customization",
    format: ["From 4 weeks, depending on scope", "Review of current systems", "Demo at each stage"],
    includes: [
      "Rollout and customization of open-source ERP and accounting, such as Odoo",
      "Groupware and accounting software integration",
      "Online store and third-party data integration",
      "Removal of duplicate entry",
    ],
    deliverables: "Connected systems · data flow diagram · operations manual",
    fit: "Companies that want to keep the tools they have and fill only the gaps",
    note: "When building something new isn't the answer, we find a good tool and fit it to your company.",
  },
  {
    id: "ai",
    image: "/illustrations/en/ai-extract.svg",
    role: "Add-on",
    name: "AI Add-ons",
    budget: "AI features and workflow automation",
    format: ["With a build or on its own", "Includes internal AI usage guidelines"],
    includes: [
      "Automatic extraction from receipts, contracts, and forms",
      "Q&A over your company data",
      "Automated report generation",
      "AI connected to your existing software",
    ],
    deliverables: "A system with AI features built in · internal AI usage guidelines",
    fit: "Companies whose data is in order and who want to add AI as the next step",
  },
];

// Cases are described by what changed, without naming the client or its industry.
export const cases: Case[] = [
  {
    id: "field-form",
    image: "/illustrations/en/field-form.svg",
    label: "Digital field forms",
    title: "From paper and spreadsheet checklists to mobile entry and automatic reports",
    summary: "Inspection and reporting forms that were filled out on paper or in spreadsheets moved to a mobile app, so every entry lands in the database the moment it's made.",
    before: ["Written by hand on paper forms", "Retyped into a spreadsheet back at the office", "Everyone used a different version of the form", "Reports compiled by hand every time"],
    after: ["Entered on a phone, on site", "Saved to the cloud database on entry", "Everyone uses the same current form", "Reports generated with one button"],
    features: ["Mobile entry", "Form versioning", "Automatic reports", "Review and approval flow"],
    fitsFor: "Manufacturing quality checks, equipment maintenance logs, construction daily reports, facility safety inspections",
  },
  {
    id: "photo-evidence",
    image: "/illustrations/en/photo-evidence.svg",
    label: "Field photo evidence",
    title: "Location, time, and job details recorded automatically with every photo",
    summary: "Field photos that used to be passed around in chat apps are now filed by job automatically, along with when, where, and what was photographed.",
    before: ["Photos sent to a group chat", "Guessing which job a photo belongs to from its file name", "Digging through chat history to find a photo", "Too little detail to use as evidence"],
    after: ["Pick the job in the app and shoot", "Location, time, and job details recorded automatically", "Photos grouped by job and searchable", "Exported straight to an evidence report"],
    features: ["Photos by job", "Automatic location and time", "Search", "Evidence report export"],
    fitsFor: "Construction and defect management, equipment installation checks, delivery inspection, facility management",
  },
  {
    id: "erp",
    image: "/illustrations/en/erp-dashboard.svg",
    label: "Tailored open-source ERP",
    title: "Accounting and inventory in one place, fitted to the company",
    summary: "We adapted an open-source ERP (Odoo) to the company's accounting and inventory work, rolled it out, and migrated the spreadsheet ledgers that had been scattered around.",
    before: ["Accounting, inventory, and customers each in a separate spreadsheet", "The same data entered several times", "Numbers that didn't match at every month-end close", "Packaged ERP was expensive and didn't fit the work"],
    after: ["Accounting, inventory, and customers in one system", "Enter once and related ledgers update automatically", "Faster month-end close with matching numbers", "Only the features the company needs, added to fit"],
    features: ["Accounting", "Inventory", "Customer management", "Spreadsheet ledger migration"],
    fitsFor: "Small and mid-sized manufacturers and distributors, and rollouts done together with accounting and tax firms",
  },
];

export const industries: Industry[] = [
  {
    id: "manufacturing",
    name: "Manufacturing",
    en: "Manufacturing",
    summary: "Small and mid-sized manufacturers whose production, inventory, and quality records live in spreadsheets, and whose processes don't fit packaged ERP.",
    examples: ["Production output and defect records", "Raw material and inventory management", "Quality inspection forms", "Equipment maintenance history"],
  },
  {
    id: "education",
    name: "Education",
    en: "Schools · Academies",
    summary: "International schools, private schools, and academies that manage students, classes, grades, and parent communication across several tools.",
    examples: ["Student and enrollment management", "Grades and attendance", "Parent notices and consultation records", "Instructor scheduling"],
  },
  {
    id: "distribution",
    name: "Distribution & Wholesale",
    en: "Distribution",
    summary: "Distributors and wholesalers that handle orders, inventory, and customers through spreadsheets and chat apps.",
    examples: ["Order intake and shipping", "Customer pricing and receivables", "Inventory dashboard", "Online store order integration"],
  },
  {
    id: "professional",
    name: "Professional Services",
    en: "Professional Services",
    summary: "Accounting, tax, and labor consulting firms that spend a lot of time collecting client documents and processing evidence.",
    examples: ["Client document collection portal", "Automatic evidence extraction (AI)", "Work progress tracking", "Open-source ERP integration"],
  },
];

// Used by the About page.
export const capabilities = [
  { name: "Data", en: "Data", body: "We organize the data scattered across spreadsheets and documents into a single cloud database. Every system starts from clean data." },
  { name: "Engineering", en: "Engineering", body: "We build web and mobile software around your workflow ourselves. Where it helps, we use proven open source such as Odoo, and AI." },
  { name: "Operations", en: "Operations", body: "We don't build and walk away. We handle hosting and maintenance, and keep building in the requests that come up as you use it." },
];

export const principles = [
  { title: "We start small", body: "We turn your single most painful task into a system first, confirm it works, and then expand. We don't push a big contract up front." },
  { title: "We build only what's needed", body: "If a good tool already exists, we recommend fitting it to your company. We build new only where your company truly needs it." },
  { title: "Your data is yours", body: "All data belongs to the client and can be downloaded at any time. Access control and backups are part of the design from the start." },
  { title: "We stay close", body: "We come on site quickly when you need us." },
];
