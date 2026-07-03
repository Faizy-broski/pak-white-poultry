import { formatRelativeLabel, formatMonthYear } from "./format"

// ── Orders ──────────────────────────────────────────────────
export function serializeOrder(row: any) {
  return {
    id: row.id as string, // uuid — use this for PATCH/DELETE calls
    orderNumber: row.order_number as string, // e.g. "PWP-1052" — use for display
    customer: row.customer_name as string,
    phone: row.phone as string,
    address: row.address as string,
    eggs: row.eggs as number,
    boxLabel: row.box_label as string,
    amount: Number(row.amount),
    status: row.status as string,
    payment: row.payment as string,
    placedAt: row.placed_at as string,
    placedLabel: formatRelativeLabel(row.placed_at),
    deliverySlot: row.delivery_slot as string,
    rider: row.rider ?? undefined,
  }
}

// ── Customers (reads from the customer_stats view) ────────────
export function serializeCustomer(row: any) {
  return {
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    email: row.email as string,
    city: row.city as string,
    address: row.address as string,
    totalOrders: Number(row.total_orders),
    totalSpent: Number(row.total_spent),
    avgOrder: Number(row.avg_order),
    lastOrderLabel: row.last_order_at ? formatRelativeLabel(row.last_order_at) : "No orders yet",
    lastOrderAt: row.last_order_at as string | null,
    joinedLabel: formatMonthYear(row.created_at),
    segment: row.segment as string,
    status: row.status as string,
    favoriteBox: row.favorite_box ?? "—",
  }
}

// ── Plans ───────────────────────────────────────────────────
export function serializePlan(row: any, subscriberCount = 0) {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    frequency: row.frequency as string,
    eggsPerDelivery: row.eggs_per_delivery as number,
    deliveriesPerCycle: row.deliveries_per_cycle as number,
    cyclePrice: Number(row.cycle_price),
    discountPercent: row.discount_percent as number,
    subscribers: subscriberCount,
    status: row.status as string,
    popular: row.popular as boolean,
    createdLabel: formatMonthYear(row.created_at),
  }
}

// ── Profile ─────────────────────────────────────────────────
export function serializeProfile(row: any) {
  return {
    id: row.id as string,
    fullName: row.full_name as string,
    email: row.email as string,
    phone: row.phone as string | null,
    address: row.address as string | null,
    city: row.city as string | null,
    avatarUrl: row.avatar_url as string | null,
    role: row.role as string,
    status: row.status as string,
    twoFactorEnabled: row.two_factor_enabled as boolean,
    notifications: {
      newOrders: row.notify_new_orders as boolean,
      statusChanges: row.notify_status_changes as boolean,
      weeklySummary: row.notify_weekly_summary as boolean,
      sms: row.notify_sms as boolean,
    },
    joinedLabel: formatMonthYear(row.created_at),
  }
}