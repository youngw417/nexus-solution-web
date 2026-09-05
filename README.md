# nexus-ai-sol.com

Under-construction page for **Nexus Solution**, deployed to Azure Static Web Apps.

| File | Purpose |
| --- | --- |
| `index.html` | The page. Self-contained apart from Google Fonts. |
| `favicon.svg` | Browser tab icon (logo mark only). |
| `apple-touch-icon.png` | 180×180 iOS home-screen icon. |
| `og.png` | 1200×630 link-preview image for KakaoTalk / social shares. |
| `staticwebapp.config.json` | Azure SWA routing and headers. |

## Deploy

Pushing to `main` triggers `.github/workflows/azure-static-web-apps.yml`,
which uploads the repository root to Azure Static Web Apps. No build step.

Required repository secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
(Azure Portal → the Static Web App → **Manage deployment token**).

## Domain

`nexus-ai-sol.com` is registered at Bluehost, with DNS delegated to Cloudflare
(Bluehost does not support ALIAS/ANAME records, which the apex domain needs).
