import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/supabase/auth-guard"

// PATCH /api/profile/password — { "currentPassword": "...", "newPassword": "..." }
export async function PATCH(request: Request) {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const body = await request.json().catch(() => null)
  const { currentPassword, newPassword } = body ?? {}

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both current and new password are required." }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 })
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
  }

  // Supabase has no direct "verify current password" call, so we re-authenticate
  // with it — this fails fast if the current password is wrong.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  if (verifyError) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 })
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
