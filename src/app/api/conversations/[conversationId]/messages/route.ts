import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";
import { eq } from "drizzle-orm";

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
    const { role, content, parts } = body;

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
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
