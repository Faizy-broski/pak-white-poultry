import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CustomerSegment, CustomerStatus } from "./customers-data"

const segmentStyles: Record<CustomerSegment, string> = {
  VIP: "bg-primary/15 text-primary border-transparent",
  Regular: "bg-secondary text-secondary-foreground border-transparent",
  New: "bg-sky-100 text-sky-700 border-transparent",
}

export function CustomerSegmentBadge({ segment }: { segment: CustomerSegment }) {
  return (
    <Badge variant="outline" className={cn("font-medium", segmentStyles[segment])}>
      {segment}
    </Badge>
  )
}

export function CustomerStatusDot({ status }: { status: CustomerStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "Active" ? "bg-emerald-500" : "bg-muted-foreground"
        )}
      />
      {status}
    </span>
  )
}