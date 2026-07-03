import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/supabase/auth-guard"
import { serializeOrder } from "@/lib/api/serializers"

// GET /api/orders?search=&status=&payment=&dateRange=&sortKey=date&sortDir=desc&page=1&pageSize=8
export async function GET(request: Request) {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")?.trim()
  const status = searchParams.get("status")
  const payment = searchParams.get("payment")
  const dateRange = searchParams.get("dateRange") // "today" | "7d" | "30d" | null
  const sortKey = searchParams.get("sortKey") === "amount" ? "amount" : "placed_at"
  const sortDir = searchParams.get("sortDir") === "asc"
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 8)))

  const supabase = await createClient()

  let query = supabase.from("orders").select("*", { count: "exact" })

  // Customers only ever see their own orders — RLS also enforces this,
  // this just avoids an unnecessary round trip for non-admins.
  if (auth.role !== "admin") {
    query = query.eq("customer_id", auth.userId)
  }

  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone.ilike.%${search}%`
    )
  }
  if (status && status !== "all") query = query.eq("status", status)
  if (payment && payment !== "all") query = query.eq("payment", payment)

  if (dateRange && dateRange !== "all") {
    const days = dateRange === "today" ? 1 : dateRange === "7d" ? 7 : 30
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    query = query.gte("placed_at", cutoff.toISOString())
  }

  query = query
    .order(sortKey, { ascending: sortDir })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    orders: (data ?? []).map(serializeOrder),
    total: count ?? 0,
    page,
    pageSize,
  })
}

// POST /api/orders — create a new order (used by the customer order wizard)
export async function POST(request: Request) {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const body = await request.json().catch(() => null)
  const { customerName, phone, address, eggs, boxLabel, amount, payment, deliverySlot, planId } =
    body ?? {}

  if (!customerName || !phone || !address || !eggs || !boxLabel || !amount || !payment) {
    return NextResponse.json({ error: "Missing required order fields." }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_id: auth.userId,
      customer_name: customerName,
      phone,
      address,
      eggs,
      box_label: boxLabel,
      amount,
      payment,
      delivery_slot: deliverySlot ?? "Tomorrow, before 9 PM",
      plan_id: planId ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ order: serializeOrder(data) }, { status: 201 })
}
