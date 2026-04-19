import { createFileRoute, Link } from "@tanstack/react-router";
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
  { slug: "flossing", title: "Flossing 101", subtitle: "Why, when and how to floss", img: flossing },
  { slug: "brushing", title: "Brushing techniques", subtitle: "Master the perfect brush", img: brushing },
  { slug: "gum-care", title: "Gum care", subtitle: "Healthy gums, healthy life", img: gums },
  { slug: "sensitivity", title: "Tooth sensitivity", subtitle: "Causes and treatments", img: sensitivity },
  { slug: "whitening", title: "Whitening myths", subtitle: "Facts vs fiction", img: whitening },
] as const;

function Education() {
  return (
    <AppShell>
      <PageHeader title="Education" back="/home" />
      <div className="px-5 pt-4 pb-6">
        <p className="text-sm text-muted-foreground mb-4">Learn from bite-sized dental health guides.</p>
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
