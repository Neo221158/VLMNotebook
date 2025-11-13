import { DocsLayout } from "@/components/docs/docs-layout";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { DocSection } from "@/components/docs/doc-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tocItems = [
  { id: "getting-started", title: "Getting Started" },
  { id: "how-to-use", title: "How to Use" },
  { id: "faq", title: "FAQ" },
  { id: "troubleshooting", title: "Troubleshooting" },
];

export default function DocsPage() {
  return (
    <DocsLayout tableOfContents={<TableOfContents items={tocItems} />}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about using RAG Agent Chat
        </p>
      </div>

      <DocSection id="getting-started" title="Getting Started">
        <h3 className="text-xl font-semibold mb-3">Welcome to RAG Agent Chat</h3>
        <p className="mb-4">
          RAG Agent Chat is a platform that connects you with specialized AI agents designed to help with various tasks.
          Each agent is powered by advanced Retrieval-Augmented Generation (RAG) technology, providing accurate and
          contextual responses based on their domain expertise.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">Quick Start Guide</h3>
        <ol className="list-decimal list-inside space-y-3 mb-4">
          <li>
            <strong>Create an Account:</strong> Click the &quot;Sign In&quot; button in the header and authenticate with Google.
            Your account is created automatically on first sign-in.
          </li>
          <li>
            <strong>Browse Agents:</strong> View the available AI agents on the home page. Each agent specializes in
            different areas like research, code review, legal advice, data analysis, and content writing.
          </li>
          <li>
            <strong>Start a Conversation:</strong> Click &quot;Start Chat&quot; on any agent card to begin a conversation. You can
            also click &quot;Preview&quot; to see more details about the agent&apos;s capabilities.
          </li>
          <li>
            <strong>Ask Questions:</strong> Type your question or use one of the starter prompts to begin. The agent will
            respond with detailed, contextual information.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mb-3 mt-6">Available Agents</h3>
        <p className="mb-4">
          We currently offer 5 specialized agents:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Research Assistant:</strong> Helps with academic research, literature reviews, and scientific queries</li>
          <li><strong>Code Review Agent:</strong> Reviews code, suggests improvements, and helps debug issues</li>
          <li><strong>Legal Document Advisor:</strong> Assists with understanding legal documents and compliance questions</li>
          <li><strong>Data Analysis Expert:</strong> Analyzes data patterns and provides statistical insights</li>
          <li><strong>Content Writing Assistant:</strong> Helps create engaging content, articles, and marketing copy</li>
        </ul>
      </DocSection>

      <DocSection id="how-to-use" title="How to Use">
        <h3 className="text-xl font-semibold mb-3">Using the Chat Interface</h3>
        <p className="mb-4">
          The chat interface is designed to be intuitive and familiar. Here&apos;s how to get the most out of it:
        </p>

        <h4 className="text-lg font-semibold mb-2 mt-4">Sending Messages</h4>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Type your message in the text area at the bottom of the chat</li>
          <li>Press <kbd className="px-2 py-1 bg-muted rounded text-sm">Enter</kbd> to send your message</li>
          <li>Press <kbd className="px-2 py-1 bg-muted rounded text-sm">Shift</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-sm">Enter</kbd> to add a new line without sending</li>
          <li>The text area automatically expands as you type (up to 200px)</li>
        </ul>

        <h4 className="text-lg font-semibold mb-2 mt-4">Starter Prompts</h4>
        <p className="mb-4">
          When you first open a chat with an agent, you&apos;ll see 4 starter prompts. These are example questions designed to
          showcase the agent&apos;s capabilities. Click any starter prompt to automatically populate the input field.
        </p>

        <h4 className="text-lg font-semibold mb-2 mt-4">Reading Responses</h4>
        <p className="mb-4">
          Agent responses support rich formatting including:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Bold text</strong> and <em>italic text</em></li>
          <li>Code blocks with syntax highlighting</li>
          <li>Numbered and bulleted lists</li>
          <li>Blockquotes for references</li>
          <li>Clickable links (open in new tabs)</li>
        </ul>

        <h4 className="text-lg font-semibold mb-2 mt-4">Managing Conversations</h4>
        <p className="mb-4">
          Access your conversation history from the Dashboard:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>View recent conversations in the &quot;Recent Conversations&quot; section</li>
          <li>Click any conversation to resume where you left off</li>
          <li>Each conversation is tied to a specific agent</li>
          <li>Conversations are automatically saved as you chat</li>
        </ul>

        <h4 className="text-lg font-semibold mb-2 mt-4">Best Practices</h4>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Be specific in your questions for more accurate responses</li>
          <li>Provide context when asking follow-up questions</li>
          <li>Use the appropriate agent for your task</li>
          <li>Break complex questions into smaller parts</li>
          <li>Review the agent&apos;s use cases before starting a conversation</li>
        </ul>
      </DocSection>

      <DocSection id="faq" title="Frequently Asked Questions">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is RAG technology?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                RAG (Retrieval-Augmented Generation) is an AI technique that enhances language models by allowing them
                to retrieve relevant information from a knowledge base before generating responses. This results in more
                accurate, up-to-date, and contextual answers.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How many conversations can I have?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                There is no limit to the number of conversations you can have. You can create as many conversations with
                different agents as you need. Your conversation history is preserved and accessible from your dashboard.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Are my conversations private?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Yes, your conversations are private and secure. Only you can access your chat history. We use
                industry-standard encryption and security practices to protect your data. For more details, please
                review our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Can I use multiple agents in the same conversation?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Currently, each conversation is tied to a single agent. However, you can easily switch between agents
                by starting a new conversation from the dashboard. Each agent is optimized for specific tasks, so using
                the right agent for each question will give you the best results.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>How do I choose the right agent?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Each agent card displays its specialization, tags, and use cases. Click &quot;Preview&quot; on an agent card to
                see detailed information about its capabilities and sample questions. Choose the agent whose expertise
                best matches your question or task.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>Can I export my conversations?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                The export feature is currently in development. Soon you&apos;ll be able to export your conversations in
                various formats (PDF, Markdown, etc.) from the chat options menu.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>What should I do if an agent gives incorrect information?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                While our agents strive for accuracy, AI can sometimes make mistakes. Always verify important
                information from authoritative sources. If you notice consistent issues with an agent, please contact
                our support team with specific examples so we can improve the system.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>Do you offer an API for developers?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                API access is planned for future releases. You can view your API key placeholder in your profile page.
                Join our mailing list to be notified when API access becomes available.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DocSection>

      <DocSection id="troubleshooting" title="Troubleshooting">
        <h3 className="text-xl font-semibold mb-3">Common Issues and Solutions</h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Agent not responding</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Check your internet connection</li>
              <li>Refresh the page and try again</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try using a different browser</li>
              <li>If the issue persists, the service may be temporarily unavailable</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Cannot sign in</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ensure you&apos;re using Google authentication</li>
              <li>Check that third-party cookies are enabled in your browser</li>
              <li>Try signing in using an incognito/private browsing window</li>
              <li>Disable browser extensions that might interfere with authentication</li>
              <li>Make sure you&apos;re using a supported browser (Chrome, Firefox, Safari, Edge)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Conversation history not showing</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ensure you&apos;re signed in to the same account</li>
              <li>Check that you&apos;re on the Dashboard page</li>
              <li>Refresh the page to reload your conversations</li>
              <li>If you just created a conversation, it may take a moment to appear</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Chat interface looks broken</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Try refreshing the page</li>
              <li>Clear your browser cache</li>
              <li>Ensure you&apos;re using the latest version of your browser</li>
              <li>Try disabling browser extensions</li>
              <li>Check if dark mode is causing display issues and toggle it</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Messages sending slowly</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Complex questions may take longer to process</li>
              <li>Check your internet connection speed</li>
              <li>During peak usage times, responses may be slower</li>
              <li>Very long messages may take more time to analyze</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Dark mode not working</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Click the theme toggle in the header</li>
              <li>Your preference is saved automatically</li>
              <li>Clear browser cache if the setting doesn&apos;t persist</li>
              <li>Check that JavaScript is enabled in your browser</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Still Need Help?</h4>
          <p className="mb-4">
            If you&apos;re experiencing issues not covered here, please reach out to our support team. Include:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>A description of the problem</li>
            <li>What you were trying to do when the issue occurred</li>
            <li>Your browser and operating system</li>
            <li>Any error messages you received</li>
            <li>Screenshots if applicable</li>
          </ul>
        </div>
      </DocSection>
    </DocsLayout>
  );
}
