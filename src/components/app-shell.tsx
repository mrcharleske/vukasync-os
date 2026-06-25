import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

type PageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

type SectionCardProps = {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

type EmptyStateProps = {
  title: string;
  description: string;
};

export function AppShell({ children }: AppShellProps) {
  return <main className="app-shell">{children}</main>;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="page-header card">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}

export function SectionCard({ id, title, description, children }: SectionCardProps) {
  return (
    <section className="card section-card" id={id}>
      <div className="section-card-header">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state-title">{title}</p>
      <p>{description}</p>
    </div>
  );
}
