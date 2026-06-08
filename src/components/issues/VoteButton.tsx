"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";
import { formatUpvotes } from "@/lib/utils";

interface VoteButtonProps {
  issueId: string;
  initialUpvotes: number;
}

export function VoteButton({ issueId, initialUpvotes }: VoteButtonProps) {
  const { data: session } = useSession();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    if (!session) {
      toast.error("Please log in to vote.");
      return;
    }

    setLoading(true);
    // Optimistic update
    const newVoted = !voted;
    setVoted(newVoted);
    setUpvotes((prev) => (newVoted ? prev + 1 : prev - 1));

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, type: "UP" }),
      });

      if (!res.ok) {
        // Revert on failure
        setVoted(!newVoted);
        setUpvotes((prev) => (newVoted ? prev - 1 : prev + 1));
        toast.error("Vote failed. Please try again.");
      }
    } catch {
      setVoted(!newVoted);
      setUpvotes((prev) => (newVoted ? prev - 1 : prev + 1));
      toast.error("Vote failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
        voted
          ? "bg-navy text-white"
          : "bg-navy/10 text-navy hover:bg-navy hover:text-white"
      } disabled:opacity-50`}
    >
      <ThumbsUp className={`w-4 h-4 ${voted ? "fill-current" : ""}`} />
      <span>{formatUpvotes(upvotes)}</span>
      <span>{voted ? "Upvoted" : "Upvote"}</span>
    </button>
  );
}
