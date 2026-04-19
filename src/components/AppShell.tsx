import { Link, useLocation } from "@tanstack/react-router";
import { Home, ClipboardCheck, ScanLine, BookOpen, User } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/assessment", label: "Check", icon: ClipboardCheck },
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/education", label: "Learn", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="mx-auto w-full max-w-md min-h-screen bg-background shadow-card relative">
        <div className={hideNav ? "" : "pb-20"}>{children}</div>
        {!hideNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur border-t border-border">
            <ul className="grid grid-cols-5">
              {tabs.map((t) => {
                const active = loc.pathname.startsWith(t.to);
                const Icon = t.icon;
                return (
                  <li key={t.to}>
                    <Link
                      to={t.to}
                      className={`flex flex-col items-center justify-center py-2.5 gap-0.5 text-[11px] transition-colors ${
                        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`} />
                      <span className="font-medium">{t.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export function PageHeader({ title, back, right }: { title: string; back?: string; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
      {back && (
        <Link to={back} className="text-muted-foreground hover:text-foreground">
          ←
        </Link>
      )}
      <h1 className="text-lg font-semibold flex-1">{title}</h1>
      {right}
    </header>
  );
}
