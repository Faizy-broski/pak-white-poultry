import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireUser, requireAdmin } from "@/lib/supabase/auth-guard"
import { serializePlan } from "@/lib/api/serializers"

async function withSubscriberCounts(supabase: Awaited<ReturnType<typeof createClient>>, plans: any[]) {
  if (plans.length === 0) return []

  const { data: subs } = await supabase
    .from("customer_subscriptions")
    .select("plan_id")
    .eq("status", "Active")
    .in(
      "plan_id",
      plans.map((p) => p.id)
    )

  const counts = new Map<string, number>()
  for (const row of subs ?? []) {
    counts.set(row.plan_id, (counts.get(row.plan_id) ?? 0) + 1)
  }

  return plans.map((p) => serializePlan(p, counts.get(p.id) ?? 0))
}

// GET /api/plans?search=&status=&frequency=
export async function GET(request: Request) {
  const auth = await requireUser()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")?.trim()
  const status = searchParams.get("status")
  const frequency = searchParams.get("frequency")

  const supabase = await createClient()

  let query = supabase.from("plans").select("*")

  // Non-admins only ever see Active plans (RLS enforces this too).
  if (auth.role !== "admin") {
    query = query.eq("status", "Active")
  } else if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (frequency && frequency !== "all") query = query.eq("frequency", frequency)
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)

  query = query.order("created_at", { ascending: false })

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const plans = await withSubscriberCounts(supabase, data ?? [])
  return NextResponse.json({ plans })
}

// POST /api/plans — admin-only
export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const body = await request.json().catch(() => null)
  const {
    name,
    description = "",
    frequency,
    eggsPerDelivery,
    deliveriesPerCycle,
    cyclePrice,
    discountPercent = 0,
    popular = false,
    active = true,
  } = body ?? {}

  if (!name || !frequency || !eggsPerDelivery || !deliveriesPerCycle || !cyclePrice) {
    return NextResponse.json({ error: "Missing required plan fields." }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("plans")
    .insert({
      name,
      description,
      frequency,
      eggs_per_delivery: eggsPerDelivery,
      deliveries_per_cycle: deliveriesPerCycle,
      cycle_price: cyclePrice,
      discount_percent: discountPercent,
      popular,
      status: active ? "Active" : "Draft",
      created_by: auth.userId,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ plan: serializePlan(data, 0) }, { status: 201 })
}
