import { createClient } from "@/lib/supabase/server"

type AuthResult =
  | { ok: true; userId: string; role: "admin" | "customer"; email: string | null }
  | { ok: false; message: string; status: number }

/**
 * Verifies there's a logged-in Supabase user and looks up their role
 * from `profiles`. Use at the top of any protected Route Handler:
 *
 *   const auth = await requireUser()
 *   if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })
 */
export async function requireUser(): Promise<AuthResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { ok: false, message: "Unauthorized.", status: 401 }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  return {
    ok: true,
    userId: user.id,
    email: user.email ?? null,
    role: (profile?.role as "admin" | "customer") ?? "customer",
  }
}

/**
 * Same as requireUser(), but also rejects non-admins with a 403.
 * Use for admin-only mutations (orders/customers/plans management).
 */
export async function requireAdmin(): Promise<AuthResult> {
  const auth = await requireUser()
  if (!auth.ok) return auth

  if (auth.role !== "admin") {
    return { ok: false, message: "Admins only.", status: 403 }
  }

  return auth
}