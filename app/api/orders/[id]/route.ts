import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireUser, requireAdmin } from "@/lib/supabase/auth-guard"
import { serializeOrder } from "@/lib/api/serializers"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single()

  if (error || !data) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 })
  }

  return NextResponse.json({ order: serializeOrder(data) })
}

// PATCH /api/orders/[id] — admin-only, e.g. { "status": "Delivered" }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { id } = await params
  const body = await request.json().catch(() => null)
  const allowed = ["status", "rider", "delivery_slot", "deliverySlot"]

  const updates: Record<string, unknown> = {}
  if (body?.status) updates.status = body.status
  if (body?.rider !== undefined) updates.rider = body.rider
  if (body?.deliverySlot !== undefined) updates.delivery_slot = body.deliverySlot

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: `Nothing to update. Allowed fields: ${allowed.join(", ")}` },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Order not found." }, { status: 404 })
  }

  return NextResponse.json({ order: serializeOrder(data) })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { id } = await params
  const supabase = await createClient()

  const { error } = await supabase.from("orders").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
