import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import flossing from "@/assets/edu-flossing.jpg";
import brushing from "@/assets/edu-brushing.jpg";
import gums from "@/assets/edu-gums.jpg";
import sensitivity from "@/assets/edu-sensitivity.jpg";
import whitening from "@/assets/edu-whitening.jpg";

export const Route = createFileRoute("/education/")({
  component: Education,
});

export const TOPICS = [
  { slug: "flossing", title: "Flossing", subtitle: "Why, when and how to floss", img: flossing },
  { slug: "brushing", title: "Brushing techniques", subtitle: "Master the perfect brush", img: brushing },
  { slug: "gum-care", title: "Gum care", subtitle: "Healthy gums, healthy life", img: gums },
  { slug: "sensitivity", title: "Tooth sensitivity", subtitle: "Causes and treatments", img: sensitivity },
  { slug: "whitening", title: "Whitening myths", subtitle: "Facts vs fiction", img: whitening },
] as const;

const FACTS = [
  "Tooth enamel is the hardest substance in your body — even harder than bone.",
  "The average person spends 38.5 days brushing their teeth over a lifetime.",
  "No two people have the same set of teeth — they're as unique as fingerprints.",
  "Saliva helps protect your teeth by neutralizing acids from food.",
];

const QUIZ = {
  question: "How long should you brush your teeth?",
  options: [
    { label: "1 minute", correct: false },
    { label: "2 minutes", correct: true },
    { label: "5 minutes", correct: false },
  ],
  explain: "Dentists recommend brushing for a full 2 minutes — long enough to clean every surface without overdoing it.",
};

function Education() {
  const factIdx = Math.floor((Date.now() / 86400000) % FACTS.length);
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <AppShell>
      <PageHeader title="Education" back="/home" />
      <div className="px-5 pt-4 pb-6">
        <p className="text-sm text-muted-foreground mb-4">Learn from bite-sized dental health guides.</p>

        {/* Did You Know */}
        <div className="rounded-3xl bg-gradient-hero p-4 flex gap-3 items-start shadow-soft mb-4">
          <div className="rounded-2xl bg-card p-2.5 shadow-soft">
            <Lightbulb className="h-5 w-5 text-warning" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Did you know?</p>
            <p className="text-sm mt-1 leading-relaxed">{FACTS[factIdx]}</p>
          </div>
        </div>

        {/* Mini Quiz */}
        <div className="rounded-3xl bg-card border border-border p-4 shadow-soft mb-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick quiz</p>
          </div>
          <p className="font-semibold text-sm">{QUIZ.question}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {QUIZ.options.map((o, i) => {
              const isPicked = picked === i;
              const showState = picked !== null;
              const correct = o.correct;
              const cls = !showState
                ? "border-border bg-card hover:border-primary/40"
                : correct
                  ? "border-success bg-success/10 text-success"
                  : isPicked
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-card opacity-60";
              return (
                <button
                  key={i}
                  onClick={() => picked === null && setPicked(i)}
                  className={`p-2.5 rounded-xl border-2 text-xs font-semibold transition-all flex items-center justify-center gap-1 ${cls}`}
                >
                  {showState && correct && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {showState && isPicked && !correct && <XCircle className="h-3.5 w-3.5" />}
                  {o.label}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
              {QUIZ.explain}{" "}
              <button onClick={() => setPicked(null)} className="text-primary font-semibold ml-1">Try again</button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {TOPICS.map((t) => (
            <Link
              key={t.slug}
              to="/education/$slug"
              params={{ slug: t.slug }}
              className="block rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-card transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img src={t.img} alt={t.title} className="w-full h-full object-cover" loading="lazy" width={1024} height={576} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{t.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
