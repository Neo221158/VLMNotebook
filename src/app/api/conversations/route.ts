import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * POST /api/conversations
 * Create a new conversation
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { agentId, title } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    // Create conversation
    const [conversation] = await db
      .insert(conversations)
      .values({
        userId: session.user.id,
        agentId,
        title: title || null,
      })
      .returning();

    return NextResponse.json({
      id: conversation.id,
      userId: conversation.userId,
      agentId: conversation.agentId,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/conversations
 * List user's conversations
 */
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    // Build query conditions
    const conditions = agentId
      ? and(
          eq(conversations.userId, session.user.id),
          eq(conversations.agentId, agentId)
        )
      : eq(conversations.userId, session.user.id);

    // Fetch conversations
    const userConversations = await db
      .select()
      .from(conversations)
      .where(conditions)
      .orderBy(desc(conversations.updatedAt));

    // Get message preview and count for each conversation
    const conversationsWithMeta = await Promise.all(
      userConversations.map(async (conversation) => {
        // Get last message
        const [lastMessage] = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, conversation.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        // Get message count
        const messageCount = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, conversation.id));

        return {
          id: conversation.id,
          userId: conversation.userId,
          agentId: conversation.agentId,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          messageCount: messageCount.length,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content.substring(0, 100), // Preview
                role: lastMessage.role,
                createdAt: lastMessage.createdAt,
              }
            : null,
        };
      })
    );

    return NextResponse.json(conversationsWithMeta);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
