import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshes the session if it's expired — required for Server Components
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard")
  // const isAuthRoute =
  //   request.nextUrl.pathname.startsWith("/auth/login") ||
  //   request.nextUrl.pathname.startsWith("/auth/sign-up")

  // if (!user && isDashboardRoute) {
  //   const redirectUrl = new URL("/auth/login", request.url)
  //   return NextResponse.redirect(redirectUrl)
  // }

  // if (user && isAuthRoute) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url))
  // }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}