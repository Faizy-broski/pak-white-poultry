import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireUser, requireAdmin } from "@/lib/supabase/auth-guard"
import { serializePlan } from "@/lib/api/serializers"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.from("plans").select("*").eq("id", id).single()
  if (error || !data) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 })
  }

  const { count } = await supabase
    .from("customer_subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("plan_id", id)
    .eq("status", "Active")

  return NextResponse.json({ plan: serializePlan(data, count ?? 0) })
}

// PATCH /api/plans/[id] — admin-only. Accepts any subset of editable fields,
// including { "status": "Archived" } for the Archive/Restore button.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { id } = await params
  const body = await request.json().catch(() => null)

  const fieldMap: Record<string, string> = {
    name: "name",
    description: "description",
    frequency: "frequency",
    eggsPerDelivery: "eggs_per_delivery",
    deliveriesPerCycle: "deliveries_per_cycle",
    cyclePrice: "cycle_price",
    discountPercent: "discount_percent",
    popular: "popular",
    status: "status",
  }

  const updates: Record<string, unknown> = {}
  for (const [key, column] of Object.entries(fieldMap)) {
    if (body?.[key] !== undefined) updates[column] = body[key]
  }
  // Accept the sheet's `active` boolean as a convenience alias for status
  if (body?.active !== undefined && updates.status === undefined) {
    updates.status = body.active ? "Active" : "Draft"
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("plans")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Plan not found." }, { status: 404 })
  }

  const { count } = await supabase
    .from("customer_subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("plan_id", id)
    .eq("status", "Active")

  return NextResponse.json({ plan: serializePlan(data, count ?? 0) })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { id } = await params
  const supabase = await createClient()

  const { error } = await supabase.from("plans").delete().eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
