import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPin, Calendar, User, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VoteButton } from "@/components/issues/VoteButton";
import { SuggestionList } from "@/components/issues/SuggestionList";
import { CommentThread } from "@/components/issues/CommentThread";
import { IssueProgressTracker } from "@/components/issues/IssueProgressTracker";
import { getCategoryConfig, getSeverityConfig, formatFullDate, formatUpvotes } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const issue = await prisma.issue.findUnique({ where: { id: params.id }, select: { title: true } });
  return { title: issue?.title ?? "Issue Not Found" };
}

async function getIssue(id: string) {
  return prisma.issue.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, createdAt: true } },
      suggestions: {
        orderBy: { votes: "desc" },
        include: { author: { select: { id: true, name: true, image: true, role: true } } },
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
}

export default async function IssuePage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id);
  if (!issue) notFound();

  const category = getCategoryConfig(issue.category);
  const severity = getSeverityConfig(issue.severity);
  const statusConfig = STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG];

  return (
    <div className="min-h-screen bg-grey-light pt-16">
      {/* Header */}
      <div className="bg-navy-deep py-10">
        <div className="container-wide">
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
            <Link href="/issues" className="text-white/50 hover:text-white transition-colors">Issues</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/70 truncate max-w-xs">{issue.title}</span>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${category.color}`}>
              {category.icon} {category.label}
            </span>
            <Badge variant="severity" severity={issue.severity as any}>
              {severity.label}
            </Badge>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-4 text-balance">
            {issue.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {issue.location}, {issue.state}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {formatFullDate(issue.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {issue.author.name ?? "Anonymous"}
            </span>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-navy mb-4">About This Issue</h2>
              <p className="text-grey-dark leading-relaxed whitespace-pre-wrap">{issue.description}</p>

              {/* Stats row */}
              <div className="flex items-center gap-6 pt-5 mt-5 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <VoteButton issueId={issue.id} initialUpvotes={issue.upvotes} />
                </div>
                <span className="text-gray-400 text-sm">
                  💬 {issue._count.comments} comment{issue._count.comments !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-400 text-sm">
                  💡 {issue._count.suggestions} solution{issue._count.suggestions !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Suggestions */}
            <SuggestionList issueId={issue.id} suggestions={issue.suggestions as any} />

            {/* Comments */}
            <CommentThread issueId={issue.id} comments={issue.comments as any} />
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 space-y-6">
            {/* Progress tracker */}
            <IssueProgressTracker progress={issue.progress} />

            {/* Quick actions */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-navy mb-3 text-sm uppercase tracking-wider">Take Action</h3>
              <div className="space-y-2">
                <Link href={`/suggest?issueId=${issue.id}`}>
                  <button className="w-full bg-gold text-navy-deep font-semibold py-2.5 rounded-lg text-sm hover:bg-gold-soft transition-colors">
                    💡 Suggest a Fix
                  </button>
                </Link>
                <Link href="/report">
                  <button className="w-full border-2 border-navy text-navy font-semibold py-2.5 rounded-lg text-sm hover:bg-navy hover:text-white transition-colors">
                    🚨 Report Similar Issue
                  </button>
                </Link>
              </div>
            </div>

            {/* Reporter info */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-navy mb-3 text-sm uppercase tracking-wider">Reported By</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy-royal flex items-center justify-center text-white font-bold">
                  {issue.author.name?.[0]?.toUpperCase() ?? "A"}
                </div>
                <div>
                  <p className="font-medium text-grey-dark text-sm">{issue.author.name ?? "Anonymous"}</p>
                  <p className="text-xs text-gray-400 capitalize">{issue.author.role.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
