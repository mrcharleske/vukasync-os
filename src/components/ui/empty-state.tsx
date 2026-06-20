import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("ui-empty-state", className)}>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="ui-empty-state-action">{action}</div> : null}
    </div>
  );
}
