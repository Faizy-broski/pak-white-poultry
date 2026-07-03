"use client"

import { useEffect, useState, type FormEvent, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2Icon } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

type ExchangeState = "checking" | "ready" | "invalid"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const router = useRouter()

  const [exchangeState, setExchangeState] = useState<ExchangeState>("checking")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      setExchangeState("invalid")
      return
    }

    const supabase = createClient()
    supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      setExchangeState(exchangeError ? "invalid" : "ready")
    })
  }, [code])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.")
        return
      }

      setDone(true)
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthShell title="Password reset" description="">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-secondary/50 p-5">
          <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2Icon className="size-5" />
          </span>
          <p className="text-sm leading-6 text-muted-foreground">
            Your password has been updated. You can now log in with your new password.
          </p>
          <Button size="sm" onClick={() => router.push("/auth/login")}>Back to login</Button>
        </div>
      </AuthShell>
    )
  }

  const linkInvalid = exchangeState === "invalid"

  return (
    <AuthShell
      title="Set a new password"
      description={
        linkInvalid
          ? "This reset link has expired or is invalid — request a new one from the forgot password page."
          : "Choose a new password for your account."
      }
      footer={
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="password">New password</Label>
          <PasswordInput
            id="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={exchangeState !== "ready"}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={exchangeState !== "ready"}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading || exchangeState !== "ready"}>
          {exchangeState === "checking"
            ? "Verifying link…"
            : loading
              ? "Resetting…"
              : "Reset password"}
        </Button>
      </form>
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}