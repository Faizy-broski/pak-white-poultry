import { PencilIcon, ArchiveIcon, Trash2Icon, RotateCcwIcon, SparklesIcon, UsersIcon } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatRs } from "@/lib/utils"
import type { Plan } from "./plan-data"

const statusStyles: Record<Plan["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700 border-transparent",
  Draft: "bg-secondary text-secondary-foreground border-transparent",
  Archived: "bg-destructive/10 text-destructive border-transparent",
}

const cycleLabel: Record<Plan["frequency"], string> = {
  Daily: "/ month",
  Weekly: "/ month",
  Monthly: "/ month",
}

export function PlanCard({
  plan,
  onEdit,
  onToggleArchive,
  onDelete,
}: {
  plan: Plan
  onEdit: (plan: Plan) => void
  onToggleArchive: (plan: Plan) => void
  onDelete: (plan: Plan) => void
}) {
  const originalPrice =
    plan.discountPercent > 0
      ? Math.round(plan.cyclePrice / (1 - plan.discountPercent / 100))
      : null
  const perDeliveryPrice = Math.round(plan.cyclePrice / plan.deliveriesPerCycle)

  return (
    <Card className={cn("flex flex-col transition-shadow hover:shadow-md", plan.status === "Archived" && "opacity-70")}>
      <CardHeader className="gap-3 pb-0">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-medium">
            {plan.frequency}
          </Badge>
          <Badge variant="outline" className={cn("font-medium", statusStyles[plan.status])}>
            {plan.status}
          </Badge>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-semibold">{plan.name}</h3>
            {plan.popular && (
              <Badge className="gap-1 bg-primary/15 text-primary">
                <SparklesIcon className="size-3" />
                Popular
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{plan.description}</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-4">
        <div className="flex items-end gap-2">
          <span className="font-serif text-3xl font-semibold text-primary">
            {formatRs(plan.cyclePrice)}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">{cycleLabel[plan.frequency]}</span>
          {originalPrice && (
            <span className="pb-1 text-sm text-muted-foreground line-through">
              {formatRs(originalPrice)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-secondary/50 p-3 text-sm">
          <div>
            <p className="text-muted-foreground">Per delivery</p>
            <p className="font-medium">
              {plan.eggsPerDelivery} eggs · {formatRs(perDeliveryPrice)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Deliveries / cycle</p>
            <p className="font-medium">{plan.deliveriesPerCycle}×</p>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <UsersIcon className="size-3.5" />
          {plan.subscribers} active subscribers
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => onEdit(plan)}>
          <PencilIcon className="size-3.5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => onToggleArchive(plan)}
        >
          {plan.status === "Archived" ? (
            <RotateCcwIcon className="size-3.5" />
          ) : (
            <ArchiveIcon className="size-3.5" />
          )}
          {plan.status === "Archived" ? "Restore" : "Archive"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(plan)}
          aria-label={`Delete ${plan.name}`}
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}