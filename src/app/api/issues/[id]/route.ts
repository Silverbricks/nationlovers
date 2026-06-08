import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, image: true, role: true, createdAt: true } },
        suggestions: {
          orderBy: { votes: "desc" },
          include: {
            author: { select: { id: true, name: true, image: true, role: true } },
          },
        },
        comments: {
          where: { parentId: null },
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, name: true, image: true } },
            replies: {
              include: { author: { select: { id: true, name: true, image: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
        },
        progress: { orderBy: { updatedAt: "asc" } },
        _count: { select: { suggestions: true, comments: true, votes: true } },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found." }, { status: 404 });
    }

    return NextResponse.json({ data: issue });
  } catch {
    return NextResponse.json({ error: "Failed to fetch issue." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    const issue = await prisma.issue.findUnique({ where: { id: params.id } });
    if (!issue) return NextResponse.json({ error: "Issue not found." }, { status: 404 });

    const isAdmin = userRole === "ADMIN";
    const isAuthor = issue.authorId === userId;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    }

    // Authors can only edit their own REPORTED issues (not yet verified)
    if (isAuthor && !isAdmin && issue.status !== "REPORTED") {
      return NextResponse.json({ error: "Cannot edit a verified issue." }, { status: 403 });
    }

    const allowedFields = isAdmin
      ? ["title", "description", "status", "severity", "category", "location", "state"]
      : ["title", "description", "location"];

    const updates: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    // If admin is updating status, add a progress record
    if (isAdmin && body.status && body.status !== issue.status) {
      const stageMap: Record<string, string> = {
        VERIFIED: "VERIFIED",
        IN_PROGRESS: "SUGGESTIONS_ADDED",
        RESOLVED: "SHARED",
      };
      if (stageMap[body.status]) {
        await prisma.issueProgress.create({
          data: {
            issueId: params.id,
            stage: stageMap[body.status] as any,
            note: body.progressNote ?? `Status updated to ${body.status}.`,
          },
        });
      }
    }

    const updated = await prisma.issue.update({
      where: { id: params.id },
      data: updates,
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
      },
    });

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update issue." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    await prisma.issue.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Issue deleted." });
  } catch {
    return NextResponse.json({ error: "Failed to delete issue." }, { status: 500 });
  }
}
