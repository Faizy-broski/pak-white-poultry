export type PlanFrequency = "Daily" | "Weekly" | "Monthly"
export type PlanStatus = "Active" | "Draft" | "Archived"

export type Plan = {
  id: string
  name: string
  description: string
  frequency: PlanFrequency
  eggsPerDelivery: number
  deliveriesPerCycle: number // deliveries within a 30-day cycle
  cyclePrice: number // Rs. billed per 30-day cycle
  discountPercent: number
  subscribers: number
  status: PlanStatus
  popular: boolean
  createdLabel: string
}

export const FREQUENCIES: PlanFrequency[] = ["Daily", "Weekly", "Monthly"]
export const STATUSES: PlanStatus[] = ["Active", "Draft", "Archived"]

export const initialPlans: Plan[] = [
  {
    id: "PLAN-01",
    name: "Daily Fresh — 6",
    description: "Half a dozen farm-fresh eggs delivered to your door every single morning.",
    frequency: "Daily",
    eggsPerDelivery: 6,
    deliveriesPerCycle: 30,
    cyclePrice: 5100,
    discountPercent: 10,
    subscribers: 214,
    status: "Active",
    popular: true,
    createdLabel: "Jan 2026",
  },
  {
    id: "PLAN-02",
    name: "Weekly Family — 12",
    description: "A tray of 12 eggs, once a week — sized for a small household.",
    frequency: "Weekly",
    eggsPerDelivery: 12,
    deliveriesPerCycle: 4,
    cyclePrice: 1360,
    discountPercent: 0,
    subscribers: 356,
    status: "Active",
    popular: true,
    createdLabel: "Jan 2026",
  },
  {
    id: "PLAN-03",
    name: "Monthly Essentials — 30",
    description: "One flat of 30 eggs, delivered once a month. Great for light users.",
    frequency: "Monthly",
    eggsPerDelivery: 30,
    deliveriesPerCycle: 1,
    cyclePrice: 800,
    discountPercent: 0,
    subscribers: 128,
    status: "Active",
    popular: false,
    createdLabel: "Feb 2026",
  },
  {
    id: "PLAN-04",
    name: "Weekly Bulk — 30",
    description: "A full flat every week — built for bigger families and small cafés.",
    frequency: "Weekly",
    eggsPerDelivery: 30,
    deliveriesPerCycle: 4,
    cyclePrice: 3040,
    discountPercent: 12,
    subscribers: 87,
    status: "Active",
    popular: false,
    createdLabel: "Mar 2026",
  },
  {
    id: "PLAN-05",
    name: "Business Bulk — Custom",
    description: "Custom weekly volume for restaurants, bakeries, and hotels. Priced per client.",
    frequency: "Weekly",
    eggsPerDelivery: 360,
    deliveriesPerCycle: 4,
    cyclePrice: 38000,
    discountPercent: 15,
    subscribers: 12,
    status: "Draft",
    popular: false,
    createdLabel: "Jun 2026",
  },
  {
    id: "PLAN-06",
    name: "Trial Week — 6",
    description: "One-week trial pack for new customers, discontinued after the launch promo ended.",
    frequency: "Weekly",
    eggsPerDelivery: 6,
    deliveriesPerCycle: 1,
    cyclePrice: 199,
    discountPercent: 20,
    subscribers: 41,
    status: "Archived",
    popular: false,
    createdLabel: "Dec 2025",
  },
]