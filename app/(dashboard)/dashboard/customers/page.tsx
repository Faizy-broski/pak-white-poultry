"use client"

import { useMemo, useState } from "react"
import {
  DownloadIcon,
  SearchIcon,
  XIcon,
  MailIcon,
  UsersIcon,
  StarIcon,
  UserPlusIcon,
  WalletIcon,
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
import { StatCard } from "@/components/dashboard/stat-card"
import { formatRs } from "@/lib/utils"

import {
  customers as allCustomers,
  type Customer,
  type CustomerSegment,
  type CustomerStatus,
} from "@/components/dashboard/customers/customers-data"
import { CustomersTable, type SortKey, type SortDir } from "@/components/dashboard/customers/customers-table"
import { CustomerDetailsSheet } from "@/components/dashboard/customers/customer-details-sheet"

const PAGE_SIZE = 8

export default function CustomersPage() {
  const [search, setSearch] = useState("")
  const [segment, setSegment] = useState<CustomerSegment | "all">("all")
  const [city, setCity] = useState<string>("all")
  const [status, setStatus] = useState<CustomerStatus | "all">("all")
  const [sortKey, setSortKey] = useState<SortKey>("spent")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const cities = useMemo(
    () => Array.from(new Set(allCustomers.map((c: any) => c.city))).sort(),
    []
  )

  const filtered = useMemo(() => {
    let result = [...allCustomers]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
          c.email.toLowerCase().includes(q)
      )
    }

    if (segment !== "all") result = result.filter((c) => c.segment === segment)
    if (city !== "all") result = result.filter((c) => c.city === city)
    if (status !== "all") result = result.filter((c) => c.status === status)

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      if (sortKey === "orders") return (a.totalOrders - b.totalOrders) * dir
      if (sortKey === "spent") return (a.totalSpent - b.totalSpent) * dir
      return (new Date(a.lastOrderAt).getTime() - new Date(b.lastOrderAt).getTime()) * dir
    })

    return result
  }, [search, segment, city, status, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const stats = useMemo(() => {
    const vip = allCustomers.filter((c: any) => c.segment === "VIP").length
    const newThisMonth = allCustomers.filter((c: any) => c.segment === "New").length
    const avgSpend = Math.round(
      allCustomers.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0) / allCustomers.length
    )
    return { total: allCustomers.length, vip, newThisMonth, avgSpend }
  }, [])

  const hasActiveFilters =
    search.trim() !== "" || segment !== "all" || city !== "all" || status !== "all"

  function clearFilters() {
    setSearch("")
    setSegment("all")
    setCity("all")
    setStatus("all")
    setPage(1)
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? paged.map((c) => c.id) : [])
  }

  function openCustomer(customer: Customer) {
    setActiveCustomer(customer)
    setSheetOpen(true)
  }

  function exportCsv() {
    const header = ["Name", "Phone", "Email", "City", "Orders", "Total Spent", "Segment", "Status", "Last Order"]
    const rows = filtered.map((c) => [
      c.name, c.phone, c.email, c.city, c.totalOrders, c.totalSpent, c.segment, c.status, c.lastOrderLabel,
    ])
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pak-white-poultry-customers.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Customers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everyone who&rsquo;s ordered from Pak White Poultry, at a glance.
          </p>
        </div>
        <Button variant="outline" className="gap-1.5 self-start sm:self-auto" onClick={exportCsv}>
          <DownloadIcon className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 xl:grid-cols-4">
        <StatCard label="Total Customers" value={String(stats.total)} change="+26 this week" trend="up" icon={UsersIcon} />
        <StatCard label="VIP Customers" value={String(stats.vip)} change="+2 this month" trend="up" icon={StarIcon} />
        <StatCard label="New This Month" value={String(stats.newThisMonth)} change="+4 vs last month" trend="up" icon={UserPlusIcon} />
        <StatCard label="Avg. Customer Spend" value={formatRs(stats.avgSpend)} change="+5.1% vs last month" trend="up" icon={WalletIcon} />
      </div>

      {/* Filters toolbar */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, phone, or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 lg:flex">
            <Select
              value={segment}
              onValueChange={(v) => {
                setSegment(v as CustomerSegment | "all")
                setPage(1)
              }}
            >
              <SelectTrigger className="lg:w-36">
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All segments</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="New">New</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={city}
              onValueChange={(v) => {
                setCity(v as string)
                setPage(1)
              }}
            >
              <SelectTrigger className="lg:w-40">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as CustomerStatus | "all")
                setPage(1)
              }}
            >
              <SelectTrigger className="lg:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
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
          <UsersIcon className="size-4 text-primary" />
          <p className="text-sm font-medium">
            {selectedIds.length} customer{selectedIds.length > 1 ? "s" : ""} selected
          </p>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-1.5">
              <MailIcon className="size-3.5" />
              Send offer
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <CustomersTable
          customers={paged}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={(key: any) => {
            if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc")
            else {
              setSortKey(key)
              setSortDir("desc")
            }
          }}
          onRowClick={openCustomer}
        />
      </Card>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Showing {paged.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
          {(currentPage - 1) * PAGE_SIZE + paged.length} of {filtered.length} customers
          {filtered.length !== allCustomers.length && ` (filtered from ${allCustomers.length})`}
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

      <CustomerDetailsSheet customer={activeCustomer} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}