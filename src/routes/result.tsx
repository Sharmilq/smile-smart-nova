import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ScoreRing } from "@/components/ScoreRing";
import { store } from "@/lib/store";
import { getRecommendations } from "@/lib/assessment";

export const Route = createFileRoute("/result")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) || "" }),
  component: Result,
});

function Result() {
  const { id } = Route.useSearch();
  const result = store.getResults().find((r) => r.id === id) ?? store.getResults()[0];

  if (!result) {
    return (
      <AppShell hideNav>
        <PageHeader title="Result" back="/home" />
        <div className="p-6 text-center text-muted-foreground">No assessment found.</div>
      </AppShell>
    );
  }

  const { issues, tips } = getRecommendations(result.answers);
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
          <Button variant="outline" className="h-12 rounded-xl" onClick={() => alert("Report download (demo)")}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Link to="/assessment">
            <Button className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground">
              <RefreshCw className="h-4 w-4 mr-2" /> Retake
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
