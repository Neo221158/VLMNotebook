import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteDocument } from "@/lib/gemini-file-search";

/**
 * DELETE /api/files/[fileId]
 * Delete a document
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to delete files." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Get fileId from params
    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // 3. Delete document (with ownership verification)
    try {
      await deleteDocument(fileId, userId);
    } catch (error) {
      console.error("Failed to delete document:", error);

      // Check if error is due to ownership
      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Document not found or you do not have permission to delete it." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Failed to delete document. Please try again." },
        { status: 500 }
      );
    }

    // 4. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Document deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
