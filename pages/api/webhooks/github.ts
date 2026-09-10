import type { NextApiRequest, NextApiResponse } from "next"
import { Webhooks } from "@octokit/webhooks"

// The signature covers the exact bytes GitHub sent, so the body has to reach verification unparsed; letting Next parse and re-serialize it rejects every legitimate delivery.
export const config = { api: { bodyParser: false } }

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET || ""
})

webhooks.onAny(async ({ id, name }) => {
  console.log(`GitHub event: ${name} (${id})`)
})

async function readRawBody(req: NextApiRequest) {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString("utf8")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed")
    return
  }

  const signature = req.headers["x-hub-signature-256"]
  const id = req.headers["x-github-delivery"]
  const event = req.headers["x-github-event"]

  if (
    typeof signature !== "string" ||
    typeof id !== "string" ||
    typeof event !== "string"
  ) {
    res.status(400).send("Missing GitHub headers")
    return
  }

  try {
    await webhooks.verifyAndReceive({
      id,
      name: event as Parameters<typeof webhooks.verifyAndReceive>[0]["name"],
      payload: await readRawBody(req),
      signature
    })
    res.status(200).send("OK")
  } catch (err) {
    console.error("Webhook verification failed:", err)
    res.status(401).send("Invalid signature")
  }
}
