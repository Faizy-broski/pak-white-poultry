import Link from "next/link";

import { OrderWizard } from "@/components/dashboard/order-wizard";

function EggMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 4C12 4 6 17 6 25.5 6 33 12.5 37 20 37s14-4 14-11.5C34 17 28 4 20 4Z"
        fill="currentColor"
      />
      <path
        d="M14 17.5 18.5 22 16 26.5"
        stroke="var(--background)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <EggMark className="h-7 w-7 text-primary" />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Pak White Poultry
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link href="/login" className="hidden text-foreground/70 hover:text-foreground sm:inline">
              Login
            </Link>
            <Link href="/signup" className="hidden text-foreground/70 hover:text-foreground sm:inline">
              Sign up
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

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