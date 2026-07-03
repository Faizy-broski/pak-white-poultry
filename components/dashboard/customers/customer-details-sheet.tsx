"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { OrderStatusBadge } from "@/components/dashboard/orders/orders-status-badge"
import { orders } from "@/components/dashboard/orders/orders-data"
import { CustomerSegmentBadge, CustomerStatusDot } from "./customer-segment-badge"
import type { Customer } from "./customers-data"
import { formatRs } from "@/lib/utils"
import { PhoneIcon, MailIcon, MapPinIcon, EggIcon } from "lucide-react"

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
}

export function CustomerDetailsSheet({
  customer,
  open,
  onOpenChange,
}: {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const customerOrders = customer
    ? orders.filter((o) => o.customer === customer.name).slice(0, 4)
    : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full flex-col gap-0 p-0">
        {customer && (
          <>
            <SheetHeader className="px-6 pb-4 pt-6">
              <div className="flex items-center gap-3 pr-8">
                <Avatar className="size-11">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle>{customer.name}</SheetTitle>
                  <SheetDescription>Customer since {customer.joinedLabel}</SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <CustomerSegmentBadge segment={customer.segment} />
                <CustomerStatusDot status={customer.status} />
              </div>
            </SheetHeader>

            <Separator />

            <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contact
                </h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <PhoneIcon className="size-3.5" /> {customer.phone}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MailIcon className="size-3.5" /> {customer.email}
                  </div>
                  <div className="flex items-start gap-1.5 text-muted-foreground">
                    <MapPinIcon className="size-3.5 shrink-0 translate-y-0.5" /> {customer.address}
                  </div>
                </div>
              </section>

              <Separator />

              <section className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-secondary/50 p-3 text-center">
                  <p className="font-serif text-lg font-semibold">{customer.totalOrders}</p>
                  <p className="text-[11px] text-muted-foreground">Orders</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-3 text-center">
                  <p className="font-serif text-lg font-semibold text-primary">
                    {formatRs(customer.totalSpent)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Total spent</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-3 text-center">
                  <p className="font-serif text-lg font-semibold">{formatRs(customer.avgOrder)}</p>
                  <p className="text-[11px] text-muted-foreground">Avg. order</p>
                </div>
              </section>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <EggIcon className="size-3.5" />
                Usually orders <span className="font-medium text-foreground">{customer.favoriteBox}</span>
              </div>

              <Separator />

              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Recent orders
                </h4>
                <div className="space-y-2">
                  {customerOrders.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent orders on file.</p>
                  )}
                  {customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-xl border border-border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.placedLabel}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{formatRs(order.amount)}</p>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <Separator />

            <SheetFooter className="px-6 py-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button>Message customer</Button>
            </SheetFooter>
          </>
        )}

        <style jsx global>{`
          .no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </SheetContent>
    </Sheet>
  )
}