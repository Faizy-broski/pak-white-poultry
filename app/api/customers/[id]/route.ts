import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/supabase/auth-guard"
import { serializeCustomer, serializeOrder } from "@/lib/api/serializers"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { id } = await params

  // Customers can only view their own profile; admins can view anyone's.
  if (auth.role !== "admin" && auth.userId !== id) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 })
  }

  const supabase = await createClient()

  const [{ data: customer, error: customerError }, { data: orders, error: ordersError }] =
    await Promise.all([
      supabase.from("customer_stats").select("*").eq("id", id).single(),
      supabase
        .from("orders")
        .select("*")
        .eq("customer_id", id)
        .order("placed_at", { ascending: false })
        .limit(4),
    ])

  if (customerError || !customer) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 })
  }
  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 })
  }

  return NextResponse.json({
    customer: serializeCustomer(customer),
    recentOrders: (orders ?? []).map(serializeOrder),
  })
}
