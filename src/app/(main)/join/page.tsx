import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Join NationLovers" };

const ROLES = [
  {
    id: "CITIZEN",
    emoji: "🗣️",
    title: "Citizen Reporter",
    subtitle: "The Voice of Australia",
    description: "Report issues in your community. Vote on what matters most. Your voice shapes the national conversation.",
    benefits: [
      "Report local and national issues",
      "Upvote and vote on solutions",
      "Join state-based discussions",
      "Track issue progress",
      "Comment and reply on threads",
    ],
    color: "bg-white border-navy/20",
    btnVariant: "secondary" as const,
    tag: "Most Popular",
  },
  {
    id: "VOLUNTEER",
    emoji: "🤝",
    title: "Community Volunteer",
    subtitle: "The Engine of NationLovers",
    description: "Help moderate discussions, support community members, and drive local engagement in your area.",
    benefits: [
      "Everything in Citizen Reporter",
      "Help moderate community discussions",
      "Organise local issue campaigns",
      "Connect reporters with experts",
      "Volunteer badge on your profile",
    ],
    color: "bg-navy-deep border-gold",
    btnVariant: "primary" as const,
    tag: "Recommended",
    highlight: true,
  },
  {
    id: "EXPERT",
    emoji: "🎓",
    title: "Verified Expert",
    subtitle: "The Knowledge Pillar",
    description: "Apply your specialist expertise in law, housing, health, transport or other fields to validate and improve solutions.",
    benefits: [
      "Everything in Volunteer",
      "Verified Expert badge",
      "Rate solution feasibility scores",
      "Endorse community solutions",
      "Direct input on solution drafts",
    ],
    color: "bg-white border-navy/20",
    btnVariant: "secondary" as const,
    tag: "Requires Approval",
  },
];

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-grey-light pt-16">
      <div className="bg-hero-gradient py-14">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Join <span className="text-gold">NationLovers</span>
          </h1>
          <p className="text-white/70 text-xl max-w-xl mx-auto">
            Choose your role and become part of Australia&apos;s most powerful civic movement.
          </p>
        </div>
      </div>

      <div className="container-wide py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ROLES.map((role) => (
            <div
              key={role.id}
              className={`rounded-2xl border-2 p-7 relative ${role.color} ${role.highlight ? "ring-2 ring-gold shadow-lg" : ""}`}
            >
              {role.tag && (
                <span className={`absolute -top-3 left-6 px-3 py-1 text-xs font-bold rounded-full ${
                  role.highlight ? "bg-gold text-navy-deep" : "bg-navy text-white"
                }`}>
                  {role.tag}
                </span>
              )}

              <div className="text-4xl mb-3">{role.emoji}</div>
              <h2 className={`text-xl font-extrabold mb-1 ${role.highlight ? "text-white" : "text-navy"}`}>
                {role.title}
              </h2>
              <p className={`text-sm mb-3 font-medium ${role.highlight ? "text-gold" : "text-gray-400"}`}>
                {role.subtitle}
              </p>
              <p className={`text-sm leading-relaxed mb-6 ${role.highlight ? "text-white/70" : "text-gray-500"}`}>
                {role.description}
              </p>

              <ul className="space-y-2.5 mb-7">
                {role.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${role.highlight ? "text-gold" : "text-alert-green"}`} />
                    <span className={role.highlight ? "text-white/80" : "text-gray-600"}>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link href={`/register?role=${role.id}`}>
                <Button variant={role.btnVariant} fullWidth>
                  Join as {role.title}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="section-heading text-center justify-center">Frequently Asked Questions</h2>
          <div className="space-y-4 mt-8">
            {[
              { q: "Is NationLovers free to use?", a: "Yes — NationLovers is completely free. Reporting issues, suggesting solutions, and voting all cost nothing." },
              { q: "Can I remain anonymous?", a: "Your name is shown on your reports and suggestions, but we never share personal details publicly beyond what you provide." },
              { q: "How do I become a Verified Expert?", a: "Register as an Expert and our admin team will verify your credentials (qualifications, professional history) before activating your verified status." },
              { q: "What happens to the issues I report?", a: "Issues go through a lifecycle: Reported → Verified → Solutions Added → Ranked → Summarised → Draft → Shared with relevant councils or partners." },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-navy mb-2">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
