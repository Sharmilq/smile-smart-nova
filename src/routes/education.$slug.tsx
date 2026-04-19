import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/AppShell";
import { TOPICS } from "./education";

export const Route = createFileRoute("/education/$slug")({
  component: Topic,
});

const CONTENT: Record<string, { intro: string; bullets: string[]; tips: string[]; duration: string }> = {
  flossing: {
    intro: "Flossing removes plaque and food particles your toothbrush can't reach — between teeth and under the gumline.",
    bullets: [
      "Floss at least once a day, ideally before bed.",
      "Use about 18 inches of floss; wind around middle fingers.",
      "Slide gently — never snap floss into the gum.",
      "Curve floss into a C-shape around each tooth.",
    ],
    tips: [
      "Floss before brushing for better fluoride absorption.",
      "Use waxed floss if your teeth are tightly spaced.",
      "Try floss picks if traditional floss feels awkward.",
      "Replace your floss technique — never reuse the same section.",
      "Be consistent: daily flossing beats occasional deep cleans.",
    ],
    duration: "3:24",
  },
  brushing: {
    intro: "Proper technique matters more than pressure. Soft brush + 2 minutes + correct angle = clean, healthy teeth.",
    bullets: [
      "Hold brush at a 45° angle to the gumline.",
      "Use small circular motions, not back-and-forth scrubbing.",
      "Brush all surfaces: outer, inner, and chewing.",
      "Don't forget your tongue — bacteria hide there.",
    ],
    tips: [
      "Brush twice daily — morning and before bed.",
      "Use soft bristles to protect enamel and gums.",
      "Replace your toothbrush every 3 months.",
      "Use fluoride toothpaste for cavity protection.",
      "Avoid sugary snacks between brushing.",
    ],
    duration: "2:48",
  },
  "gum-care": {
    intro: "Healthy gums are firm, pink, and don't bleed. Gum disease is preventable with consistent care.",
    bullets: [
      "Watch for redness, swelling or bleeding.",
      "Don't smoke — it's a major gum disease risk.",
      "Use a soft toothbrush; hard bristles damage gums.",
      "Visit your dentist if bleeding lasts over a week.",
    ],
    tips: [
      "Massage gums gently while brushing to boost circulation.",
      "Rinse with warm salt water if gums feel inflamed.",
      "Eat vitamin C-rich foods for gum health.",
      "Stay hydrated to maintain healthy saliva flow.",
      "Schedule professional cleanings every 6 months.",
    ],
    duration: "4:10",
  },
  sensitivity: {
    intro: "Tooth sensitivity often comes from worn enamel or exposed roots. The good news: it's usually manageable.",
    bullets: [
      "Try desensitizing toothpaste for 2-4 weeks.",
      "Avoid acidic foods that wear down enamel.",
      "Don't brush too hard — it damages enamel.",
      "Persistent pain? See a dentist for evaluation.",
    ],
    tips: [
      "Use lukewarm water instead of cold when brushing.",
      "Wait 30 minutes after acidic foods before brushing.",
      "Try a straw when drinking citrus or soda.",
      "Avoid teeth grinding — consider a night guard.",
      "Switch to a soft-bristled toothbrush immediately.",
    ],
    duration: "3:55",
  },
  whitening: {
    intro: "Many whitening claims are exaggerated. Here's what actually works — and what to avoid.",
    bullets: [
      "Charcoal toothpaste is abrasive — not recommended.",
      "Lemon and baking soda erode enamel; avoid DIY.",
      "Professional whitening is safer and more effective.",
      "Daily care prevents most stains in the first place.",
    ],
    tips: [
      "Limit coffee, tea, and red wine — major staining culprits.",
      "Rinse with water after staining drinks.",
      "Quit smoking for both health and whiter teeth.",
      "Use a whitening toothpaste with the ADA seal.",
      "Consult your dentist before any whitening treatment.",
    ],
    duration: "5:12",
  },
};

function Topic() {
  const { slug } = Route.useParams();
  const topic = TOPICS.find((t) => t.slug === slug);
  const content = CONTENT[slug];

  if (!topic || !content) {
    return (
      <AppShell hideNav>
        <PageHeader title="Topic" back="/education" />
        <div className="p-6 text-center text-muted-foreground">Topic not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <PageHeader title={topic.title} back="/education" />
      <div className="aspect-[16/9] overflow-hidden">
        <img src={topic.img} alt={topic.title} className="w-full h-full object-cover" />
      </div>
      <div className="px-5 py-5">
        <h1 className="text-2xl font-bold">{topic.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{topic.subtitle}</p>

        <p className="mt-5 text-sm leading-relaxed">{content.intro}</p>

        <h2 className="mt-6 font-semibold">Key takeaways</h2>
        <ul className="mt-3 space-y-2">
          {content.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-sm">
              <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Video placeholder */}
        <h2 className="mt-6 font-semibold">Watch & learn</h2>
        <div className="mt-3 rounded-2xl bg-muted aspect-video relative overflow-hidden border border-border">
          <img src={topic.img} alt="" className="w-full h-full object-cover opacity-60" />
          <button className="absolute inset-0 flex items-center justify-center" aria-label="Play video">
            <span className="w-16 h-16 rounded-full bg-card shadow-card flex items-center justify-center">
              <Play className="h-7 w-7 text-primary fill-primary ml-1" />
            </span>
          </button>
          <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">Video</span>
          <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">{content.duration}</span>
        </div>

        {/* Tips & Best Practices */}
        <h2 className="mt-6 font-semibold">Tips & Best Practices</h2>
        <ul className="mt-3 space-y-2">
          {content.tips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {i + 1}
              </span>
              <span className="pt-0.5">{tip}</span>
            </li>
          ))}
        </ul>

        <Link to="/education">
          <Button className="w-full mt-6 h-12 rounded-xl bg-gradient-primary text-primary-foreground">
            Learn more topics
          </Button>
        </Link>
      </div>
    </AppShell>
  );
}
