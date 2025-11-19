import { Agent } from "@/lib/types";

export const agents: Agent[] = [
  {
    id: "research-assistant",
    name: "Veterinary Vaccination Assistant",
    description:
      "Expert veterinary vaccination assistant providing evidence-based guidance on vaccination protocols for dogs and cats. Delivers authoritative recommendations based on AAHA, WSAVA, and AVMA guidelines.",
    icon: "🩺",
    category: "Veterinary Medicine",
    tags: ["Vaccination", "Veterinary", "Guidelines", "Protocols"],
    useCases: [
      "Vaccination protocol recommendations for puppies and kittens",
      "Core vs. non-core vaccine guidance",
      "Booster schedule consultations",
      "Breed-specific vaccination considerations",
    ],
    sampleQuestions: [
      "What is the vaccination protocol for puppies?",
      "When should cats receive their rabies booster?",
      "What are the core vaccines for adult dogs?",
      "Are there contraindications for leptospirosis vaccine?",
    ],
    color: "green",
    fileSearchEnabled: true,
    suggestedDocuments: [
      "AAHA canine vaccination guidelines (PDF)",
      "AAFP feline vaccination guidelines (PDF)",
      "WSAVA global vaccination protocols",
      "AVMA vaccination recommendations",
      "Veterinary journal articles on vaccines",
    ],
  },
  {
    id: "code-review-agent",
    name: "Code Review Agent",
    description:
      "Expert code reviewer that analyzes your codebase, identifies bugs, suggests improvements, and ensures best practices are followed.",
    icon: "💻",
    category: "Development",
    tags: ["Code Review", "Best Practices", "Bug Detection", "Refactoring"],
    useCases: [
      "Code quality analysis and improvement",
      "Security vulnerability detection",
      "Performance optimization suggestions",
      "Architecture and design pattern reviews",
    ],
    sampleQuestions: [
      "Review this React component for best practices",
      "Are there any security vulnerabilities in this code?",
      "How can I optimize this database query?",
      "Suggest improvements for this API design",
    ],
    color: "green",
    fileSearchEnabled: true,
    suggestedDocuments: [
      "Source code files (.js, .ts, .py, etc.)",
      "Configuration files",
      "Package manifests (package.json, requirements.txt)",
      "Documentation files",
      "Test files",
    ],
  },
  {
    id: "legal-advisor",
    name: "Legal Document Advisor",
    description:
      "Specialized agent for analyzing legal documents, contracts, and policies. Provides insights on terms, risks, and compliance requirements.",
    icon: "⚖️",
    category: "Legal & Compliance",
    tags: ["Contracts", "Compliance", "Risk Analysis", "Legal Terms"],
    useCases: [
      "Contract review and risk assessment",
      "Privacy policy compliance checking",
      "Terms of service analysis",
      "Legal terminology explanation",
    ],
    sampleQuestions: [
      "Review this employment contract for red flags",
      "Is this privacy policy GDPR compliant?",
      "Explain the liability clauses in this agreement",
      "What risks should I be aware of in this contract?",
    ],
    color: "purple",
    fileSearchEnabled: true,
    suggestedDocuments: [
      "Contracts (PDF, DOCX)",
      "Legal agreements",
      "Terms of service documents",
      "Privacy policies",
      "Compliance regulations",
    ],
  },
  {
    id: "data-analyst",
    name: "Data Analysis Expert",
    description:
      "Advanced data analysis agent that helps you understand datasets, create visualizations, and extract meaningful insights from your data.",
    icon: "📊",
    category: "Data & Analytics",
    tags: ["Data Analysis", "Visualization", "Statistics", "Insights"],
    useCases: [
      "Exploratory data analysis",
      "Statistical analysis and hypothesis testing",
      "Data visualization recommendations",
      "Trend identification and forecasting",
    ],
    sampleQuestions: [
      "Analyze this sales dataset and find trends",
      "What visualization would work best for this data?",
      "Perform a statistical test on these two groups",
      "Help me identify outliers in this dataset",
    ],
    color: "orange",
    fileSearchEnabled: true,
    suggestedDocuments: [
      "CSV datasets",
      "Excel spreadsheets (.xlsx)",
      "JSON data files",
      "Statistical reports (PDF)",
      "Data dictionaries and documentation",
    ],
  },
  {
    id: "content-writer",
    name: "Content Writing Assistant",
    description:
      "Creative writing companion for blogs, marketing copy, technical docs, and more. Helps with ideation, drafting, and editing.",
    icon: "✍️",
    category: "Content & Marketing",
    tags: ["Writing", "Copywriting", "Editing", "SEO"],
    useCases: [
      "Blog post writing and editing",
      "Marketing copy creation",
      "Technical documentation",
      "Content strategy and ideation",
    ],
    sampleQuestions: [
      "Help me write a blog post about AI ethics",
      "Create marketing copy for a new SaaS product",
      "Improve the clarity of this technical documentation",
      "Suggest engaging titles for my article",
    ],
    color: "pink",
    fileSearchEnabled: true,
    suggestedDocuments: [
      "Draft articles (DOCX, TXT, Markdown)",
      "Style guides (PDF)",
      "Brand guidelines",
      "Content briefs",
      "Competitor content samples",
    ],
  },
  {
    id: "rabies-auth-finder",
    name: "Rabies Authority Finder",
    description:
      "Chat with an AI assistant to find rabies reporting authorities, veterinarians, and contact information by city or region. Get instant access to reporting software, email contacts, and phone numbers from our database of 165+ Israeli authorities.",
    icon: "🏛️",
    category: "Veterinary & Public Health",
    tags: ["Rabies", "Veterinary", "Public Health", "Authorities", "Database"],
    useCases: [
      "Find rabies reporting authority for any city in Israel",
      "Get regional veterinarian contact information",
      "Find out which reporting software is used in your area",
      "Access email and phone contacts for rabies authorities",
    ],
    sampleQuestions: [
      "What's the rabies authority in Tel Aviv?",
      "Who handles rabies reporting in Jerusalem?",
      "How do I contact the veterinarian for Haifa?",
      "What software does Be'er Sheva use for rabies reporting?",
      "Give me the contact info for the Eilat rabies authority",
    ],
    color: "blue",
    fileSearchEnabled: false, // This is database-backed, not File Search
  },
];

// Helper function to get agent by ID
export function getAgentById(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id);
}

// Helper function to get agents by category
export function getAgentsByCategory(category: string): Agent[] {
  return agents.filter((agent) => agent.category === category);
}
