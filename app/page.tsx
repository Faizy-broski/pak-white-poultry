"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

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

const pillars = [
  {
    label: "Farm Raised",
    copy: "Open barns, clean water and daylight — no shortcuts on how our birds live.",
  },
  {
    label: "Feed Controlled",
    copy: "Every batch is fed a traceable, antibiotic-free diet from day one.",
  },
  {
    label: "Delivered Fresh",
    copy: "Processed and out for delivery the same day — nothing sits in storage.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleNotify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
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
              href="/login"
              className="hidden text-foreground/70 transition-colors hover:text-foreground sm:inline"
            >
              Login
            </Link>
            <Link
              href="/signup"
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

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center px-6 pb-24 pt-20 sm:pt-28">
        <span className="rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Launching Soon
        </span>

        <h1 className="mt-8 max-w-2xl text-balance text-center font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Something&rsquo;s hatching at{" "}
          <span className="text-primary">Pak White Poultry</span>
        </h1>

        <p className="mt-5 max-w-lg text-balance text-center text-base leading-7 text-muted-foreground sm:text-lg">
          We&rsquo;re building an easier way to order farm-fresh poultry and
          eggs online, straight from our farms to your door. Leave your email
          and we&rsquo;ll let you know the moment we&rsquo;re live.
        </p>

        {/* Notify form */}
        <form
          onSubmit={handleNotify}
          className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="notify-email" className="sr-only">
            Email address
          </label>
          <input
            id="notify-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            {submitted ? "You're on the list" : "Notify me"}
          </button>
        </form>
        {submitted && (
          <p className="mt-3 text-sm text-muted-foreground">
            Thanks — we&rsquo;ll email {email} as soon as we launch.
          </p>
        )}

        {/* Pillars */}
        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-10 border-t border-border pt-16 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.label} className="flex flex-col items-center text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary text-primary">
                <EggMark className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold">
                {pillar.label}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {pillar.copy}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pak White Poultry. All rights reserved.
      </footer>
    </div>
  );
}