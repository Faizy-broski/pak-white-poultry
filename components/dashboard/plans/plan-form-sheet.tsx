"use client"

import { useEffect, useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatRs } from "@/lib/utils"
import { FREQUENCIES, type Plan, type PlanFrequency } from "./plan-data"

const emptyDraft: Omit<Plan, "id" | "subscribers" | "createdLabel" | "status"> = {
  name: "",
  description: "",
  frequency: "Weekly",
  eggsPerDelivery: 12,
  deliveriesPerCycle: 4,
  cyclePrice: 1000,
  discountPercent: 0,
  popular: false,
}

export function PlanFormSheet({
  open,
  onOpenChange,
  plan,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Plan | null
  onSave: (draft: Omit<Plan, "id" | "subscribers" | "createdLabel" | "status"> & { active: boolean }) => void
}) {
  const [draft, setDraft] = useState({ ...emptyDraft, active: true })

  useEffect(() => {
    if (plan) {
      const { id, subscribers, createdLabel, status, ...rest } = plan
      setDraft({ ...rest, active: status !== "Draft" })
    } else {
      setDraft({ ...emptyDraft, active: true })
    }
  }, [plan, open])

  function update<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const perDeliveryPrice = draft.deliveriesPerCycle
    ? Math.round(draft.cyclePrice / draft.deliveriesPerCycle)
    : 0

  const canSave = draft.name.trim().length > 1 && draft.cyclePrice > 0 && draft.eggsPerDelivery > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full flex-col gap-0 p-0">
        <SheetHeader className="px-6 pb-4 pt-6">
          <SheetTitle>{plan ? "Edit plan" : "Create a new plan"}</SheetTitle>
          <SheetDescription>
            {plan
              ? "Update the pricing and delivery details for this plan."
              : "Build a custom subscription plan customers can buy."}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid gap-2">
            <Label htmlFor="plan-name">Plan name</Label>
            <Input
              id="plan-name"
              placeholder="e.g. Weekly Family — 12"
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="plan-description">Description</Label>
            <Textarea
              id="plan-description"
              placeholder="A short line customers will see on the plan card"
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="plan-frequency">Delivery frequency</Label>
              <Select
                value={draft.frequency}
                onValueChange={(v) => update("frequency", v as PlanFrequency)}
              >
                <SelectTrigger id="plan-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan-deliveries">Deliveries / cycle</Label>
              <Input
                id="plan-deliveries"
                type="number"
                min={1}
                value={draft.deliveriesPerCycle}
                onChange={(e) => update("deliveriesPerCycle", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="plan-eggs">Eggs per delivery</Label>
              <Input
                id="plan-eggs"
                type="number"
                min={1}
                value={draft.eggsPerDelivery}
                onChange={(e) => update("eggsPerDelivery", Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan-discount">Discount %</Label>
              <Input
                id="plan-discount"
                type="number"
                min={0}
                max={90}
                value={draft.discountPercent}
                onChange={(e) => update("discountPercent", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="plan-price">Price per cycle (Rs.)</Label>
            <Input
              id="plan-price"
              type="number"
              min={1}
              value={draft.cyclePrice}
              onChange={(e) => update("cyclePrice", Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Works out to {formatRs(perDeliveryPrice)} per delivery.
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
            <div>
              <p className="text-sm font-medium">Mark as popular</p>
              <p className="text-xs text-muted-foreground">Shows a highlighted badge on the plan card</p>
            </div>
            <Switch checked={draft.popular} onCheckedChange={(v) => update("popular", v)} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
            <div>
              <p className="text-sm font-medium">Publish plan</p>
              <p className="text-xs text-muted-foreground">
                Off keeps this as a draft, hidden from customers
              </p>
            </div>
            <Switch checked={draft.active} onCheckedChange={(v) => update("active", v)} />
          </div>
        </div>

        <Separator />

        <SheetFooter className="px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={() => {
              onSave(draft)
              onOpenChange(false)
            }}
          >
            {plan ? "Save changes" : "Create plan"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}