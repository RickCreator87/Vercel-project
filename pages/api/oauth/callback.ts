7. api/oauth/callback.ts

Handles OAuth callback and exchanges code for an access token.

`ts
import type { VercelRequest, VercelResponse } from "@vercel/node"
import fetch from "node-fetch"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, state } = req.query

  if (!code) {
    res.status(400).send("Missing code")
    return
  }

  try {
    const params = new URLSearchParams()
    params.set("clientid", process.env.GITHUBOAUTHCLIENTID || "")
    params.set("clientsecret", process.env.GITHUBOAUTHCLIENTSECRET || "")
    params.set("code", String(code))

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: params
    })

    const json = (await tokenRes.json()) as any

    if (json.error) {
      console.error("OAuth error:", json)
      res.status(400).json(json)
      return
    }

    // TODO: store json.access_token somewhere (DB, KV, etc.)
    console.log("OAuth token response:", json)

    res.status(200).send("GitHub OAuth successful. You can close this window.")
  } catch (err) {
    console.error("OAuth callback error:", err)
    res.status(500).send("Internal Server Error")
  }
}
`

