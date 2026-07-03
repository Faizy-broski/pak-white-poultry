import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { fullName, email, phone, password } = body ?? {}

  if (!fullName || !email || !phone || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
      // The trigger public.handle_new_user() creates the profiles row automatically.
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    user: data.user,
    // If email confirmation is enabled in your Supabase project, there's no
    // session yet — the client should show a "check your email" state.
    session: data.session,
  })
}
