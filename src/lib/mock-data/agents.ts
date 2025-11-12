import { Agent } from "@/lib/types";

export const agents: Agent[] = [
  {
    id: "research-assistant",
    name: "Research Assistant",
    description:
      "Your personal research companion that helps you find, analyze, and summarize academic papers, articles, and technical documentation.",
    icon: "🔬",
    category: "Research & Analysis",
    tags: ["Academic", "Papers", "Analysis", "Summarization"],
    useCases: [
      "Literature reviews and research synthesis",
      "Technical documentation analysis",
      "Citation finding and verification",
      "Research methodology consultation",
    ],
    sampleQuestions: [
      "Can you help me find recent papers on neural architecture search?",
      "Summarize the key findings from this research paper",
      "What are the current trends in transformer models?",
      "Help me understand the methodology in this study",
    ],
    color: "blue",
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
