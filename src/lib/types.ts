// Agent types
export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  category: string;
  tags: string[];
  useCases: string[];
  sampleQuestions: string[];
  color: string; // for theming - tailwind color class
}

// Chat types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  agentId: string;
  messages: ChatMessage[];
  lastMessageAt: Date;
  preview: string; // first user message or summary
}
