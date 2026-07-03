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
import { OrderStatusBadge } from "./orders-status-badge"
import type { Order } from "./orders-data"
import { formatRs } from "@/lib/utils"
import { PhoneIcon, MapPinIcon, TruckIcon, WalletIcon } from "lucide-react"

export function OrderDetailsSheet({
  order,
  open,
  onOpenChange,
}: {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full flex-col gap-0 p-0">
        {order && (
          <>
            <SheetHeader className="px-6 pb-4 pt-6">
              <div className="flex items-center justify-between pr-8">
                <SheetTitle>{order.id}</SheetTitle>
                <OrderStatusBadge status={order.status} />
              </div>
              <SheetDescription>Placed {order.placedLabel}</SheetDescription>
            </SheetHeader>

            <Separator />

            <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Customer
                </h4>
                <p className="font-medium">{order.customer}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <PhoneIcon className="size-3.5" />
                  {order.phone}
                </div>
                <div className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPinIcon className="size-3.5 shrink-0 translate-y-0.5" />
                  {order.address}
                </div>
              </section>

              <Separator />

              <section>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Order items
                </h4>
                <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-3">
                  <div>
                    <p className="text-sm font-medium">{order.boxLabel}</p>
                    <p className="text-xs text-muted-foreground">{order.eggs} eggs</p>
                  </div>
                  <p className="font-serif text-base font-semibold text-primary">
                    {formatRs(order.amount)}
                  </p>
                </div>
              </section>

              <Separator />

              <section className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <TruckIcon className="size-3.5" /> Delivery
                  </h4>
                  <p className="text-sm font-medium">{order.deliverySlot}</p>
                  {order.rider && (
                    <p className="mt-0.5 text-xs text-muted-foreground">Rider: {order.rider}</p>
                  )}
                </div>
                <div>
                  <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <WalletIcon className="size-3.5" /> Payment
                  </h4>
                  <p className="text-sm font-medium">
                    {order.payment === "Cash" ? "Cash on Delivery" : "UPI on Delivery"}
                  </p>
                </div>
              </section>
            </div>

            <Separator />

            <SheetFooter className="px-6 py-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button>Update status</Button>
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