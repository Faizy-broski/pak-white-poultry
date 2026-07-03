"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const weeklyOrders = [
  { day: "Mon", orders: 38 },
  { day: "Tue", orders: 45 },
  { day: "Wed", orders: 41 },
  { day: "Thu", orders: 56 },
  { day: "Fri", orders: 64 },
  { day: "Sat", orders: 72 },
  { day: "Sun", orders: 58 },
];

export function OrdersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders this week</CardTitle>
        <CardDescription>Trays and boxes dispatched, by day</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyOrders} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 8" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={32}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#ordersFill)"
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}