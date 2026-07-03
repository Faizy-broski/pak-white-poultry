import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { email, password } = body ?? {}

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", data.user.id)
    .single()

  return NextResponse.json({
    user: data.user,
    role: profile?.role ?? "customer",
  })
}
