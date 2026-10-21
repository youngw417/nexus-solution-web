# nexus-ai-sol.com

Website for **Nexus Solution**: Astro + Tailwind, with a React island for the
AI readiness diagnostic, deployed to Azure Static Web Apps.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + static build into dist/
```

## Layout

| Path | Purpose |
| --- | --- |
| `src/pages/` | 홈 · 서비스 · 업무별 AI 활용 · AI 준비도 진단 · 자료실 · 회사 소개 · 상담 문의 · 404 |
| `src/data/site.ts` | Company details, nav, and switches: 사업자등록번호, brochure PDF path, Cal.com link |
| `src/data/content.ts` | Copy shared across pages: services, 5-step process, department scenarios |
| `api/shared/diagnosis.mjs` | Diagnostic questions, scoring and result types — used by both the site and the API |
| `api/src/functions/lead.js` | `POST /api/lead` — contact / brochure / diagnosis-report requests, sent via Resend |
| `public/` | Logos, favicon, OG image, `staticwebapp.config.json` |

## Deploy

Pushing to `main` runs `.github/workflows/azure-static-web-apps.yml`: it builds
the site, then uploads `dist/` and the `api/` Functions app. Pull requests get a
preview environment.

Required repository secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`.

### API settings (Azure Portal → Static Web App → Environment variables)

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. Without it the API returns 503 and the forms fall back to "send by email". |
| `LEAD_FROM` | Sender on a Resend-verified domain, e.g. `Nexus Solution <hello@nexus-ai-sol.com>` |
| `LEAD_TO` | Where leads go (default `info@nexus-ai-sol.com`) |

Verifying the domain in Resend adds SPF/DKIM records in Cloudflare; keep the
existing Titan MX/SPF records and merge the SPF include rather than adding a second SPF record.

## Domain

`nexus-ai-sol.com` is registered at Bluehost, with DNS delegated to Cloudflare
(Bluehost does not support ALIAS/ANAME records, which the apex domain needs).
