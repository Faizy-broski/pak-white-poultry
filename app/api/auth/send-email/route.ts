import { NextResponse } from "next/server"
import { Webhook } from "standardwebhooks"

import { resend, EMAIL_FROM } from "@/lib/email/resend"
import {
  confirmSignupEmail,
  resetPasswordEmail,
  magicLinkEmail,
  emailChangeEmail,
  inviteEmail,
} from "@/lib/email/templates"

// Where /auth/confirm should send people after verifying each link type
const NEXT_PATH_BY_TYPE: Record<string, string> = {
  signup: "/dashboard",
  recovery: "/auth/reset-password",
  invite: "/auth/reset-password",
  magiclink: "/dashboard",
  email_change: "/dashboard/profile",
}

type HookPayload = {
  user: { email: string }
  email_data: {
    token_hash: string
    redirect_to: string
    email_action_type: keyof typeof NEXT_PATH_BY_TYPE
    site_url: string
  }
}

export async function POST(request: Request) {
  const secret = process.env.SEND_EMAIL_HOOK_SECRET
  if (!secret) {
    console.error("SEND_EMAIL_HOOK_SECRET is not set")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  // Signature verification requires the RAW body — don't call request.json() first
  const rawBody = await request.text()
  const headers = Object.fromEntries(request.headers)

  let payload: HookPayload
  try {
    const wh = new Webhook(secret)
    payload = wh.verify(rawBody, headers) as HookPayload
  } catch (err) {
    console.error("Send Email Hook: signature verification failed", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const { user, email_data } = payload
  const { token_hash, email_action_type, site_url } = email_data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site_url

  const nextPath = NEXT_PATH_BY_TYPE[email_action_type] ?? "/dashboard"
  const confirmUrl = `${siteUrl}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&next=${encodeURIComponent(nextPath)}`

  const template =
    email_action_type === "recovery"
      ? resetPasswordEmail(confirmUrl)
      : email_action_type === "magiclink"
        ? magicLinkEmail(confirmUrl)
        : email_action_type === "email_change"
          ? emailChangeEmail(confirmUrl)
          : email_action_type === "invite"
            ? inviteEmail(confirmUrl)
            : confirmSignupEmail(confirmUrl)

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: user.email,
      subject: template.subject,
      html: template.html,
    })
  } catch (err) {
    console.error("Send Email Hook: Resend failed to send", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }

  return NextResponse.json({}, { status: 200 })
}