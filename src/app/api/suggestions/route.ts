import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { suggestFixSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const issueId = searchParams.get("issueId");
    const sort = searchParams.get("sort") ?? "votes";

    const where: any = {};
    if (issueId) where.issueId = issueId;

    const suggestions = await prisma.suggestion.findMany({
      where,
      orderBy: sort === "votes" ? { votes: "desc" } : { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
      },
    });

    return NextResponse.json({ data: suggestions });
  } catch {
    return NextResponse.json({ error: "Failed to fetch suggestions." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = suggestFixSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const issue = await prisma.issue.findUnique({ where: { id: parsed.data.issueId } });
    if (!issue) return NextResponse.json({ error: "Issue not found." }, { status: 404 });

    const suggestion = await prisma.suggestion.create({
      data: {
        ...parsed.data,
        authorId: (session.user as any).id,
      },
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
      },
    });

    // Update issue progress if not already at SUGGESTIONS_ADDED
    const existingProgress = await prisma.issueProgress.findFirst({
      where: { issueId: parsed.data.issueId, stage: "SUGGESTIONS_ADDED" },
    });
    if (!existingProgress) {
      await prisma.issueProgress.create({
        data: { issueId: parsed.data.issueId, stage: "SUGGESTIONS_ADDED", note: "First solution submitted." },
      });
    }

    return NextResponse.json({ data: suggestion, message: "Solution submitted successfully." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit suggestion." }, { status: 500 });
  }
}
