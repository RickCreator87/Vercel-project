# Vercel-project

Webhooks, OAuth callbacks, and install flows for GitDigital GitHub Apps, deployed on Vercel.

## Endpoints

| Route | Purpose |
| --- | --- |
| `/api/webhooks/github` | Receives GitHub App webhook deliveries and verifies their signature |
| `/api/oauth/callback` | Exchanges an OAuth `code` for an access token |
| `/api/install` | Redirects to the GitHub App's installation page |

## Environment variables

Set these in the Vercel project, and locally in `.env.local`, which is ignored so real values never reach the repository.

| Name | Used by |
| --- | --- |
| `GITHUB_APP_SLUG` | `/api/install`, to build the installation URL |
| `GITHUB_OAUTH_CLIENT_ID` | `/api/oauth/callback` |
| `GITHUB_OAUTH_CLIENT_SECRET` | `/api/oauth/callback` |
| `GITHUB_WEBHOOK_SECRET` | `/api/webhooks/github`, to verify delivery signatures |

## Local development

```bash
npm install
npm run dev
```
