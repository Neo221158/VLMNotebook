// User types (extends Better Auth user)
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: string; // "user" or "admin"
  createdAt: Date;
  updatedAt: Date;
}

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

// Citation types
export interface Citation {
  documentName: string;
  chunkText: string;
  startIndex?: number;
  endIndex?: number;
  confidence?: number;
}

// Raw grounding metadata from Google API
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  groundingSupports?: GroundingSupport[];
  webSearchQueries?: string[];
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
    text?: string;
  };
}

export interface GroundingSupport {
  segment?: {
    startIndex?: number;
    endIndex?: number;
    text?: string;
  };
  groundingChunkIndices?: number[];
  confidenceScores?: number[];
}

// Chat types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: Citation[];
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
