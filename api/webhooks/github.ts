6. api/webhooks/github.ts

Minimal GitHub App webhook receiver with signature verification.

`ts
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { Webhooks } from "@octokit/webhooks"

const webhooks = new Webhooks({
  secret: process.env.GITHUBWEBHOOKSECRET || ""
})

webhooks.onAny(async ({ id, name, payload }) => {
  console.log(GitHub event: ${name} (${id}))
  // TODO: route by repo, installation, or app logic
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed")
    return
  }

  const signature = req.headers["x-hub-signature-256"] as string | undefined
  const id = req.headers["x-github-delivery"] as string | undefined
  const event = req.headers["x-github-event"] as string | undefined

  if (!signature || !id || !event) {
    res.status(400).send("Missing GitHub headers")
    return
  }

  try {
    await webhooks.verifyAndReceive({
      id,
      name: event as any,
      payload: req.body,
      signature
    })
    res.status(200).send("OK")
  } catch (err) {
    console.error("Webhook verification failed:", err)
    res.status(401).send("Invalid signature")
  }
}
`

> In Vercel, make sure “Body parsing” is disabled for this route or send raw body; if needed we can adjust this to use buffer + manual verification.

