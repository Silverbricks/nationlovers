import Link from "next/link";
import { MapPin, ThumbsUp, MessageCircle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IssueWithAuthor } from "@/types";
import {
  getCategoryConfig,
  getSeverityConfig,
  truncateText,
  formatDate,
  formatUpvotes,
} from "@/lib/utils";

interface IssueCardProps {
  issue: IssueWithAuthor;
}

export function IssueCard({ issue }: IssueCardProps) {
  const category = getCategoryConfig(issue.category);
  const severity = getSeverityConfig(issue.severity);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
      {/* Top color strip based on severity */}
      <div
        className={`h-1 w-full ${
          issue.severity === "CRITICAL"
            ? "bg-alert-red"
            : issue.severity === "HIGH"
            ? "bg-alert-orange"
            : issue.severity === "MEDIUM"
            ? "bg-yellow-400"
            : "bg-alert-green"
        }`}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${category.color}`}>
              {category.icon} {category.label}
            </span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {issue.state}
            </span>
          </div>
          <Badge variant="severity" severity={issue.severity as any} className="shrink-0">
            {severity.label}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/issues/${issue.id}`} className="group flex-1">
          <h3 className="font-semibold text-navy text-base leading-snug group-hover:text-navy-royal transition-colors mb-2 line-clamp-2">
            {issue.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {truncateText(issue.description, 150)}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span>{issue.location}</span>
          <span className="mx-1">·</span>
          <span>{formatDate(issue.createdAt)}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <ThumbsUp className="w-4 h-4 text-navy" />
              <span className="font-semibold text-navy">{formatUpvotes(issue.upvotes)}</span>
            </span>
            {issue._count && (
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <MessageCircle className="w-3.5 h-3.5" />
                {issue._count.comments}
              </span>
            )}
          </div>
          <Link href={`/suggest?issueId=${issue.id}`}>
            <Button size="sm" className="text-xs px-3 py-1.5 gap-1">
              <Lightbulb className="w-3.5 h-3.5" />
              Suggest Fix
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
