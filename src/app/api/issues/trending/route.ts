import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let issues = await prisma.issue.findMany({
      take: 5,
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { upvotes: "desc" },
      select: { id: true, title: true, category: true, state: true, upvotes: true, severity: true },
    });

    if (issues.length < 5) {
      issues = await prisma.issue.findMany({
        take: 5,
        orderBy: { upvotes: "desc" },
        select: { id: true, title: true, category: true, state: true, upvotes: true, severity: true },
      });
    }

    return NextResponse.json({ data: issues });
  } catch {
    return NextResponse.json({ error: "Failed to fetch trending issues." }, { status: 500 });
  }
}
