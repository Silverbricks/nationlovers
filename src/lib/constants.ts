export const CATEGORIES = [
  { value: "COST_OF_LIVING", label: "Cost of Living", icon: "🛒", color: "bg-orange-100 text-orange-800" },
  { value: "HOUSING", label: "Housing & Rent", icon: "🏠", color: "bg-red-100 text-red-800" },
  { value: "HEALTHCARE", label: "Healthcare", icon: "🏥", color: "bg-blue-100 text-blue-800" },
  { value: "IMMIGRATION", label: "Immigration", icon: "✈️", color: "bg-purple-100 text-purple-800" },
  { value: "TRANSPORT", label: "Transport", icon: "🚆", color: "bg-yellow-100 text-yellow-800" },
  { value: "EDUCATION", label: "Education", icon: "📚", color: "bg-green-100 text-green-800" },
  { value: "SAFETY", label: "Safety & Community", icon: "🛡️", color: "bg-gray-100 text-gray-800" },
  { value: "CLIMATE", label: "Climate & Environment", icon: "🌿", color: "bg-emerald-100 text-emerald-800" },
  { value: "GOVERNMENT", label: "Government & Transparency", icon: "🏛️", color: "bg-indigo-100 text-indigo-800" },
] as const;

export const STATES = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
] as const;

export const SEVERITY_CONFIG = {
  LOW: { label: "Low", color: "bg-alert-green text-white", dot: "bg-alert-green" },
  MEDIUM: { label: "Medium", color: "bg-yellow-400 text-gray-900", dot: "bg-yellow-400" },
  HIGH: { label: "High", color: "bg-alert-orange text-white", dot: "bg-alert-orange" },
  CRITICAL: { label: "Critical", color: "bg-alert-red text-white", dot: "bg-alert-red" },
} as const;

export const STATUS_CONFIG = {
  REPORTED: { label: "Reported", color: "bg-gray-200 text-gray-700" },
  VERIFIED: { label: "Verified", color: "bg-blue-100 text-blue-800" },
  IN_PROGRESS: { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  RESOLVED: { label: "Resolved", color: "bg-green-100 text-green-800" },
} as const;

export const PROGRESS_STAGES = [
  { key: "REPORTED", label: "Reported", description: "Issue submitted by community" },
  { key: "VERIFIED", label: "Verified", description: "Confirmed by moderators" },
  { key: "SUGGESTIONS_ADDED", label: "Solutions Added", description: "Community submitted fixes" },
  { key: "RANKED", label: "Ranked", description: "Solutions ranked by vote" },
  { key: "SUMMARIZED", label: "AI Summary", description: "Solutions summarised" },
  { key: "DRAFT", label: "Solution Draft", description: "Action plan drafted" },
  { key: "SHARED", label: "Shared", description: "Shared with councils/partners" },
] as const;

export const USER_ROLES = [
  { value: "CITIZEN", label: "Citizen Reporter", description: "Report issues and vote on solutions" },
  { value: "VOLUNTEER", label: "Community Volunteer", description: "Help moderate and support community" },
  { value: "EXPERT", label: "Verified Expert", description: "Contribute specialist knowledge" },
  { value: "ADMIN", label: "Administrator", description: "Platform management" },
] as const;
