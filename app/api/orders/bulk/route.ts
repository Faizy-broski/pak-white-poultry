import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/supabase/auth-guard"
import { serializeOrder } from "@/lib/api/serializers"

const ALLOWED_STATUSES = ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"]

// PATCH /api/orders/bulk — { "ids": ["uuid1", "uuid2"], "status": "Delivered" }
export async function PATCH(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const body = await request.json().catch(() => null)
  const { ids, status } = body ?? {}

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "Provide a non-empty array of order ids." }, { status: 400 })
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .in("id", ids)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders: (data ?? []).map(serializeOrder) })
}
