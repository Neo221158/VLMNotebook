import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./auth"

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
