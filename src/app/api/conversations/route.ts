import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  rateLimit,
  RateLimitPresets,
  createRateLimitResponse,
  createRateLimitHeaders,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// Mark this route as dynamic (don't evaluate during build)
export const dynamic = "force-dynamic";

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

    // Rate limiting: 5 conversation creations per minute
    const rateLimitResult = rateLimit(
      `conversation-create:${session.user.id}`,
      RateLimitPresets.conversationCreate
    );

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(
        RateLimitPresets.conversationCreate,
        rateLimitResult
      );
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

    return NextResponse.json(
      {
        id: conversation.id,
        userId: conversation.userId,
        agentId: conversation.agentId,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      {
        headers: createRateLimitHeaders(
          RateLimitPresets.conversationCreate,
          rateLimitResult
        ),
      }
    );
  } catch (error) {
    logger.error("Error creating conversation", { error });
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

    // Fetch conversations with message metadata in a single query
    // This uses SQL subqueries to avoid N+1 query problem
    const conversationsWithMeta = await db
      .select({
        id: conversations.id,
        userId: conversations.userId,
        agentId: conversations.agentId,
        title: conversations.title,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        // Subquery for last message content
        lastMessageContent: sql<string | null>`(
          SELECT content
          FROM ${messages}
          WHERE ${messages.conversationId} = ${conversations.id}
          ORDER BY ${messages.createdAt} DESC
          LIMIT 1
        )`,
        // Subquery for last message role
        lastMessageRole: sql<string | null>`(
          SELECT role
          FROM ${messages}
          WHERE ${messages.conversationId} = ${conversations.id}
          ORDER BY ${messages.createdAt} DESC
          LIMIT 1
        )`,
        // Subquery for last message timestamp
        lastMessageCreatedAt: sql<Date | null>`(
          SELECT created_at
          FROM ${messages}
          WHERE ${messages.conversationId} = ${conversations.id}
          ORDER BY ${messages.createdAt} DESC
          LIMIT 1
        )`,
        // Subquery for message count
        messageCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM ${messages}
          WHERE ${messages.conversationId} = ${conversations.id}
        )`,
      })
      .from(conversations)
      .where(conditions)
      .orderBy(desc(conversations.updatedAt));

    // Format the response
    const formattedConversations = conversationsWithMeta.map((conv) => ({
      id: conv.id,
      userId: conv.userId,
      agentId: conv.agentId,
      title: conv.title,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messageCount: conv.messageCount,
      lastMessage: conv.lastMessageContent
        ? {
            content: conv.lastMessageContent.substring(0, 100), // Preview
            role: conv.lastMessageRole!,
            createdAt: conv.lastMessageCreatedAt!,
          }
        : null,
    }));

    return NextResponse.json(formattedConversations);
  } catch (error) {
    logger.error("Error fetching conversations", { error });
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
