"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  Share2,
  Target,
  FileText,
  ListChecks,
  FlaskConical,
  Rocket,
  AlertTriangle,
  FileBarChart,
  RotateCcw,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEngagementStore } from "@/store/useEngagementStore";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/discovery", label: "Discovery", icon: MessagesSquare },
  { href: "/context", label: "Context Graph", icon: Share2 },
  { href: "/opportunity", label: "Opportunity", icon: Target },
  { href: "/agent-spec", label: "Agent Spec", icon: FileText },
  { href: "/evals", label: "Eval Suite", icon: ListChecks },
  { href: "/experiments", label: "Experiments", icon: FlaskConical },
  { href: "/pilot", label: "Pilot", icon: Rocket },
  { href: "/failures", label: "Failures", icon: AlertTriangle },
  { href: "/readout", label: "Executive Readout", icon: FileBarChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const resetDemo = useEngagementStore((s) => s.resetDemo);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Activity size={15} strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="text-[13.5px] font-semibold text-white">Trace</div>
          <div className="text-[10.5px] text-sidebar-muted">Enterprise Agent Diagnostic</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 mb-1 text-[13px] font-medium transition-colors",
                active
                  ? "bg-sidebar-active text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-active/60 hover:text-white"
              )}
            >
              <Icon size={15} strokeWidth={2} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <button
          onClick={() => {
            if (confirm("Reset all demo data to its original seeded state? Any edits you've made will be lost.")) {
              resetDemo();
            }
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-muted hover:bg-sidebar-active/60 hover:text-white transition-colors"
        >
          <RotateCcw size={15} strokeWidth={2} className="shrink-0" />
          Demo Reset
        </button>
      </div>
    </aside>
  );
}
