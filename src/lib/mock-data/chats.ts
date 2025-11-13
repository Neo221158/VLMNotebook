import { ChatConversation } from "@/lib/types";

// Mock chat conversations (recent chats)
export const mockChats: ChatConversation[] = [
  {
    id: "chat-1",
    agentId: "research-assistant",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    preview: "Can you help me find papers on neural architecture search?",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "Can you help me find papers on neural architecture search?",
        timestamp: new Date(Date.now() - 1000 * 60 * 35),
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "I'd be happy to help you find papers on neural architecture search (NAS). Here are some influential papers:\n\n1. **DARTS: Differentiable Architecture Search** - A gradient-based approach\n2. **EfficientNet: Rethinking Model Scaling** - Compound scaling method\n3. **NAS-Bench-201: Extending the Scope of Reproducible Neural Architecture Search**\n\nWould you like me to summarize any of these?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
    ],
  },
  {
    id: "chat-2",
    agentId: "code-review-agent",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    preview: "Review this React component for best practices",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: "Review this React component for best practices",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "I'll review your React component. Please share the code and I'll provide feedback on:\n\n- Component structure and organization\n- State management\n- Performance optimizations\n- Accessibility\n- Type safety\n\nPaste your component code when ready!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ],
  },
  {
    id: "chat-3",
    agentId: "data-analyst",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    preview: "Analyze this sales dataset and find trends",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "Analyze this sales dataset and find trends",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          "I can help analyze your sales dataset. Please share the data (CSV, JSON, or describe the structure) and I'll:\n\n1. Perform exploratory data analysis\n2. Identify key trends and patterns\n3. Suggest visualizations\n4. Provide actionable insights\n\nWhat format is your data in?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    ],
  },
];

// Helper function to get chats by agent ID
export function getChatsByAgentId(agentId: string): ChatConversation[] {
  return mockChats.filter((chat) => chat.agentId === agentId);
}

// Helper function to get chat by ID
export function getChatById(id: string): ChatConversation | undefined {
  return mockChats.find((chat) => chat.id === id);
}

// Helper function to get recent chats (sorted by lastMessageAt)
export function getRecentChats(limit: number = 10): ChatConversation[] {
  return [...mockChats]
    .sort((a, b) => {
      const aTime = a.lastMessageAt?.getTime() ?? 0;
      const bTime = b.lastMessageAt?.getTime() ?? 0;
      return bTime - aTime;
    })
    .slice(0, limit);
}
