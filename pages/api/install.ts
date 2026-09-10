import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const appSlug = process.env.GITHUB_APP_SLUG
  if (!appSlug) {
    res.status(500).send("GITHUB_APP_SLUG not configured")
    return
  }

  res.redirect(
    302,
    `https://github.com/apps/${encodeURIComponent(appSlug)}/installations/new`
  )
}
