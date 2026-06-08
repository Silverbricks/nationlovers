import { cn } from "@/lib/utils";
import { SEVERITY_CONFIG, STATUS_CONFIG } from "@/lib/constants";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "severity" | "status" | "category";
  severity?: keyof typeof SEVERITY_CONFIG;
  status?: keyof typeof STATUS_CONFIG;
}

export function Badge({ children, className, variant = "default", severity, status }: BadgeProps) {
  const severityClass = severity ? SEVERITY_CONFIG[severity].color : "";
  const statusClass = status ? STATUS_CONFIG[status].color : "";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-navy text-white",
        variant === "category" && "bg-navy/10 text-navy",
        variant === "severity" && severityClass,
        variant === "status" && statusClass,
        className
      )}
    >
      {severity && variant === "severity" && (
        <span className={cn("w-1.5 h-1.5 rounded-full", SEVERITY_CONFIG[severity].dot)} />
      )}
      {children}
    </span>
  );
}
