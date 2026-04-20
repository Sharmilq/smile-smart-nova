import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ClipboardCheck, ScanLine, Sparkles, Bell, ShieldCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
});

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Question-based scoring",
    desc: "13 dental health questions — each answer adds or subtracts points based on clinical best practices, producing a transparent score out of 100.",
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: ScanLine,
    title: "Mock AI tooth scan",
    desc: "A demo AI scan analyzes a photo of your teeth and visualizes plaque areas, gum condition, and a cleanliness score with overlay markers.",
    color: "from-teal-400 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "Personalized recommendations",
    desc: "Your answers drive smart suggestions — for example, bleeding gums triggers a dentist alert; daily sugar triggers diet tips.",
    color: "from-indigo-400 to-blue-500",
  },
  {
    icon: Bell,
    title: "Reminders & habit tracking",
    desc: "Brush, floss and toothbrush replacement reminders, plus a streak counter and achievements to keep healthy habits consistent.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    desc: "All assessment data stays on your device. Nothing is shared with third parties.",
    color: "from-purple-400 to-pink-500",
  },
];

function HowItWorks() {
  return (
    <AppShell hideNav>
      <PageHeader title="How DentNova Works" back="/home" />
      <div className="px-5 pt-4 pb-8">
        <div className="rounded-3xl bg-gradient-hero p-5 text-center shadow-soft">
          <div className="text-4xl">🦷</div>
          <h2 className="font-bold text-lg mt-2">Your pocket dental coach</h2>
          <p className="text-sm text-muted-foreground mt-1">
            DentNova combines a clinical-style assessment, mock AI scanning and habit reminders into one simple flow.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl bg-card border border-border p-4 shadow-soft flex gap-3"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shrink-0 shadow-soft`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{i + 1}. {s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl bg-card border border-border p-4 text-xs text-muted-foreground shadow-soft">
          <p className="font-semibold text-foreground mb-1">Project note</p>
          <p>This is an academic prototype — the AI scan is simulated for demonstration. The scoring logic, recommendations and badge engine are fully functional.</p>
        </div>
      </div>
    </AppShell>
  );
}
