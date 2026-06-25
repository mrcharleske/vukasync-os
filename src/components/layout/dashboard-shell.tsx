"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type DashboardShellProps = {
  children: ReactNode;
  workspaceName?: string;
  userName?: string;
};

const NAV_ITEMS = [
  { label: "Business Command Center", href: "/command-center" },
  { label: "Clients", href: "/clients" },
  { label: "Social Media", href: "/social-media/accounts" },
  { label: "Projects" },
  { label: "Reports" },
  { label: "Billing" },
  { label: "Settings" }
];

export function DashboardShell({
  children,
  workspaceName,
  userName
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        "dashboard-shell",
        mobileMenuOpen && "dashboard-shell-mobile-open"
      )}
    >
      <button
        aria-expanded={mobileMenuOpen}
        className="dashboard-overlay"
        onClick={() => setMobileMenuOpen(false)}
        type="button"
      />
      <aside
        className={cn(
          "dashboard-sidebar",
          mobileMenuOpen && "dashboard-sidebar-open"
        )}
      >
        <div className="dashboard-brand">
          <p className="dashboard-brand-eyebrow">VukaSync OS</p>
          <p className="dashboard-brand-title">Workspace Console</p>
        </div>
        <nav>
          <ul className="dashboard-nav-list">
            {NAV_ITEMS.map((item) => {
              const isActive = Boolean(
                item.href &&
                  (pathname === item.href || pathname.startsWith(`${item.href}/`))
              );
              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      className={cn(
                        "dashboard-nav-item",
                        isActive && "dashboard-nav-item-active"
                      )}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="dashboard-nav-item dashboard-nav-item-disabled">
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            aria-label="Open menu"
            className="dashboard-menu-toggle"
            onClick={() => setMobileMenuOpen((value) => !value)}
            type="button"
          >
            Menu
          </button>
          <div className="dashboard-topbar-meta">
            <p>{workspaceName ?? "Workspace"}</p>
            <p>{userName ?? "User"}</p>
          </div>
        </header>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
