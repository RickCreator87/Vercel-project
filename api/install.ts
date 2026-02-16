8. api/install.ts

Simple endpoint you can use as an install landing or redirector.

`ts
import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const appId = process.env.GITHUBAPPID
  if (!appId) {
    res.status(500).send("GITHUBAPPID not configured")
    return
  }

  const url = `https://github.com/apps/${encodeURIComponent(
    "YOURAPPSLUG_HERE"
  )}/installations/new`

  res.redirect(302, url)
}
`

Replace YOURAPPSLUG_HERE with your GitHub App slug.

