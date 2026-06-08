import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const issueId = searchParams.get("issueId");

    if (!issueId) {
      return NextResponse.json({ error: "issueId required." }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { issueId, parentId: null },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { id: true, name: true, image: true } },
        replies: {
          include: { author: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ data: comments });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    if (!body.issueId) {
      return NextResponse.json({ error: "issueId required." }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        issueId: body.issueId,
        parentId: parsed.data.parentId,
        authorId: (session.user as any).id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        replies: {
          include: { author: { select: { id: true, name: true, image: true } } },
        },
      },
    });

    return NextResponse.json({ data: comment, message: "Comment posted." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}
