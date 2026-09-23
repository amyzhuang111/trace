"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FlaskConical,
  GitBranch,
  ShoppingBasket,
  Tag,
  Radio,
  Terminal,
  FileText,
  MessageSquareWarning,
  ClipboardList,
  HeartPulse,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHilbertStore } from "@/store/useHilbertStore";

const NAV_GROUPS: {
  label: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard }[];
}[] = [
  {
    label: "Customer",
    items: [
      { href: "/", label: "Operator Home", icon: LayoutDashboard },
      { href: "/customer", label: "Customer Overview", icon: Building2 },
    ],
  },
  {
    label: "Analyze",
    items: [
      { href: "/investigations", label: "Investigations", icon: FlaskConical },
      { href: "/cohorts", label: "Cohorts", icon: GitBranch },
      { href: "/basket-frequency", label: "Basket & Frequency", icon: ShoppingBasket },
      { href: "/promotions", label: "Promotions", icon: Tag },
      { href: "/channels", label: "Channels", icon: Radio },
      { href: "/sql-lab", label: "SQL Lab", icon: Terminal },
    ],
  },
  {
    label: "Deliver",
    items: [
      { href: "/customer-readout", label: "Customer Readout", icon: FileText },
      { href: "/product-feedback", label: "Product Feedback", icon: MessageSquareWarning },
      { href: "/decision-log", label: "Decision Log", icon: ClipboardList },
    ],
  },
  {
    label: "System",
    items: [{ href: "/data-health", label: "Data Health", icon: HeartPulse }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const resetDemo = useHilbertStore((s) => s.resetDemo);

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex flex-col gap-2 px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-fill text-[11px] font-bold text-accent-fill-foreground">
            H
          </div>
          <span className="font-heading text-[13.5px] font-semibold text-white">Hilbert</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-sidebar-active px-2.5 py-1.5">
          <span className="truncate text-[12px] font-medium text-white">Northstar Market</span>
          <span className="shrink-0 rounded border border-sidebar-border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wide text-sidebar-muted">
            Synthetic
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">
              {group.label}
            </div>
            {group.items.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 mb-0.5 text-[12.5px] font-medium transition-colors",
                    active
                      ? "bg-sidebar-active text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-active/60 hover:text-white",
                  )}
                >
                  <Icon size={14} strokeWidth={2} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sidebar-active text-[10px] font-semibold text-white">
            A
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-medium text-white">Amy</div>
            <div className="text-[10.5px] text-sidebar-muted">Growth Operator</div>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm("Reset all demo data to its original seeded state? Any edits you've made will be lost.")) {
              resetDemo();
            }
          }}
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[11.5px] font-medium text-sidebar-muted hover:bg-sidebar-active/60 hover:text-white transition-colors"
        >
          <RotateCcw size={13} strokeWidth={2} className="shrink-0" />
          Demo Reset
        </button>
      </div>
    </aside>
  );
}
