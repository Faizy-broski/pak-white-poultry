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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CustomerSegmentBadge, CustomerStatusDot } from "./customer-segment-badge"
import type { Customer } from "./customers-data"
import { cn, formatRs } from "@/lib/utils"

export type SortKey = "orders" | "spent" | "recent"
export type SortDir = "asc" | "desc"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

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

export function CustomersTable({
  customers,
  selectedIds,
  onToggleRow,
  onToggleAll,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
}: {
  customers: Customer[]
  selectedIds: string[]
  onToggleRow: (id: string) => void
  onToggleAll: (checked: boolean) => void
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  onRowClick: (customer: Customer) => void
}) {
  const allSelected = customers.length > 0 && customers.every((c) => selectedIds.includes(c.id))
  const someSelected = customers.some((c) => selectedIds.includes(c.id)) && !allSelected

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-10">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label="Select all customers"
            />
          </TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>City</TableHead>
          <TableHead>
            <SortButton
              label="Orders"
              active={sortKey === "orders"}
              dir={sortDir}
              onClick={() => onSort("orders")}
            />
          </TableHead>
          <TableHead>
            <SortButton
              label="Total spent"
              active={sortKey === "spent"}
              dir={sortDir}
              onClick={() => onSort("spent")}
            />
          </TableHead>
          <TableHead>Segment</TableHead>
          <TableHead>
            <SortButton
              label="Last order"
              active={sortKey === "recent"}
              dir={sortDir}
              onClick={() => onSort("recent")}
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
              No customers match your filters.
            </TableCell>
          </TableRow>
        )}
        {customers.map((customer) => (
          <TableRow
            key={customer.id}
            data-state={selectedIds.includes(customer.id) ? "selected" : undefined}
            className="cursor-pointer data-[state=selected]:bg-primary/5"
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedIds.includes(customer.id)}
                onCheckedChange={() => onToggleRow(customer.id)}
                aria-label={`Select ${customer.name}`}
              />
            </TableCell>
            <TableCell onClick={() => onRowClick(customer)}>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {initials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.phone}</p>
                </div>
              </div>
            </TableCell>
            <TableCell onClick={() => onRowClick(customer)} className="text-muted-foreground">
              {customer.city}
            </TableCell>
            <TableCell onClick={() => onRowClick(customer)}>{customer.totalOrders}</TableCell>
            <TableCell onClick={() => onRowClick(customer)} className="font-medium">
              {formatRs(customer.totalSpent)}
            </TableCell>
            <TableCell onClick={() => onRowClick(customer)}>
              <CustomerSegmentBadge segment={customer.segment} />
            </TableCell>
            <TableCell onClick={() => onRowClick(customer)}>
              <div>
                <p className="text-muted-foreground">{customer.lastOrderLabel}</p>
                <CustomerStatusDot status={customer.status} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}