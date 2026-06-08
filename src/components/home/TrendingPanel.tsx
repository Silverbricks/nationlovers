import Link from "next/link";
import { Flame, TrendingUp } from "lucide-react";
import { TrendingIssue } from "@/types";
import { getCategoryConfig, getSeverityConfig, formatUpvotes } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface TrendingPanelProps {
  issues: TrendingIssue[];
}

export function TrendingPanel({ issues }: TrendingPanelProps) {
  return (
    <section className="py-12 bg-grey-light">
      <div className="container-wide">
        <div className="max-w-sm ml-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-alert-orange" />
            <h2 className="text-lg font-bold text-navy">Trending in Australia</h2>
          </div>

          {/* Issue list */}
          <div className="space-y-3">
            {issues.map((issue, index) => {
              const category = getCategoryConfig(issue.category);
              return (
                <Link key={issue.id} href={`/issues/${issue.id}`}>
                  <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 hover:border-gold hover:shadow-sm transition-all">
                    {/* Rank */}
                    <span className="text-2xl font-extrabold text-gold leading-none min-w-[2rem] text-center">
                      {index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy line-clamp-2 mb-1">
                        {issue.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${category.color}`}>
                          {category.icon} {category.label}
                        </span>
                        <span className="text-xs text-gray-400">{issue.state}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 text-navy">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-sm font-bold">{formatUpvotes(issue.upvotes)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-4">
            <Link href="/trending">
              <Button variant="outline" fullWidth size="sm">
                See All Trending Issues
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
