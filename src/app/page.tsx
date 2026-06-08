import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { LivePulseBar } from "@/components/home/LivePulseBar";
import { IssueCardGrid } from "@/components/home/IssueCardGrid";
import { TrendingPanel } from "@/components/home/TrendingPanel";
import { SuggestionBoxPreview } from "@/components/home/SuggestionBoxPreview";
import { AustraliaIdentitySection } from "@/components/home/AustraliaIdentitySection";

async function getLatestIssues() {
  return prisma.issue.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
      _count: { select: { suggestions: true, comments: true, votes: true } },
    },
  });
}

async function getTrendingIssues() {
  const issues = await prisma.issue.findMany({
    take: 5,
    orderBy: { upvotes: "desc" },
    where: {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    select: { id: true, title: true, category: true, state: true, upvotes: true, severity: true },
  });

  // If no recent trending, just get all-time top 5
  if (issues.length < 5) {
    return prisma.issue.findMany({
      take: 5,
      orderBy: { upvotes: "desc" },
      select: { id: true, title: true, category: true, state: true, upvotes: true, severity: true },
    });
  }
  return issues;
}

export default async function HomePage() {
  const [latestIssues, trendingIssues] = await Promise.all([
    getLatestIssues(),
    getTrendingIssues(),
  ]);

  return (
    <>
      <HeroSection />
      <LivePulseBar />

      {/* Issues + Trending — side by side on large screens */}
      <div className="bg-grey-light">
        <div className="container-wide py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Issues grid — takes 2/3 */}
            <div className="flex-1 min-w-0">
              <IssueCardGrid
                issues={latestIssues as any}
                title="Latest Issues Across Australia"
                showMore={true}
              />
            </div>

            {/* Trending panel — takes 1/3 */}
            <div className="lg:w-80 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">🔥</span>
                  <h2 className="text-lg font-bold text-navy">Trending in Australia</h2>
                </div>
                <TrendingPanel issues={trendingIssues as any} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuggestionBoxPreview />
      <AustraliaIdentitySection />
    </>
  );
}
