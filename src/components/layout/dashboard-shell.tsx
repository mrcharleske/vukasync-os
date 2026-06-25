"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Settings,
  Users
} from "lucide-react";
import { cn } from "@/lib/cn";

type DashboardShellProps = {
  children: ReactNode;
  workspaceName?: string;
  userName?: string;
};

const NAV_ITEMS = [
  { label: "Command Center", href: "/command-center", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Social Media", href: "/social-media/accounts", icon: BriefcaseBusiness },
  { label: "Projects", icon: FolderKanban },
  { label: "Reports", icon: BarChart3 },
  { label: "Billing", icon: CreditCard },
  { label: "Settings", icon: Settings }
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
        aria-label="Close navigation menu"
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
          <div className="dashboard-brand-mark">VS</div>
          <div>
            <p className="dashboard-brand-eyebrow">VukaSync OS</p>
            <p className="dashboard-brand-title">Business Command Layer</p>
          </div>
        </div>
        <nav>
          <ul className="dashboard-nav-list">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon as LucideIcon;
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
                      <Icon aria-hidden="true" size={17} />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="dashboard-nav-item dashboard-nav-item-disabled"
                    >
                      <Icon aria-hidden="true" size={17} />
                      <span>{item.label}</span>
                      <small>Soon</small>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="dashboard-sidebar-footer">
          <p>Premium Workspace</p>
          <strong>Operational confidence: High</strong>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            aria-label="Open menu"
            className="dashboard-menu-toggle"
            onClick={() => setMobileMenuOpen((value) => !value)}
            type="button"
          >
            <Menu size={16} />
            Menu
          </button>
          <div className="dashboard-topbar-search">
            <input
              aria-label="Search workspace"
              placeholder="Search clients, projects, or activity..."
              type="search"
            />
          </div>
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
