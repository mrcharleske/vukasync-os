import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  className
}: PageHeaderProps) {
  return (
    <header className={cn("ui-page-header", className)}>
      <div>
        {eyebrow ? <p className="ui-page-header-eyebrow">{eyebrow}</p> : null}
        <h1 className="ui-page-header-title">{title}</h1>
        {subtitle ? <p className="ui-page-header-subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ui-page-header-actions">{actions}</div> : null}
    </header>
  );
}
