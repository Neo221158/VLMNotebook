import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { listDocuments, getStoreByAgentId } from "@/lib/gemini-file-search";

/**
 * GET /api/files?agentId=xxx
 * List documents for a specific agent and user
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to view files." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Get agentId from query params
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    // 3. Get File Search store for agent
    let store;
    try {
      store = await getStoreByAgentId(agentId);
    } catch (error) {
      console.error("Failed to get File Search store:", error);
      return NextResponse.json(
        { error: "Failed to access agent's document storage." },
        { status: 500 }
      );
    }

    // 4. List documents for user
    let documents;
    try {
      documents = await listDocuments(store.id, userId);
    } catch (error) {
      console.error("Failed to list documents:", error);
      return NextResponse.json(
        { error: "Failed to retrieve documents. Please try again." },
        { status: 500 }
      );
    }

    // 5. Return documents
    return NextResponse.json(
      {
        success: true,
        documents: documents.map((doc) => ({
          id: doc.id,
          filename: doc.filename,
          mimeType: doc.mimeType,
          sizeBytes: doc.sizeBytes,
          status: doc.status,
          uploadedAt: doc.uploadedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("List documents error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
