import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "./orders-data"

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-secondary text-secondary-foreground border-transparent",
  Confirmed: "bg-sky-100 text-sky-700 border-transparent",
  "Out for Delivery": "bg-primary/15 text-primary border-transparent",
  Delivered: "bg-emerald-100 text-emerald-700 border-transparent",
  Cancelled: "bg-destructive/10 text-destructive border-transparent",
}

const statusDot: Record<OrderStatus, string> = {
  Pending: "bg-muted-foreground",
  Confirmed: "bg-sky-500",
  "Out for Delivery": "bg-primary",
  Delivered: "bg-emerald-500",
  Cancelled: "bg-destructive",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", statusStyles[status])}>
      <span className={cn("size-1.5 rounded-full", statusDot[status])} />
      {status}
    </Badge>
  )
}