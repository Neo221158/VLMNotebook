import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./auth"
import type { User } from "./types"

/**
 * Server-side authentication helper that validates the user's session.
 *
 * This function MUST be called in Server Components to protect routes.
 * It validates the session server-side and redirects to home if invalid.
 *
 * @returns The validated session object with user data
 * @throws Redirects to "/" if no valid session exists
 *
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function ProtectedPage() {
 *   const session = await requireAuth()
 *
 *   return <div>Welcome {session.user.name}</div>
 * }
 * ```
 */
export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/")
  }

  return session
}

/**
 * Server-side helper that validates the user's session AND admin role.
 *
 * This function MUST be called in Server Components to protect admin-only routes.
 * It validates the session and checks if the user has admin role, redirecting if not.
 *
 * @returns The validated session object with admin user data
 * @throws Redirects to "/dashboard" if not authenticated or not an admin
 *
 * @example
 * ```tsx
 * // In a Server Component (admin-only page)
 * export default async function AdminPage() {
 *   const session = await requireAdmin()
 *
 *   return <div>Welcome Admin {session.user.name}</div>
 * }
 * ```
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/")
  }

  const user = session.user as User
  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return session
}

/**
 * Checks if a user object has admin role.
 *
 * @param user - The user object to check
 * @returns True if the user has admin role, false otherwise
 *
 * @example
 * ```tsx
 * const session = await requireAuth()
 * if (isAdmin(session.user)) {
 *   // Show admin features
 * }
 * ```
 */
export function isAdmin(user: unknown): boolean {
  const typedUser = user as User | undefined
  return typedUser?.role === "admin"
}
