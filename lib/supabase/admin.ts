import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Service-role client — bypasses Row Level Security entirely.
 * NEVER import this in a Client Component or expose SUPABASE_SERVICE_ROLE_KEY
 * to the browser. Use only inside Route Handlers / Server Actions for
 * privileged operations RLS can't express, e.g.:
 *   - admin user management (supabase.auth.admin.listUsers / deleteUser)
 *   - cross-cutting analytics that read across all customers' data
 *   - scheduled jobs (cron routes) with no end-user session
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}