import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/supabase/auth-guard"
import { serializeProfile } from "@/lib/api/serializers"

export async function GET() {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.userId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 })
  }

  return NextResponse.json({ profile: serializeProfile(data) })
}

// PATCH /api/profile — General tab fields and/or notification toggles.
// Body example:
// { "fullName": "...", "phone": "...", "notifications": { "newOrders": true } }
export async function PATCH(request: Request) {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const body = await request.json().catch(() => null)
  const updates: Record<string, unknown> = {}

  if (body?.fullName !== undefined) updates.full_name = body.fullName
  if (body?.phone !== undefined) updates.phone = body.phone
  if (body?.address !== undefined) updates.address = body.address
  if (body?.city !== undefined) updates.city = body.city
  if (body?.avatarUrl !== undefined) updates.avatar_url = body.avatarUrl
  if (body?.twoFactorEnabled !== undefined) updates.two_factor_enabled = body.twoFactorEnabled

  const n = body?.notifications
  if (n?.newOrders !== undefined) updates.notify_new_orders = n.newOrders
  if (n?.statusChanges !== undefined) updates.notify_status_changes = n.statusChanges
  if (n?.weeklySummary !== undefined) updates.notify_weekly_summary = n.weeklySummary
  if (n?.sms !== undefined) updates.notify_sms = n.sms

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", auth.userId)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Update failed." }, { status: 500 })
  }

  return NextResponse.json({ profile: serializeProfile(data) })
}
