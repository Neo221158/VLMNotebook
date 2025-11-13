import { requireAuth } from "@/lib/auth-helpers"
import { ProfileClient } from "@/components/profile/profile-client"

export default async function ProfilePage() {
  const session = await requireAuth()

  return <ProfileClient session={session} />
}
