import Link from "next/link";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SuggestionBoxPreview() {
  return (
    <section className="py-12 bg-white">
      <div className="container-wide">
        <div className="rounded-2xl bg-hero-gradient p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          {/* Left content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-6 h-6 text-gold" />
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">NationFix System</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Got an Idea?<br />
              <span className="text-gold">Share Your Solution.</span>
            </h2>
            <p className="text-white/70 leading-relaxed mb-6 max-w-lg">
              Every problem has a solution. Submit your idea — practical, policy-based, or tech-driven.
              The best solutions get ranked by community vote and shared with decision-makers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/suggest">
                <Button size="lg" className="group">
                  Submit Your Solution for Australia
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/issues">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white hover:text-navy"
                >
                  Browse Issues to Fix
                </Button>
              </Link>
            </div>
          </div>

          {/* Right form preview */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Quick Suggestion Preview</p>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-white/40 text-xs">Your solution title...</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2 h-20">
                  <p className="text-white/40 text-xs">Describe your solution in detail...</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-white/40 text-xs">Feasibility rating: 1-10</p>
                </div>
              </div>
              <Link href="/suggest">
                <button className="mt-4 w-full bg-gold text-navy-deep font-bold py-2.5 rounded-lg text-sm hover:bg-gold-soft transition-colors">
                  Submit Full Solution →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
