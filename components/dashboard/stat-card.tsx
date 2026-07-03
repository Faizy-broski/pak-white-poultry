import { type LucideIcon, ArrowUpRightIcon, ArrowDownRightIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  trend = "up",
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  trend?: "up" | "down";
  icon: LucideIcon;
}) {
  const TrendIcon = trend === "up" ? ArrowUpRightIcon : ArrowDownRightIcon;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-serif text-2xl font-semibold tracking-tight">
            {value}
          </p>
          <p
            className={cn(
              "mt-2 inline-flex items-center gap-1 text-xs font-medium",
              trend === "up" ? "text-emerald-600" : "text-destructive"
            )}
          >
            <TrendIcon className="size-3.5" />
            {change}
          </p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}