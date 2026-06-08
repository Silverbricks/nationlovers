import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportIssueSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") ?? "createdAt";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (state) where.state = state;
    if (category) where.category = category;
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const orderBy: any = sort === "upvotes" ? { upvotes: "desc" } : { createdAt: "desc" };

    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          _count: { select: { suggestions: true, comments: true, votes: true } },
        },
      }),
      prisma.issue.count({ where }),
    ]);

    return NextResponse.json({
      data: issues,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch issues." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reportIssueSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const issue = await prisma.$transaction(async (tx) => {
      const created = await tx.issue.create({
        data: {
          ...parsed.data,
          authorId: (session.user as any).id,
          category: parsed.data.category as any,
          state: parsed.data.state as any,
          severity: parsed.data.severity as any,
          photoUrls: parsed.data.photoUrls ?? [],
        },
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
        },
      });

      await tx.issueProgress.create({
        data: { issueId: created.id, stage: "REPORTED", note: "Issue submitted by community member." },
      });

      return created;
    });

    return NextResponse.json({ data: issue, message: "Issue reported successfully." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create issue." }, { status: 500 });
  }
}
