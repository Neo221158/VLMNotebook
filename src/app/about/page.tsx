import { LegalPageLayout } from "@/components/legal-page-layout";

export default function AboutPage() {
  return (
    <LegalPageLayout title="About RAG Agent Chat" lastUpdated="November 12, 2025">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-4 text-lg">
          At RAG Agent Chat, we&apos;re on a mission to make advanced AI assistance accessible to everyone. We believe
          that specialized AI agents can transform how people work, learn, and solve problems by providing
          expert-level guidance in various domains.
        </p>
        <p className="mb-4">
          Our platform combines cutting-edge Retrieval-Augmented Generation (RAG) technology with carefully curated
          AI agents to deliver accurate, contextual, and helpful responses across diverse fields including research,
          software development, legal analysis, data science, and content creation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
        <p className="mb-4">
          RAG Agent Chat provides access to specialized AI agents designed to assist with specific tasks and domains.
          Unlike general-purpose AI assistants, each of our agents is optimized for particular use cases with
          domain-specific knowledge and capabilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Specialized Expertise</h3>
            <p className="text-sm">
              Each agent is trained and optimized for specific domains, providing more accurate and relevant responses
              than general AI assistants.
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">RAG Technology</h3>
            <p className="text-sm">
              Our agents use Retrieval-Augmented Generation to access relevant knowledge bases, ensuring responses are
              grounded in factual information.
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Privacy-Focused</h3>
            <p className="text-sm">
              Your conversations are private and secure. We implement industry-standard security practices to protect
              your data.
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Always Improving</h3>
            <p className="text-sm">
              We continuously refine our agents based on user feedback and the latest advances in AI technology.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Accuracy First</h3>
            <p>
              We prioritize accuracy and reliability in our AI responses. Our agents are designed to provide
              well-researched, fact-based information and clearly indicate when they&apos;re uncertain.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">User Privacy</h3>
            <p>
              Your privacy is paramount. We implement strict data protection measures and never sell your personal
              information. Your conversations are yours alone.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
            <p>
              We believe AI assistance should be accessible to everyone. Our platform is designed to be intuitive,
              fast, and available across all devices.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Transparency</h3>
            <p>
              We&apos;re transparent about how our AI works, what data we collect, and how we use it. We believe users
              should understand and control their AI interactions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
            <p>
              Technology evolves, and so do we. We&apos;re committed to continuously improving our agents, adding new
              capabilities, and staying at the forefront of AI innovation.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
        <p className="mb-4">
          RAG Agent Chat is built on state-of-the-art technology:
        </p>

        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>
            <strong>Retrieval-Augmented Generation (RAG):</strong> Combines the power of large language models with
            dynamic information retrieval for more accurate, up-to-date responses
          </li>
          <li>
            <strong>Vector Databases:</strong> Efficient semantic search across vast knowledge bases to find the most
            relevant information
          </li>
          <li>
            <strong>Advanced Language Models:</strong> State-of-the-art AI models fine-tuned for specific domains and
            use cases
          </li>
          <li>
            <strong>Real-time Processing:</strong> Fast, responsive interactions with minimal latency
          </li>
          <li>
            <strong>Scalable Infrastructure:</strong> Built to handle growing demand while maintaining performance
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <p className="mb-4">
          RAG Agent Chat is developed by a team of AI researchers, engineers, and domain experts passionate about
          making AI more accessible and useful. Our diverse backgrounds span machine learning, software engineering,
          natural language processing, and various specialized fields.
        </p>
        <p className="mb-4">
          We work closely with subject matter experts in each domain to ensure our agents provide accurate, reliable,
          and helpful assistance.
        </p>

        <div className="bg-muted p-6 rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-3">Join Our Team</h3>
          <p className="mb-3">
            We&apos;re always looking for talented individuals who share our passion for AI and want to help shape the
            future of intelligent assistance.
          </p>
          <p className="text-sm text-muted-foreground">
            Interested in joining us? Contact us at <strong>careers@ragagentchat.com</strong>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">The Road Ahead</h2>
        <p className="mb-4">
          We&apos;re just getting started. Here&apos;s what we&apos;re working on:
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold">More Specialized Agents</h4>
              <p className="text-sm text-muted-foreground">
                Expanding our roster to cover more domains including healthcare, finance, education, and creative
                fields
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold">Advanced Features</h4>
              <p className="text-sm text-muted-foreground">
                Document analysis, multi-modal interactions, collaborative workspaces, and integration with external
                tools
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold">API Access</h4>
              <p className="text-sm text-muted-foreground">
                Developer API to integrate our agents into your applications and workflows
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold">Customization</h4>
              <p className="text-sm text-muted-foreground">
                Tools to customize agents for your specific needs and create private knowledge bases
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="mb-4">
          We&apos;d love to hear from you! Whether you have feedback, questions, partnership inquiries, or just want to
          say hello, don&apos;t hesitate to reach out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">General Inquiries</h3>
            <p className="text-sm mb-2">
              <strong>Email:</strong> hello@ragagentchat.com
            </p>
            <p className="text-sm">
              <strong>Response Time:</strong> 24-48 hours
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Support</h3>
            <p className="text-sm mb-2">
              <strong>Email:</strong> support@ragagentchat.com
            </p>
            <p className="text-sm">
              <strong>Response Time:</strong> 12-24 hours
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Business & Partnerships</h3>
            <p className="text-sm mb-2">
              <strong>Email:</strong> business@ragagentchat.com
            </p>
            <p className="text-sm">
              <strong>Response Time:</strong> 48 hours
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Press & Media</h3>
            <p className="text-sm mb-2">
              <strong>Email:</strong> press@ragagentchat.com
            </p>
            <p className="text-sm">
              <strong>Response Time:</strong> 48 hours
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
        <p className="mb-4">
          Follow our journey and get updates on new features, agents, and improvements:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <p className="mb-4">
            Join our newsletter to receive monthly updates, tips for getting the most out of RAG Agent Chat, and early
            access to new features.
          </p>
          <p className="text-sm text-muted-foreground">Newsletter signup coming soon!</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
