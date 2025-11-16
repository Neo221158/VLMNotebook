import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { Citation } from "@/lib/types";
import { logger } from "@/lib/logger";

// Mark this route as dynamic (don't evaluate during build)
export const dynamic = "force-dynamic";

/**
 * POST /api/conversations/[conversationId]/messages
 * Save a new message to a conversation
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    const body = await req.json();
    const { role, content, parts, citations } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: "Role and content are required" },
        { status: 400 }
      );
    }

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json(
        { error: "Role must be 'user' or 'assistant'" },
        { status: 400 }
      );
    }

    // Fetch conversation and verify ownership
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: You don't own this conversation" },
        { status: 403 }
      );
    }

    // Save message
    const [message] = await db
      .insert(messages)
      .values({
        conversationId,
        role,
        content,
        parts: parts || null,
        citations: citations || null,
      })
      .returning();

    // Update conversation's updatedAt timestamp
    await db
      .update(conversations)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({
      id: message.id,
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      parts: message.parts,
      citations: message.citations || [],
      createdAt: message.createdAt,
    });
  } catch (error) {
    logger.error("Error saving message", { error });
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/conversations/[conversationId]/messages
 * Update a message with citations (called after citation extraction)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    const body = await req.json();
    const { messageId, citations }: { messageId: string; citations: Citation[] } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // Fetch conversation and verify ownership
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: You don't own this conversation" },
        { status: 403 }
      );
    }

    // Update message with citations
    const [updatedMessage] = await db
      .update(messages)
      .set({
        citations: citations || null,
      })
      .where(
        and(
          eq(messages.id, messageId),
          eq(messages.conversationId, conversationId)
        )
      )
      .returning();

    if (!updatedMessage) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updatedMessage.id,
      citations: updatedMessage.citations || [],
    });
  } catch (error) {
    logger.error("Error updating message citations", { error });
    return NextResponse.json(
      { error: "Failed to update message citations" },
      { status: 500 }
    );
  }
}
