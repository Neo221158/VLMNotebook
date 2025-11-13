import { requireAuth } from "@/lib/auth-helpers"
import { ChatClient } from "@/components/chat/chat-client"

export default async function ChatPage() {
  const session = await requireAuth()

  return <ChatClient session={session} />
}
