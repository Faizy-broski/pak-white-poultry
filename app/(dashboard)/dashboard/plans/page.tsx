"use client"

import { useMemo, useState } from "react"
import { PlusIcon, SearchIcon, XIcon, LayersIcon, UsersIcon, WalletIcon, TrendingUpIcon } from "lucide-react"

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
  initialPlans,
  FREQUENCIES,
  STATUSES,
  type Plan,
  type PlanFrequency,
  type PlanStatus,
} from "@/components/dashboard/plans/plan-data"
import { PlanCard } from "@/components/dashboard/plans/plan-card"
import { PlanFormSheet } from "@/components/dashboard/plans/plan-form-sheet"

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<PlanStatus | "all">("all")
  const [frequency, setFrequency] = useState<PlanFrequency | "all">("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)

  const filtered = useMemo(() => {
    let result = [...plans]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    if (status !== "all") result = result.filter((p) => p.status === status)
    if (frequency !== "all") result = result.filter((p) => p.frequency === frequency)
    return result
  }, [plans, search, status, frequency])

  const stats = useMemo(() => {
    const activePlans = plans.filter((p) => p.status === "Active")
    const totalSubscribers = plans.reduce((sum, p) => sum + p.subscribers, 0)
    const mrr = activePlans.reduce((sum, p) => sum + p.cyclePrice * p.subscribers, 0)
    const topPlan = [...plans].sort((a, b) => b.subscribers - a.subscribers)[0]
    return {
      totalPlans: plans.length,
      totalSubscribers,
      mrr,
      topPlan: topPlan?.name ?? "—",
    }
  }, [plans])

  const hasActiveFilters = search.trim() !== "" || status !== "all" || frequency !== "all"

  function clearFilters() {
    setSearch("")
    setStatus("all")
    setFrequency("all")
  }

  function openCreate() {
    setEditingPlan(null)
    setFormOpen(true)
  }

  function openEdit(plan: Plan) {
    setEditingPlan(plan)
    setFormOpen(true)
  }

  function toggleArchive(plan: Plan) {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id
          ? { ...p, status: p.status === "Archived" ? "Active" : "Archived" }
          : p
      )
    )
  }

  function deletePlan(plan: Plan) {
    setPlans((prev) => prev.filter((p) => p.id !== plan.id))
  }

  function savePlan(
    draft: Omit<Plan, "id" | "subscribers" | "createdLabel" | "status"> & { active: boolean }
  ) {
    const { active, ...rest } = draft

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? { ...p, ...rest, status: active ? "Active" : "Draft" }
            : p
        )
      )
    } else {
      const newPlan: Plan = {
        ...rest,
        id: `PLAN-${String(plans.length + 1).padStart(2, "0")}`,
        subscribers: 0,
        createdLabel: "Just now",
        status: active ? "Active" : "Draft",
      }
      setPlans((prev) => [newPlan, ...prev])
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Subscription Plans
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build and manage the plans customers can subscribe to.
          </p>
        </div>
        <Button className="gap-1.5 self-start sm:self-auto" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Create Plan
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Plans" value={String(stats.totalPlans)} change={`${plans.filter(p=>p.status==="Active").length} active`} trend="up" icon={LayersIcon} />
        <StatCard label="Total Subscribers" value={stats.totalSubscribers.toLocaleString()} change="+38 this month" trend="up" icon={UsersIcon} />
        <StatCard label="Monthly Recurring Revenue" value={formatRs(stats.mrr)} change="+9.2% vs last month" trend="up" icon={WalletIcon} />
        <StatCard label="Most Popular Plan" value={stats.topPlan} change="Highest subscriber count" trend="up" icon={TrendingUpIcon} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search plans by name or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 lg:flex">
            <Select value={status} onValueChange={(v) => setStatus(v as PlanStatus | "all")}>
              <SelectTrigger className="lg:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={frequency} onValueChange={(v) => setFrequency(v as PlanFrequency | "all")}>
              <SelectTrigger className="lg:w-36">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All frequencies</SelectItem>
                {FREQUENCIES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
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

      {/* Plans grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-serif text-lg font-semibold">No plans match your filters</p>
            <p className="text-sm text-muted-foreground">
              Try clearing filters, or create a new plan to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={openEdit}
              onToggleArchive={toggleArchive}
              onDelete={deletePlan}
            />
          ))}
        </div>
      )}

      <PlanFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        plan={editingPlan}
        onSave={savePlan}
      />
    </div>
  )
}