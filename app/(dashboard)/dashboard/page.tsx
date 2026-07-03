import { ClipboardListIcon, TruckIcon, UsersIcon, WalletIcon } from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
import { OrdersChart } from "@/components/dashboard/orders-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { formatRs } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Good morning, Admin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&rsquo;s what&rsquo;s happening across Pak White Poultry today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Orders"
          value="58"
          change="+12% vs yesterday"
          trend="up"
          icon={ClipboardListIcon}
        />
        <StatCard
          label="Today's Revenue"
          value={formatRs(21430)}
          change="+8.4% vs yesterday"
          trend="up"
          icon={WalletIcon}
        />
        <StatCard
          label="Pending Deliveries"
          value="14"
          change="-3 since noon"
          trend="down"
          icon={TruckIcon}
        />
        <StatCard
          label="Total Customers"
          value="1,284"
          change="+26 this week"
          trend="up"
          icon={UsersIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <OrdersChart />
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-serif text-lg font-semibold">Delivery status</h3>
          <div className="flex flex-col gap-3 text-sm">
            <StatusRow label="Delivered" value={41} total={58} tone="bg-emerald-500" />
            <StatusRow label="Out for delivery" value={13} total={58} tone="bg-primary" />
            <StatusRow label="Pending" value={4} total={58} tone="bg-muted-foreground" />
          </div>
          <p className="mt-auto text-xs text-muted-foreground">
            Based on 58 orders placed today, before 9 PM cutoff.
          </p>
        </div>
      </div>

      <RecentOrders />
    </div>
  )
}

function StatusRow({
  label,
  value,
  total,
  tone,
}: {
  label: string
  value: number
  total: number
  tone: string
}) {
  const percent = Math.round((value / total) * 100)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full ${tone} transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}