import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  actions,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn("ui-section-header", className)}>
      <div>
        <h2 className="ui-section-header-title">{title}</h2>
        {description ? (
          <p className="ui-section-header-description">{description}</p>
        ) : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
