import { requireAuth } from "@/lib/auth-helpers"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const session = await requireAuth()

  return <DashboardClient session={session} />
}
