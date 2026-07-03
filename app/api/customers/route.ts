import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/supabase/auth-guard"
import { serializeCustomer } from "@/lib/api/serializers"

// GET /api/customers?search=&segment=&city=&status=&sortKey=spent&sortDir=desc&page=1&pageSize=8
export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")?.trim()
  const segment = searchParams.get("segment")
  const city = searchParams.get("city")
  const status = searchParams.get("status")
  const sortKeyParam = searchParams.get("sortKey") // "orders" | "spent" | "recent"
  const sortDir = searchParams.get("sortDir") === "asc"
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 8)))

  const sortColumn =
    sortKeyParam === "orders" ? "total_orders" : sortKeyParam === "recent" ? "last_order_at" : "total_spent"

  const supabase = await createClient()

  let query = supabase.from("customer_stats").select("*", { count: "exact" })

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
  }
  if (segment && segment !== "all") query = query.eq("segment", segment)
  if (city && city !== "all") query = query.eq("city", city)
  if (status && status !== "all") query = query.eq("status", status)

  query = query
    .order(sortColumn, { ascending: sortDir, nullsFirst: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    customers: (data ?? []).map(serializeCustomer),
    total: count ?? 0,
    page,
    pageSize,
  })
}
