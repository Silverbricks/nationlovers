import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Flame, TrendingUp } from "lucide-react";
import { getCategoryConfig, getSeverityConfig, formatUpvotes, formatDate } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Trending Australia" };

async function getTrendingIssues() {
  return prisma.issue.findMany({
    take: 20,
    orderBy: { upvotes: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { suggestions: true, comments: true } },
    },
  });
}

async function getCategoryBreakdown() {
  return prisma.issue.groupBy({
    by: ["category"],
    _sum: { upvotes: true },
    _count: { id: true },
    orderBy: { _sum: { upvotes: "desc" } },
  });
}

export default async function TrendingPage() {
  const [issues, breakdown] = await Promise.all([getTrendingIssues(), getCategoryBreakdown()]);
  const maxUpvotes = breakdown.reduce((max, b) => Math.max(max, b._sum.upvotes ?? 0), 0);

  return (
    <div className="min-h-screen bg-grey-light pt-16">
      <div className="bg-navy-deep py-10">
        <div className="container-wide">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-8 h-8 text-alert-orange" />
            <h1 className="text-3xl font-extrabold text-white">Trending Australia</h1>
          </div>
          <p className="text-white/60">The most upvoted issues across all of Australia</p>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Issue list */}
          <div className="flex-1">
            <h2 className="section-heading">Top 20 Issues</h2>
            <div className="space-y-4">
              {issues.map((issue, index) => {
                const category = getCategoryConfig(issue.category);
                const severity = getSeverityConfig(issue.severity);
                return (
                  <Link key={issue.id} href={`/issues/${issue.id}`}>
                    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gold hover:shadow-sm transition-all flex items-start gap-4">
                      {/* Rank */}
                      <span className={`text-3xl font-extrabold min-w-[3rem] text-center leading-none mt-1 ${
                        index === 0 ? "text-gold" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-gray-300"
                      }`}>
                        {index + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${category.color}`}>
                            {category.icon} {category.label}
                          </span>
                          <Badge variant="severity" severity={issue.severity as any}>{severity.label}</Badge>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">{issue.state}</span>
                        </div>
                        <h3 className="font-semibold text-navy leading-snug line-clamp-2">{issue.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {issue._count.suggestions} solutions · {issue._count.comments} comments · {formatDate(issue.createdAt)}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end">
                        <div className="flex items-center gap-1 text-navy font-bold">
                          <TrendingUp className="w-4 h-4 text-alert-orange" />
                          {formatUpvotes(issue.upvotes)}
                        </div>
                        <p className="text-xs text-gray-400">upvotes</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="lg:w-72 shrink-0">
            <h2 className="section-heading">By Category</h2>
            <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
              {breakdown.map((item) => {
                const category = getCategoryConfig(item.category);
                const pct = maxUpvotes > 0 ? ((item._sum.upvotes ?? 0) / maxUpvotes) * 100 : 0;
                return (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-navy">
                        {category.icon} {category.label}
                      </span>
                      <span className="text-xs text-gray-400">{item._count.id} issues</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatUpvotes(item._sum.upvotes ?? 0)} total upvotes</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
