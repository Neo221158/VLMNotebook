import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";
import { eq, asc, and } from "drizzle-orm";
import { logger } from "@/lib/logger";

// Mark this route as dynamic (don't evaluate during build)
export const dynamic = "force-dynamic";

/**
 * GET /api/conversations/[conversationId]
 * Fetch a single conversation with all messages
 */
export async function GET(
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

    // Fetch conversation
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

    // Verify ownership
    if (conversation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: You don't own this conversation" },
        { status: 403 }
      );
    }

    // Fetch all messages for this conversation
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({
      id: conversation.id,
      userId: conversation.userId,
      agentId: conversation.agentId,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: conversationMessages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        parts: msg.parts,
        citations: msg.citations || [], // Include citations from database
        createdAt: msg.createdAt,
      })),
    });
  } catch (error) {
    logger.error("Error fetching conversation", { error });
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conversations/[conversationId]
 * Delete a conversation and all its messages
 */
export async function DELETE(
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

    // Fetch conversation
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

    // Verify ownership
    if (conversation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: You don't own this conversation" },
        { status: 403 }
      );
    }

    // Delete messages and conversation in a transaction
    // This ensures both operations succeed or both fail
    await db.transaction(async (tx) => {
      // Delete messages first
      await tx
        .delete(messages)
        .where(eq(messages.conversationId, conversationId));

      // Then delete conversation
      await tx
        .delete(conversations)
        .where(
          and(
            eq(conversations.id, conversationId),
            eq(conversations.userId, session.user.id)
          )
        );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting conversation", { error });
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
