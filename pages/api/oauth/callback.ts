import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (!code) {
    res.status(400).send("Missing code")
    return
  }

  try {
    const params = new URLSearchParams()
    params.set("client_id", process.env.GITHUB_OAUTH_CLIENT_ID || "")
    params.set("client_secret", process.env.GITHUB_OAUTH_CLIENT_SECRET || "")
    params.set("code", String(code))

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: params
    })

    const body = await tokenResponse.json()

    if (body.error) {
      console.error("OAuth error:", body.error)
      res.status(400).json(body)
      return
    }

    // The access token is deliberately not logged: it grants the same access as the user who just authorized.
    res.status(200).send("GitHub OAuth successful. You can close this window.")
  } catch (err) {
    console.error("OAuth callback error:", err)
    res.status(500).send("Internal Server Error")
  }
}
