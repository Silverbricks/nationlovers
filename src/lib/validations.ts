import { z } from "zod";

export const reportIssueSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(150),
  description: z.string().min(50, "Please describe the issue in at least 50 characters").max(5000),
  category: z.enum([
    "COST_OF_LIVING", "HOUSING", "HEALTHCARE", "IMMIGRATION",
    "TRANSPORT", "EDUCATION", "SAFETY", "CLIMATE", "GOVERNMENT",
  ]),
  location: z.string().min(2, "Please enter your suburb or town").max(100),
  state: z.enum(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  photoUrls: z.array(z.string().url()).max(5).optional().default([]),
});

export const suggestFixSchema = z.object({
  issueId: z.string().min(1, "Please select an issue"),
  title: z.string().min(5, "Title must be at least 5 characters").max(150),
  description: z.string().min(20, "Please describe your solution").max(2000),
  solution: z.string().min(30, "Please explain your solution in detail").max(5000),
  stepsToImplement: z.array(z.string().min(5)).min(1, "Add at least one implementation step").max(10),
  costEstimate: z.string().max(100).optional(),
  feasibilityRating: z.number().int().min(1).max(10).default(5),
  communityImpact: z.string().max(500).optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  state: z.enum(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]).optional(),
  role: z.enum(["CITIZEN", "VOLUNTEER", "EXPERT"]).default("CITIZEN"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const commentSchema = z.object({
  content: z.string().min(3, "Comment must be at least 3 characters").max(1000),
  parentId: z.string().optional(),
});

export type ReportIssueInput = z.infer<typeof reportIssueSchema>;
export type SuggestFixInput = z.infer<typeof suggestFixSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
