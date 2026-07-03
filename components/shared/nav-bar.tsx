import React from 'react'
import Link from 'next/link'

function EggMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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

const NavBar = () => {
  return (
    <div>
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <EggMark className="h-7 w-7 text-primary" />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Pak White Poultry
            </span>
          </Link>

          <div className="flex items-center gap-3 text-sm font-medium">
            <Link
              href="/orders"
              className="hidden text-foreground/70 transition-colors hover:text-foreground sm:inline"
            >
              Order Now
            </Link>
            <Link
              href="/auth/login"
              className="hidden text-foreground/70 transition-colors hover:text-foreground sm:inline"
            >
              Login
            </Link>
            <Link
              href="/auth/sign-up"
              className="hidden text-foreground/70 transition-colors hover:text-foreground sm:inline"
            >
              Sign up
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-4 py-2 text-primary-foreground transition-colors hover:opacity-90"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default NavBar
