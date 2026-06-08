import { Issue, User, Suggestion, Comment, IssueProgress, Vote } from "@prisma/client";

export type IssueWithAuthor = Issue & {
  author: Pick<User, "id" | "name" | "image" | "role">;
  _count?: { suggestions: number; comments: number; votes: number };
};

export type IssueWithDetails = Issue & {
  author: Pick<User, "id" | "name" | "image" | "role">;
  suggestions: SuggestionWithAuthor[];
  comments: CommentWithAuthor[];
  progress: IssueProgress[];
  _count: { suggestions: number; comments: number; votes: number };
};

export type SuggestionWithAuthor = Suggestion & {
  author: Pick<User, "id" | "name" | "image" | "role">;
  _count?: { suggestionVotes: number };
};

export type CommentWithAuthor = Comment & {
  author: Pick<User, "id" | "name" | "image">;
  replies?: CommentWithAuthor[];
};

export type TrendingIssue = {
  id: string;
  title: string;
  category: string;
  state: string;
  upvotes: number;
  severity: string;
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
