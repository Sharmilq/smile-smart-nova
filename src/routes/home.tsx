import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, ScanLine, BookOpen, Bell, User, Lightbulb, ChevronRight, CalendarPlus, Info, Zap, Timer, CalendarClock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ScoreRing } from "@/components/ScoreRing";
import { BrushingTimer } from "@/components/BrushingTimer";
import { store } from "@/lib/store";

export const Route = createFileRoute("/home")({
  component: Home,
});

const TIPS_MORNING = [
  "Brush after breakfast to clear away overnight bacteria.",
  "Start your day with a glass of water to rinse your mouth.",
  "Don't forget to brush your tongue — it harbors bacteria too.",
];
const TIPS_AFTERNOON = [
  "Wait 30 minutes after acidic foods before brushing.",
  "Drinking water after meals helps wash away food particles.",
  "Chewing sugar-free gum boosts saliva and protects enamel.",
];
const TIPS_NIGHT = [
  "Floss before sleep to remove plaque from between teeth.",
  "Brush thoroughly before bed — saliva slows down at night.",
  "Replace your toothbrush every 3 months for the best clean.",
];

function Home() {
  const profile = store.getProfile();
  const results = store.getResults();
  const lastScore = results[0]?.score ?? 78;
  const visits = store.getVisitReminders();
  const [tipIdx, setTipIdx] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  const hour = new Date().getHours();
  const period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "night";
  const tipPool = period === "morning" ? TIPS_MORNING : period === "afternoon" ? TIPS_AFTERNOON : TIPS_NIGHT;

  useEffect(() => {
    setTipIdx(Math.floor(Math.random() * tipPool.length));
  }, [tipPool.length]);

  // Dental timeline data
  const timeline = useMemo(() => {
    const last = results[0] ? new Date(results[0].date) : null;
    const next = last ? new Date(last.getTime() + 90 * 86400000) : null; // ~3 months
    const upcomingVisit = visits.find((v) => new Date(`${v.date}T${v.time}`) >= new Date());
    const nextVisit = upcomingVisit ? new Date(`${upcomingVisit.date}T${upcomingVisit.time}`) : next;
    const brushReplace = last ? new Date(last.getTime() + 90 * 86400000) : new Date(Date.now() + 90 * 86400000);
    return { last, nextVisit, brushReplace };
  }, [results, visits]);

  const fmt = (d: Date | null) => d ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";

  const greeting = (() => {
    if (period === "morning") return "Good morning";
    if (period === "afternoon") return "Good afternoon";
    return "Good evening";
  })();

  const actions = [
    { to: "/assessment", icon: ClipboardCheck, label: "Assessment", color: "from-sky-400 to-blue-500" },
    { to: "/scan", icon: ScanLine, label: "Tooth Scan", color: "from-teal-400 to-cyan-500" },
    { to: "/education", icon: BookOpen, label: "Education", color: "from-indigo-400 to-blue-500" },
    { to: "/reminders", icon: Bell, label: "Reminders", color: "from-emerald-400 to-teal-500" },
  ] as const;

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{greeting},</p>
            <h1 className="text-2xl font-bold">{profile?.name || "Friend"} 👋</h1>
          </div>
          <Link to="/profile" className="w-11 h-11 rounded-full bg-card shadow-soft overflow-hidden flex items-center justify-center border border-border">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="me" className="w-full h-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </Link>
        </div>
      </div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-soft relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-10 bottom-0 w-24 h-24 rounded-full bg-white/10" />
        <div className="flex items-center gap-4 relative">
          <div className="bg-card rounded-2xl p-2">
            <ScoreRing score={lastScore} size={110} label="Score" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider opacity-80">Oral Health Score</p>
            <p className="text-2xl font-bold mt-1">{lastScore >= 80 ? "Excellent" : lastScore >= 55 ? "Moderate" : "Needs Care"}</p>
            <p className="text-xs opacity-90 mt-1">{results.length ? `Last checked recently` : "Take your first assessment"}</p>
            <Link to="/assessment" className="inline-flex items-center gap-1 mt-3 text-sm font-medium bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
              Re-assess <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mx-5 mt-4 rounded-2xl bg-card border border-border shadow-soft p-4 flex gap-3">
        <div className="rounded-xl bg-warning/15 text-warning p-2.5 h-fit">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Daily Tip</p>
          <p className="text-sm mt-1 leading-relaxed">{tipPool[tipIdx]}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{period} tip</p>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="px-5 mt-6">
        <h2 className="text-base font-semibold mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.to}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link to={a.to} className="block rounded-2xl bg-card border border-border p-4 shadow-soft hover:shadow-card transition-all hover:-translate-y-0.5">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} text-white flex items-center justify-center shadow-soft`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 font-semibold text-sm">{a.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tap to open</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Secondary actions */}
      <div className="px-5 mt-6 grid grid-cols-2 gap-3">
        <Link to="/visit-reminder" className="rounded-2xl bg-card border border-border p-4 shadow-soft hover:shadow-card transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-soft">
            <CalendarPlus className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm">Visit reminder</p>
            <p className="text-[11px] text-muted-foreground">Schedule a checkup</p>
          </div>
        </Link>
        <Link to="/how-it-works" className="rounded-2xl bg-card border border-border p-4 shadow-soft hover:shadow-card transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-white flex items-center justify-center shadow-soft">
            <Info className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm">How it works</p>
            <p className="text-[11px] text-muted-foreground">App overview</p>
          </div>
        </Link>
      </div>

      {/* Recent activity */}
      {results.length > 0 && (
        <div className="px-5 mt-6">
          <h2 className="text-base font-semibold mb-3">Recent assessments</h2>
          <div className="space-y-2">
            {results.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-2xl bg-card border border-border p-3 flex items-center gap-3 shadow-soft">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  r.level === "Good" ? "bg-success" : r.level === "Moderate" ? "bg-warning" : "bg-destructive"
                }`}>{r.score}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.level}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
