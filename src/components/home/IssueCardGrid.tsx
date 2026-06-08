import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IssueCard } from "./IssueCard";
import { Button } from "@/components/ui/Button";
import { IssueWithAuthor } from "@/types";

interface IssueCardGridProps {
  issues: IssueWithAuthor[];
  title?: string;
  showMore?: boolean;
}

export function IssueCardGrid({
  issues,
  title = "Latest Issues Across Australia",
  showMore = true,
}: IssueCardGridProps) {
  return (
    <section className="py-12">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading">{title}</h2>
          {showMore && (
            <Link href="/issues" className="hidden sm:flex">
              <Button variant="ghost" size="sm" className="gap-1 text-navy">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

        {issues.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No issues reported yet.</p>
            <p className="text-sm mt-1">Be the first to report an issue!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}

        {showMore && issues.length > 0 && (
          <div className="mt-8 text-center sm:hidden">
            <Link href="/issues">
              <Button variant="outline">View All Issues</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
