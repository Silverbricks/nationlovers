"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Reply } from "lucide-react";
import toast from "react-hot-toast";
import { CommentWithAuthor } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

interface CommentThreadProps {
  issueId: string;
  comments: CommentWithAuthor[];
}

function CommentItem({
  comment,
  issueId,
  depth = 0,
}: {
  comment: CommentWithAuthor;
  issueId: string;
  depth?: number;
}) {
  const { data: session } = useSession();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<CommentWithAuthor[]>(comment.replies ?? []);
  const [loading, setLoading] = useState(false);

  async function submitReply() {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, content: replyText, parentId: comment.id }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setReplies((prev) => [...prev, data]);
        setReplyText("");
        setReplying(false);
        toast.success("Reply posted!");
      }
    } catch {
      toast.error("Failed to post reply.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={depth > 0 ? "ml-8 mt-3 border-l-2 border-gray-100 pl-4" : ""}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-navy-royal flex items-center justify-center text-white font-bold text-xs shrink-0">
          {comment.author.name?.[0]?.toUpperCase() ?? "A"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-navy">{comment.author.name ?? "Anonymous"}</span>
            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-grey-dark leading-relaxed">{comment.content}</p>
          {depth === 0 && session && (
            <button
              onClick={() => setReplying(!replying)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-navy transition-colors mt-2"
            >
              <Reply className="w-3.5 h-3.5" /> Reply
            </button>
          )}
        </div>
      </div>

      {replying && (
        <div className="ml-11 mt-3 space-y-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="text-sm min-h-[72px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={submitReply} loading={loading}>Post Reply</Button>
            <Button size="sm" variant="ghost" onClick={() => setReplying(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-3">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} issueId={issueId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentThread({ issueId, comments }: CommentThreadProps) {
  const { data: session } = useSession();
  const [allComments, setAllComments] = useState<CommentWithAuthor[]>(comments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitComment() {
    if (!newComment.trim()) return;
    if (!session) { toast.error("Please log in to comment."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, content: newComment }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setAllComments((prev) => [...prev, { ...data, replies: [] }]);
        setNewComment("");
        toast.success("Comment posted!");
      }
    } catch {
      toast.error("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-bold text-navy text-lg flex items-center gap-2 mb-5">
        <MessageCircle className="w-5 h-5 text-navy-royal" />
        Discussion ({allComments.length})
      </h2>

      {/* New comment form */}
      {session ? (
        <div className="mb-6 space-y-3">
          <Textarea
            placeholder="Share your thoughts on this issue..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={submitComment} loading={loading} size="sm">
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="mb-6 bg-grey-light rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">
            <a href="/login" className="text-navy font-semibold hover:underline">Log in</a> to join the discussion.
          </p>
        </div>
      )}

      {/* Comments */}
      {allComments.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No comments yet. Start the discussion!</p>
      ) : (
        <div className="space-y-5">
          {allComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} issueId={issueId} />
          ))}
        </div>
      )}
    </div>
  );
}
