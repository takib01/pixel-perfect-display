import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  School,
  Users,
  SlidersHorizontal,
  CalendarDays,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { BeamsBackground } from "@/components/beams-background";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/schools", label: "Schools", icon: School },
  { to: "/users", label: "Users", icon: Users },
  { to: "/demand-settings", label: "Demand Settings", icon: SlidersHorizontal },
  { to: "/calendar", label: "Calendar & Food Schedule", icon: CalendarDays },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary/15 text-foreground ring-1 ring-primary/30"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
      <Link
        to="/"
        onClick={onNavigate}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-foreground"
      >
        <LogOut className="size-4 shrink-0" />
        Logout
      </Link>
    </nav>
  );
}

function Brand() {
  return (
    <div className="px-1 py-1">
      <p className="text-sm font-semibold tracking-tight text-foreground">
        School Feeding MS
      </p>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Prottyashi
      </p>
    </div>
  );
}

export function AdminLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      <BeamsBackground intensity="subtle" className="opacity-40" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-border/60 bg-card/40 p-4 backdrop-blur-xl lg:flex">
          <Brand />
          <NavLinks />
          <div className="mt-auto rounded-lg border border-border/60 bg-card/50 p-3">
            <p className="text-sm text-foreground">Nazmul Hasan</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 border-r border-border/60 bg-card p-4">
              <div className="mb-6 flex items-center justify-between">
                <Brand />
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md p-2 text-muted-foreground hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
                {title}
              </h1>
              {description && (
                <p className="truncate text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            {actions}
            <div className="ml-2 hidden items-center gap-2 sm:flex">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-foreground ring-1 ring-primary/30">
                NH
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <div className="mx-auto max-w-6xl space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
