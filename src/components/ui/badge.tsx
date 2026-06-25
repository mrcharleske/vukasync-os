import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "success" | "accent";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export function Badge({ children, className, tone = "neutral" }: BadgeProps) {
  return <span className={cn("ui-badge", `ui-badge-${tone}`, className)}>{children}</span>;
}
