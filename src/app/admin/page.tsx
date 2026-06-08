import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckCircle, XCircle, Users, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { getCategoryConfig, getSeverityConfig, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Admin Panel" };

async function getStats() {
  const [totalIssues, pendingIssues, totalUsers, resolvedIssues, totalSuggestions] = await Promise.all([
    prisma.issue.count(),
    prisma.issue.count({ where: { status: "REPORTED" } }),
    prisma.user.count(),
    prisma.issue.count({ where: { status: "RESOLVED" } }),
    prisma.suggestion.count(),
  ]);
  return { totalIssues, pendingIssues, totalUsers, resolvedIssues, totalSuggestions };
}

async function getRecentUnverified() {
  return prisma.issue.findMany({
    where: { status: "REPORTED" },
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { suggestions: true, comments: true } },
    },
  });
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/login");

  const [stats, unverified] = await Promise.all([getStats(), getRecentUnverified()]);

  const statCards = [
    { label: "Total Issues", value: stats.totalIssues, icon: AlertTriangle, color: "text-alert-orange" },
    { label: "Pending Review", value: stats.pendingIssues, icon: AlertTriangle, color: "text-alert-red" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-navy" },
    { label: "Issues Resolved", value: stats.resolvedIssues, icon: CheckCircle, color: "text-alert-green" },
    { label: "Solutions Submitted", value: stats.totalSuggestions, icon: Lightbulb, color: "text-gold" },
  ];

  return (
    <div className="min-h-screen bg-grey-light pt-16">
      <div className="bg-navy-deep py-8">
        <div className="container-wide">
          <h1 className="text-2xl font-extrabold text-white">🏛️ Admin Panel</h1>
          <p className="text-white/60 text-sm mt-1">Welcome back, {session.user?.name}</p>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <Icon className={`w-6 h-6 mb-2 ${color}`} />
              <p className="text-2xl font-extrabold text-navy">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Unverified issues */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-navy text-lg">Issues Pending Review ({unverified.length})</h2>
            <Link href="/issues?status=REPORTED" className="text-sm text-navy-royal hover:underline">
              View All →
            </Link>
          </div>

          {unverified.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-alert-green" />
              <p>All issues have been reviewed!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {unverified.map((issue) => {
                const category = getCategoryConfig(issue.category);
                const severity = getSeverityConfig(issue.severity);
                return (
                  <div key={issue.id} className="p-4 flex items-start gap-4 hover:bg-grey-light transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${category.color}`}>
                          {category.icon} {category.label}
                        </span>
                        <Badge variant="severity" severity={issue.severity as any}>{severity.label}</Badge>
                        <span className="text-xs text-gray-400">{issue.state}</span>
                      </div>
                      <Link href={`/issues/${issue.id}`} className="font-semibold text-navy hover:text-navy-royal text-sm">
                        {issue.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        by {issue.author.name} · {formatDate(issue.createdAt)} · {issue._count.comments} comments
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <AdminVerifyButton issueId={issue.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminVerifyButton({ issueId }: { issueId: string }) {
  return (
    <Link
      href={`/issues/${issueId}`}
      className="text-xs bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-navy-royal transition-colors font-semibold"
    >
      Review →
    </Link>
  );
}
