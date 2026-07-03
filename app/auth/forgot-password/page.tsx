"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeftIcon, MailCheckIcon } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError("Enter the email you signed up with.")
      return
    }

    setLoading(true)
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      // Always show the same success state — the route never reveals
      // whether the email exists, so neither should the UI.
      setSent(true)
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        description=""
        footer={
          <Link href="/auth/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
            <ArrowLeftIcon className="size-3.5" />
            Back to login
          </Link>
        }
      >
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-secondary/50 p-5">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <MailCheckIcon className="size-5" />
          </span>
          <p className="text-sm leading-6 text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>,
            we&rsquo;ve sent a link to reset your password. It expires in 30 minutes.
          </p>
          <Button variant="outline" size="sm" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset it."
      footer={
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          <ArrowLeftIcon className="size-3.5" />
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending link…" : "Send reset link"}
        </Button>
      </form>
    </AuthShell>
  )
}
