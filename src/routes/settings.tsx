import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Lock, HelpCircle, Moon, ChevronRight, MessageSquare, Shield, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

const KEY_NOTIF = "dn_pref_notif";
const KEY_DARK = "dn_pref_dark";

function Settings() {
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const n = localStorage.getItem(KEY_NOTIF);
      if (n !== null) setNotif(n === "1");
      const d = localStorage.getItem(KEY_DARK) === "1";
      setDark(d);
      document.documentElement.classList.toggle("dark", d);
    } catch { /* ignore */ }
  }, []);

  const toggleNotif = (v: boolean) => {
    setNotif(v);
    try { localStorage.setItem(KEY_NOTIF, v ? "1" : "0"); } catch { /* ignore */ }
  };
  const toggleDark = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    try { localStorage.setItem(KEY_DARK, v ? "1" : "0"); } catch { /* ignore */ }
  };

  const Item = ({ icon: Icon, label, right }: { icon: typeof Bell; label: string; right: React.ReactNode }) => (
    <div className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4 shadow-soft">
      <Icon className="h-5 w-5 text-primary" />
      <span className="flex-1 font-medium text-sm">{label}</span>
      {right}
    </div>
  );

  return (
    <AppShell hideNav>
      <PageHeader title="Settings" back="/profile" />
      <div className="px-5 pt-4 pb-8 space-y-2.5">
        <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1 mt-2">Preferences</p>
        <Item icon={Bell} label="Notifications" right={<Switch checked={notif} onCheckedChange={toggleNotif} />} />
        <Item icon={Moon} label="Dark mode" right={<Switch checked={dark} onCheckedChange={toggleDark} />} />

        <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1 mt-5">Privacy</p>
        <Item icon={Lock} label="Privacy policy" right={<ChevronRight className="h-4 w-4 text-muted-foreground" />} />
        <Item icon={Shield} label="Data & security" right={<ChevronRight className="h-4 w-4 text-muted-foreground" />} />
        <div className="rounded-2xl bg-success/10 border border-success/30 p-4 flex gap-2.5">
          <Shield className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <p className="text-xs text-foreground leading-relaxed">
            Your data is secure and stored only on your device — it is <span className="font-semibold">not shared with third parties</span>.
          </p>
        </div>

        <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1 mt-5">Support</p>
        <Item icon={HelpCircle} label="Help center" right={<ChevronRight className="h-4 w-4 text-muted-foreground" />} />
        <Link to="/feedback" className="block">
          <Item icon={MessageSquare} label="Send feedback" right={<ChevronRight className="h-4 w-4 text-muted-foreground" />} />
        </Link>
        <Link to="/how-it-works" className="block">
          <Item icon={Info} label="How DentNova works" right={<ChevronRight className="h-4 w-4 text-muted-foreground" />} />
        </Link>

        <p className="text-center text-xs text-muted-foreground mt-8">DentNova v1.0.0</p>
      </div>
    </AppShell>
  );
}
