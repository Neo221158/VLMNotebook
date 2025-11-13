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
  systemPrompt?: string; // AI system prompt for this agent
  fileSearchEnabled: boolean; // Whether this agent supports RAG with File Search
  suggestedDocuments?: string[]; // Examples of documents users can upload
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
  agentName?: string;
  agentIcon?: string;
  messages?: ChatMessage[];
  lastMessageAt?: Date;
  preview: string; // first user message or summary
  timestamp?: Date;
}
