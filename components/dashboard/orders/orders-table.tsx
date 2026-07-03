"use client"

import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { OrderStatusBadge } from "./orders-status-badge"
import type { Order } from "./orders-data"
import { cn, formatRs } from "@/lib/utils"

export type SortKey = "date" | "amount"
export type SortDir = "asc" | "desc"

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active: boolean
  dir: SortDir
  onClick: () => void
}) {
  const Icon = !active ? ArrowUpDownIcon : dir === "asc" ? ArrowUpIcon : ArrowDownIcon
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 transition-colors hover:text-foreground",
        active && "text-foreground"
      )}
    >
      {label}
      <Icon className="size-3.5" />
    </button>
  )
}

export function OrdersTable({
  orders,
  selectedIds,
  onToggleRow,
  onToggleAll,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
}: {
  orders: Order[]
  selectedIds: string[]
  onToggleRow: (id: string) => void
  onToggleAll: (checked: boolean) => void
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  onRowClick: (order: Order) => void
}) {
  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.includes(o.id))
  const someSelected = orders.some((o) => selectedIds.includes(o.id)) && !allSelected

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-10">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={(checked: boolean | string) => onToggleAll(checked === true)}
              aria-label="Select all orders"
            />
          </TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>
            <SortButton
              label="Amount"
              active={sortKey === "amount"}
              dir={sortDir}
              onClick={() => onSort("amount")}
            />
          </TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <SortButton
              label="Placed"
              active={sortKey === "date"}
              dir={sortDir}
              onClick={() => onSort("date")}
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
              No orders match your filters.
            </TableCell>
          </TableRow>
        )}
        {orders.map((order) => (
          <TableRow
            key={order.id}
            data-state={selectedIds.includes(order.id) ? "selected" : undefined}
            className="cursor-pointer data-[state=selected]:bg-primary/5"
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedIds.includes(order.id)}
                onCheckedChange={() => onToggleRow(order.id)}
                aria-label={`Select order ${order.id}`}
              />
            </TableCell>
            <TableCell className="font-medium" onClick={() => onRowClick(order)}>
              {order.id}
            </TableCell>
            <TableCell onClick={() => onRowClick(order)}>
              <div>
                <p className="font-medium">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.phone}</p>
              </div>
            </TableCell>
            <TableCell onClick={() => onRowClick(order)}>
              <Badge variant="secondary" className="font-normal">
                {order.eggs} eggs
              </Badge>
            </TableCell>
            <TableCell onClick={() => onRowClick(order)} className="font-medium">
              {formatRs(order.amount)}
            </TableCell>
            <TableCell onClick={() => onRowClick(order)} className="text-muted-foreground">
              {order.payment}
            </TableCell>
            <TableCell onClick={() => onRowClick(order)}>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell onClick={() => onRowClick(order)} className="text-muted-foreground">
              {order.placedLabel}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}