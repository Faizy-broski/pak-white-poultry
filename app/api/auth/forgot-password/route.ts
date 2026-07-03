import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { email } = body ?? {}

  if (!email) {
    return NextResponse.json({ error: "Enter your email." }, { status: 400 })
  }

  const supabase = await createClient()
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  })

  // Always return success — don't reveal whether the email exists.
  if (error) {
    console.error("resetPasswordForEmail failed:", error.message)
  }

  return NextResponse.json({ success: true })
}
