import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm",
        hover && "transition-shadow duration-200 hover:shadow-md cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
