import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { IssueCard } from "@/components/home/IssueCard";
import { CATEGORIES, STATES, SEVERITY_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Browse Issues" };

interface SearchParams {
  state?: string;
  category?: string;
  severity?: string;
  status?: string;
  sort?: string;
  page?: string;
}

async function getIssues(params: SearchParams) {
  const where: any = {};
  if (params.state) where.state = params.state;
  if (params.category) where.category = params.category;
  if (params.severity) where.severity = params.severity;
  if (params.status) where.status = params.status;

  const page = parseInt(params.page ?? "1");
  const limit = 12;
  const skip = (page - 1) * limit;
  const orderBy: any = params.sort === "upvotes" ? { upvotes: "desc" } : { createdAt: "desc" };

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

  return { issues, total, page, totalPages: Math.ceil(total / limit) };
}

function buildUrl(params: SearchParams, overrides: Partial<SearchParams>) {
  const next = { ...params, ...overrides };
  const query = Object.entries(next)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
    .join("&");
  return `/issues${query ? "?" + query : ""}`;
}

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { issues, total, page, totalPages } = await getIssues(searchParams);

  return (
    <div className="min-h-screen bg-grey-light pt-16">
      {/* Page header */}
      <div className="bg-navy-deep py-10">
        <div className="container-wide">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            🇦🇺 Issues Across Australia
          </h1>
          <p className="text-white/60">
            {total} issue{total !== 1 ? "s" : ""} reported by Australians
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* State */}
            <select
              defaultValue={searchParams.state ?? ""}
              onChange={() => {}}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-grey-dark focus:ring-2 focus:ring-navy-royal focus:outline-none"
            >
              <option value="">All States</option>
              {STATES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Category */}
            <select
              defaultValue={searchParams.category ?? ""}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-grey-dark focus:ring-2 focus:ring-navy-royal focus:outline-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>

            {/* Severity */}
            <select
              defaultValue={searchParams.severity ?? ""}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-grey-dark focus:ring-2 focus:ring-navy-royal focus:outline-none"
            >
              <option value="">All Severities</option>
              {Object.entries(SEVERITY_CONFIG).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Status */}
            <select
              defaultValue={searchParams.status ?? ""}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-grey-dark focus:ring-2 focus:ring-navy-royal focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="VERIFIED">Verified</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            {/* Sort */}
            <select
              defaultValue={searchParams.sort ?? "createdAt"}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-grey-dark focus:ring-2 focus:ring-navy-royal focus:outline-none"
            >
              <option value="createdAt">Newest First</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Tip: Use your browser's URL bar to apply filters — e.g. <code className="bg-gray-100 px-1 rounded">/issues?state=NSW&category=HOUSING</code>
          </p>
        </div>

        {/* Issue grid */}
        {issues.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No issues found matching your filters.</p>
            <Link href="/issues" className="mt-4 inline-block">
              <Button variant="outline" size="sm">Clear Filters</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue as any} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {page > 1 && (
              <Link href={buildUrl(searchParams, { page: String(page - 1) })}>
                <Button variant="outline" size="sm">← Prev</Button>
              </Link>
            )}
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link href={buildUrl(searchParams, { page: String(page + 1) })}>
                <Button variant="outline" size="sm">Next →</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
