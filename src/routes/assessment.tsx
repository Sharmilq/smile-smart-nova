import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/AppShell";
import { QUESTIONS, calcScore } from "@/lib/assessment";

const ENCOURAGEMENTS = [
  "Great! You're maintaining good dental habits 👏",
  "Good choice! Keep it up 👍",
  "Nice! You're following recommended dental care ✅",
  "Excellent! Your smile thanks you ✨",
  "Awesome! That's the right approach 💙",
];
import type { AssessmentAnswers } from "@/lib/store";
import { store } from "@/lib/store";

export const Route = createFileRoute("/assessment")({
  component: Assessment,
});

function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [warn, setWarn] = useState<string | null>(null);

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;
  const selected = answers[q.id];

  const choose = (val: string) => {
    setAnswers((a) => ({ ...a, [q.id]: val }));
    const opt = q.options.find((o) => o.value === val);
    if (opt?.warn && opt.weight >= 2) setWarn(opt.warn);
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else {
      const { score, level } = calcScore(answers);
      const id = Date.now().toString();
      store.addResult({ id, date: new Date().toISOString(), score, level, answers });
      navigate({ to: "/result", search: { id } });
    }
  };
  const back = () => (step > 0 ? setStep(step - 1) : navigate({ to: "/home" }));

  return (
    <AppShell hideNav>
      <PageHeader title="Health Assessment" back="/home" />
      <div className="px-5 pt-4 pb-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
          <span>Question {step + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div className="h-full bg-gradient-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            <div className="text-5xl mb-3">{q.icon}</div>
            <h2 className="text-xl font-bold leading-snug">{q.title}</h2>

            <div className="mt-6 space-y-2.5">
              {q.options.map((o) => {
                const active = selected === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => choose(o.value)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      active
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{o.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        active ? "border-primary bg-primary" : "border-border"
                      }`}>
                        {active && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={back} className="flex-1 h-12 rounded-xl">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button onClick={next} disabled={!selected} className="flex-1 h-12 rounded-xl bg-gradient-primary text-primary-foreground disabled:opacity-50">
            {step === QUESTIONS.length - 1 ? "Finish" : "Next"} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Warning popup */}
      <AnimatePresence>
        {warn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
            onClick={() => setWarn(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-5 max-w-sm w-full shadow-card"
            >
              <div className="flex gap-3">
                <div className="rounded-full bg-warning/15 text-warning p-2 h-fit">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Heads up</p>
                  <p className="text-sm text-muted-foreground mt-1">{warn}</p>
                </div>
                <button onClick={() => setWarn(null)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <Button onClick={() => setWarn(null)} className="w-full mt-4 rounded-xl bg-gradient-primary text-primary-foreground">
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
