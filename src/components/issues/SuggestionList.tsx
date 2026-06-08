"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThumbsUp, ChevronDown, ChevronUp, Star, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import { SuggestionWithAuthor } from "@/types";
import { formatDate, formatUpvotes } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface SuggestionListProps {
  issueId: string;
  suggestions: SuggestionWithAuthor[];
}

function SuggestionCard({ suggestion }: { suggestion: SuggestionWithAuthor }) {
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState(false);
  const [votes, setVotes] = useState(suggestion.votes);
  const [voted, setVoted] = useState(false);

  async function handleVote() {
    if (!session) { toast.error("Please log in to vote."); return; }
    const next = !voted;
    setVoted(next);
    setVotes((v) => (next ? v + 1 : v - 1));
    try {
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId: suggestion.id, type: "UP" }),
      });
    } catch {
      setVoted(!next);
      setVotes((v) => (next ? v - 1 : v + 1));
    }
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-navy text-base">{suggestion.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              by {suggestion.author.name} · {formatDate(suggestion.createdAt)}
            </p>
          </div>
          {/* Feasibility stars */}
          <div className="flex items-center gap-0.5 shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(suggestion.feasibilityRating / 2)
                    ? "text-gold fill-gold"
                    : "text-gray-200"
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">{suggestion.feasibilityRating}/10</span>
          </div>
        </div>

        <p className="text-grey-dark text-sm leading-relaxed">
          {expanded ? suggestion.solution : suggestion.solution.slice(0, 180) + (suggestion.solution.length > 180 ? "..." : "")}
        </p>

        {expanded && suggestion.stepsToImplement.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-2">Implementation Steps</p>
            <ol className="space-y-1">
              {suggestion.stepsToImplement.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-grey-dark">
                  <span className="text-gold font-bold shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {expanded && suggestion.costEstimate && (
          <div className="mt-3 inline-block bg-grey-light rounded-lg px-3 py-1.5">
            <span className="text-xs text-gray-500 font-medium">Estimated cost: </span>
            <span className="text-xs text-navy font-semibold">{suggestion.costEstimate}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVote}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold transition-all ${
                voted ? "bg-navy text-white" : "bg-navy/10 text-navy hover:bg-navy hover:text-white"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${voted ? "fill-current" : ""}`} />
              {formatUpvotes(votes)} {votes === 1 ? "vote" : "votes"}
            </button>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-navy transition-colors"
          >
            {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Less</> : <><ChevronDown className="w-3.5 h-3.5" /> More</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SuggestionList({ issueId, suggestions }: SuggestionListProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-navy text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-gold" />
          Community Solutions ({suggestions.length})
        </h2>
        <Link href={`/suggest?issueId=${issueId}`}>
          <Button size="sm">+ Add Solution</Button>
        </Link>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-lg mb-2">No solutions yet.</p>
          <p className="text-sm">Be the first to suggest a fix for this issue!</p>
          <Link href={`/suggest?issueId=${issueId}`} className="inline-block mt-4">
            <Button>Submit Your Solution</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      )}
    </div>
  );
}
