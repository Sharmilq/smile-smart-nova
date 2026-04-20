import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCw, AlertCircle, Sparkles, CheckCircle2, Award, Info, TrendingUp, TrendingDown, Stethoscope, X, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ScoreRing } from "@/components/ScoreRing";
import { store } from "@/lib/store";
import { getRecommendations, getBadges, getScoreReason, getScoreBreakdown, getImprovementPlan, shouldRecommendDentist } from "@/lib/assessment";

export const Route = createFileRoute("/result")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) || "" }),
  component: Result,
});

function Result() {
  const { id } = Route.useSearch();
  const allResults = store.getResults();
  const result = allResults.find((r) => r.id === id) ?? allResults[0];
  const profile = store.getProfile();
  const [showReport, setShowReport] = useState(false);

  if (!result) {
    return (
      <AppShell hideNav>
        <PageHeader title="Result" back="/home" />
        <div className="p-6 text-center text-muted-foreground">No assessment found.</div>
      </AppShell>
    );
  }

  const previous = allResults.find((r) => r.id !== result.id);
  const delta = previous ? result.score - previous.score : null;

  const { issues, tips } = getRecommendations(result.answers);
  const badges = getBadges(result.answers);
  const breakdown = getScoreBreakdown(result.answers);
  const reason = getScoreReason(result.answers);
  const plan = getImprovementPlan(result.answers);
  const dentist = shouldRecommendDentist(result.answers);

  const levelColor =
    result.level === "Good" ? "bg-success" : result.level === "Moderate" ? "bg-warning" : "bg-destructive";

  return (
    <AppShell hideNav>
      <PageHeader title="Your Result" back="/home" />
      <div className="px-5 pt-4 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground text-center shadow-card"
        >
          <Sparkles className="h-6 w-6 mx-auto opacity-80" />
          <p className="text-xs uppercase tracking-wider opacity-80 mt-2">Oral Health Score</p>
          <div className="mt-3 inline-block rounded-2xl bg-white/15 backdrop-blur p-3">
            <ScoreRing score={result.score} size={150} label={result.level} />
          </div>
          <p className="mt-3 text-sm opacity-90">
            {result.level === "Good" && "Great job! Your oral health habits are excellent."}
            {result.level === "Moderate" && "You're doing okay — small improvements will go a long way."}
            {result.level === "Risk" && "Some areas need attention. Let's improve together."}
          </p>
          <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${levelColor} text-white`}>
            {result.level.toUpperCase()}
          </span>
        </motion.div>

        {/* Why this score */}
        <div className="mt-4 rounded-2xl bg-card border border-border p-4 shadow-soft flex gap-2.5">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Why this score</p>
            <p className="text-sm mt-1 leading-relaxed">{reason}</p>
          </div>
        </div>

        {/* Compare with previous */}
        {delta !== null && previous && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-2xl bg-card border border-border p-4 shadow-soft flex items-center gap-3"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
              delta > 0 ? "bg-success/15 text-success" : delta < 0 ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"
            }`}>
              {delta >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">
                {delta > 0 ? `+${delta}` : delta} vs previous
              </p>
              <p className="text-xs text-muted-foreground">
                Previous: {previous.score} ({previous.level}) · {new Date(previous.date).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        )}

        {/* Dentist recommendation */}
        {dentist && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-2xl border-2 border-warning/40 bg-warning/10 p-4 flex gap-3"
          >
            <div className="rounded-full bg-warning/20 text-warning p-2 h-fit shrink-0">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">⚠️ We recommend visiting a dentist soon</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your answers indicate signs that benefit from a professional check-up.
              </p>
              <Link to="/visit-reminder">
                <Button size="sm" className="mt-2 h-8 rounded-lg bg-warning text-white hover:bg-warning/90">
                  Set visit reminder
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {badges.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Risk indicators
            </h2>
            <div className="flex flex-wrap gap-2">
              {badges.map((b, i) => {
                const tone =
                  b.tone === "good"
                    ? "bg-success/15 text-success border-success/30"
                    : b.tone === "warn"
                      ? "bg-warning/15 text-warning border-warning/40"
                      : "bg-destructive/15 text-destructive border-destructive/30";
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${tone}`}
                  >
                    <span>{b.icon}</span> {b.label}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Improvement plan */}
        <section className="mt-6">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" /> Your Improvement Plan
          </h2>
          <div className="space-y-2">
            {plan.map((p, i) => {
              const tone =
                p.priority === "high"
                  ? "border-destructive/30"
                  : p.priority === "medium"
                    ? "border-warning/30"
                    : "border-success/30";
              const dot =
                p.priority === "high" ? "bg-destructive" : p.priority === "medium" ? "bg-warning" : "bg-success";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-2xl bg-card border ${tone} p-3 shadow-soft flex items-start gap-3`}
                >
                  <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">{p.text}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{p.priority} priority</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {issues.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" /> Key issues
            </h2>
            <div className="space-y-2">
              {issues.map((it, i) => (
                <div key={i} className="rounded-2xl bg-card border border-border p-3 text-sm shadow-soft">
                  {it}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" /> Recommendations
          </h2>
          <div className="space-y-2">
            {tips.map((t, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border p-3 text-sm shadow-soft flex gap-2.5">
                <span className="text-success">✓</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 rounded-xl active:scale-[0.97] transition-transform" onClick={() => setShowReport(true)}>
            <Download className="h-4 w-4 mr-2" /> Report
          </Button>
          <Link to="/assessment">
            <Button className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground active:scale-[0.97] transition-transform">
              <RefreshCw className="h-4 w-4 mr-2" /> Retake
            </Button>
          </Link>
        </div>
      </div>

      {/* Download report modal (UI preview) */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowReport(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl max-w-sm w-full shadow-card max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card border-b border-border px-5 py-3 flex items-center justify-between">
                <p className="font-bold">Dental Report</p>
                <button onClick={() => setShowReport(false)} className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="rounded-2xl bg-gradient-primary text-primary-foreground p-4 text-center">
                  <p className="text-xs uppercase tracking-wider opacity-80">DentNova</p>
                  <p className="font-bold text-lg mt-0.5">Oral Health Report</p>
                  <p className="text-xs opacity-80 mt-0.5">{new Date(result.date).toLocaleDateString()}</p>
                </div>

                {/* Patient */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Patient</p>
                  <div className="rounded-xl bg-muted/40 p-3 text-sm">
                    <p className="font-medium">{profile?.name || "Guest user"}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email || "—"}</p>
                    {profile?.age && <p className="text-xs text-muted-foreground">{profile.age} · {profile.gender || ""}</p>}
                  </div>
                </div>

                {/* Score */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Assessment</p>
                  <div className="rounded-xl bg-muted/40 p-3 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${levelColor}`}>
                      {result.score}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold">{result.level}</p>
                      <p className="text-xs text-muted-foreground">{reason}</p>
                    </div>
                  </div>
                </div>

                {/* Risk factors */}
                {breakdown.filter(b => b.delta < 0).length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Risk factors</p>
                    <ul className="rounded-xl bg-muted/40 p-3 text-sm space-y-1">
                      {breakdown.filter(b => b.delta < 0).map((b, i) => (
                        <li key={i} className="flex justify-between gap-2">
                          <span>{b.label}</span>
                          <span className="text-destructive font-semibold">{b.delta}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Suggestions</p>
                  <ul className="rounded-xl bg-muted/40 p-3 text-sm space-y-1.5 list-disc list-inside">
                    {plan.map((p, i) => <li key={i}>{p.text}</li>)}
                  </ul>
                </div>

                <p className="text-[10px] text-muted-foreground text-center pt-2">
                  Report preview · Generated by DentNova
                </p>

                <Button
                  onClick={() => { window.print(); }}
                  className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground"
                >
                  <Download className="h-4 w-4 mr-2" /> Save / Print
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
