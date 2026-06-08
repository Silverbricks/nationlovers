import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { issueId, suggestionId, type } = body;

    if (!issueId && !suggestionId) {
      return NextResponse.json({ error: "issueId or suggestionId required." }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      if (issueId) {
        const existing = await tx.vote.findUnique({
          where: { userId_issueId: { userId, issueId } },
        });

        if (existing) {
          // Toggle: remove vote if same type
          if (existing.type === type) {
            await tx.vote.delete({ where: { userId_issueId: { userId, issueId } } });
            await tx.issue.update({
              where: { id: issueId },
              data: { upvotes: { decrement: 1 } },
            });
            return { action: "removed", upvotes: null };
          } else {
            // Change vote type
            await tx.vote.update({
              where: { userId_issueId: { userId, issueId } },
              data: { type },
            });
            return { action: "changed" };
          }
        } else {
          await tx.vote.create({ data: { userId, issueId, type } });
          const updated = await tx.issue.update({
            where: { id: issueId },
            data: { upvotes: { increment: 1 } },
          });
          return { action: "added", upvotes: updated.upvotes };
        }
      }

      if (suggestionId) {
        const existing = await tx.vote.findUnique({
          where: { userId_suggestionId: { userId, suggestionId } },
        });

        if (existing) {
          if (existing.type === type) {
            await tx.vote.delete({ where: { userId_suggestionId: { userId, suggestionId } } });
            await tx.suggestion.update({
              where: { id: suggestionId },
              data: { votes: { decrement: 1 } },
            });
            return { action: "removed" };
          }
        } else {
          await tx.vote.create({ data: { userId, suggestionId, type } });
          const updated = await tx.suggestion.update({
            where: { id: suggestionId },
            data: { votes: { increment: 1 } },
          });
          return { action: "added", votes: updated.votes };
        }
      }

      return { action: "noop" };
    });

    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Failed to register vote." }, { status: 500 });
  }
}
