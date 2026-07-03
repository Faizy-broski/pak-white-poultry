import Link from "next/link"
import { TruckIcon, LeafIcon, WalletIcon } from "lucide-react"

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
  )
}

const trustPoints = [
  { icon: LeafIcon, label: "Farm raised, no shortcuts" },
  { icon: TruckIcon, label: "Delivered next day, before 9 PM" },
  { icon: WalletIcon, label: "Pay on delivery — Cash or UPI" },
]

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Brand panel */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-foreground p-12 text-background lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-primary/10 blur-3xl"
        />

        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <EggMark className="size-5" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">
            Pak White Poultry
          </span>
        </Link>

        <div className="relative">
          <p className="font-serif text-3xl font-semibold leading-tight">
            Fresh eggs, delivered to your door — the next day, every time.
          </p>
          <div className="mt-8 space-y-4">
            {trustPoints.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background/10">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm text-background/80">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-background/50">
          © {new Date().getFullYear()} Pak White Poultry. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <EggMark className="size-4" />
            </span>
            <span className="font-serif text-base font-semibold tracking-tight">
              Pak White Poultry
            </span>
          </Link>

          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  )
}