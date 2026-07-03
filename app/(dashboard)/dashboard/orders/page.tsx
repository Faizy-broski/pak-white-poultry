"use client"

import { useMemo, useState } from "react"
import {
  DownloadIcon,
  SearchIcon,
  XIcon,
  CheckCircle2Icon,
  BanIcon,
  ClipboardListIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, formatRs } from "@/lib/utils"

import { orders as allOrders, ORDER_STATUSES, type Order, type OrderStatus, type PaymentMethod } from "@/components/dashboard/orders/orders-data"
import { OrdersTable, type SortKey, type SortDir } from "@/components/dashboard/orders/orders-table"
import { OrderDetailsSheet } from "@/components/dashboard/orders/orders-detail-sheet"

type DateRange = "all" | "today" | "7d" | "30d"

const PAGE_SIZE = 8

const statusFilters: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  ...ORDER_STATUSES.map((s) => ({ label: s, value: s })),
]

export default function OrdersPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<OrderStatus | "all">("all")
  const [payment, setPayment] = useState<PaymentMethod | "all">("all")
  const [dateRange, setDateRange] = useState<DateRange>("all")
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const now = useMemo(() => new Date("2026-07-03T12:00:00"), [])

  const filtered = useMemo(() => {
    let result = [...allOrders]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
      )
    }

    if (status !== "all") result = result.filter((o) => o.status === status)
    if (payment !== "all") result = result.filter((o) => o.payment === payment)

    if (dateRange !== "all") {
      const days = dateRange === "today" ? 1 : dateRange === "7d" ? 7 : 30
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - days)
      result = result.filter((o) => new Date(o.placedAt) >= cutoff)
    }

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      if (sortKey === "amount") return (a.amount - b.amount) * dir
      return (new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime()) * dir
    })

    return result
  }, [search, status, payment, dateRange, sortKey, sortDir, now])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: allOrders.length }
    for (const s of ORDER_STATUSES) base[s] = allOrders.filter((o: Order) => o.status === s).length
    return base
  }, [])

  const hasActiveFilters =
    search.trim() !== "" || status !== "all" || payment !== "all" || dateRange !== "all"

  function clearFilters() {
    setSearch("")
    setStatus("all")
    setPayment("all")
    setDateRange("all")
    setPage(1)
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? paged.map((o) => o.id) : [])
  }

  function openOrder(order: Order) {
    setActiveOrder(order)
    setSheetOpen(true)
  }

  function exportCsv() {
    const header = ["Order", "Customer", "Phone", "Eggs", "Amount", "Status", "Payment", "Placed"]
    const rows = filtered.map((o) => [
      o.id,
      o.customer,
      o.phone,
      o.eggs,
      o.amount,
      o.status,
      o.payment,
      o.placedLabel,
    ])
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pak-white-poultry-orders.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track, filter, and manage every egg order in one place.
          </p>
        </div>
        <Button variant="outline" className="gap-1.5 self-start sm:self-auto" onClick={exportCsv}>
          <DownloadIcon className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Status summary chips */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatus(f.value as OrderStatus | "all")
              setPage(1)
            }}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors",
              status === f.value
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:bg-secondary/60"
            )}
          >
            <p className="text-xs text-muted-foreground">{f.label}</p>
            <p className="mt-1 font-serif text-xl font-semibold">
              {counts[f.value] ?? 0}
            </p>
          </button>
        ))}
      </div>

      {/* Filters toolbar */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search order ID, customer, or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 lg:flex">
            <Select
              value={payment}
              onValueChange={(value, _event) => {
                setPayment(value as PaymentMethod | "all")
                setPage(1)
              }}
            >
              <SelectTrigger className="lg:w-40">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateRange}
              onValueChange={(v: DateRange | null) => {
                if (v) setDateRange(v)
                setPage(1)
              }}
            >
              <SelectTrigger className="lg:w-44">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={clearFilters}>
              <XIcon className="size-3.5" />
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <ClipboardListIcon className="size-4 text-primary" />
          <p className="text-sm font-medium">
            {selectedIds.length} order{selectedIds.length > 1 ? "s" : ""} selected
          </p>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-1.5">
              <CheckCircle2Icon className="size-3.5" />
              Mark as delivered
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive">
              <BanIcon className="size-3.5" />
              Cancel orders
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <OrdersTable
          orders={paged}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={(key: SortKey) => {
            if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc")
            else {
              setSortKey(key)
              setSortDir("desc")
            }
          }}
          onRowClick={openOrder}
        />
      </Card>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Showing {paged.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
          {(currentPage - 1) * PAGE_SIZE + paged.length} of {filtered.length} orders
          {filtered.length !== allOrders.length && ` (filtered from ${allOrders.length})`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <OrderDetailsSheet order={activeOrder} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}