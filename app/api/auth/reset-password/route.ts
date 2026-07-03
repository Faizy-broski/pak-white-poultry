import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

// Expects the Supabase recovery session to already be active in cookies.
// The reset-password page should call `supabase.auth.exchangeCodeForSession(code)`
// (client-side, using lib/supabase/client.ts) as soon as it loads with a
// `?code=` param from the emailed link, before calling this route.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { password } = body ?? {}

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Reset link expired or invalid. Request a new one." },
      { status: 401 }
    )
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
