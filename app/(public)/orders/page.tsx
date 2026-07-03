import Link from "next/link";

import { OrderWizard } from "@/components/dashboard/order-wizard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Order fresh eggs
          </h1>
          <p className="mt-2 text-muted-foreground">
            Four quick steps — pick a box, tell us where to bring it, and pay when it arrives.
          </p>
        </div>

        <OrderWizard />
      </main>
    </div>
  );
}