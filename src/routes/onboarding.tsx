import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";
import onboard1 from "@/assets/onboard-1.jpg";
import onboard2 from "@/assets/onboard-2.jpg";
import onboard3 from "@/assets/onboard-3.jpg";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const SLIDES = [
  { img: onboard1, title: "Track Your Smile", desc: "Take a quick assessment and discover the health of your teeth and gums." },
  { img: onboard2, title: "AI Tooth Scan", desc: "Snap a photo and let our AI analyze plaque, gum condition, and cleanliness." },
  { img: onboard3, title: "Daily Reminders", desc: "Never skip brushing again with smart, gentle reminders that fit your routine." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (i < SLIDES.length - 1) setI(i + 1);
    else {
      store.setOnboarded(true);
      navigate({ to: "/login" });
    }
  };
  const skip = () => {
    store.setOnboarded(true);
    navigate({ to: "/login" });
  };

  const slide = SLIDES[i];

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col p-6">
        <div className="flex justify-end">
          <button onClick={skip} className="text-sm text-muted-foreground hover:text-foreground">
            Skip
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <div className="rounded-3xl overflow-hidden shadow-card mb-8 bg-card">
                <img src={slide.img} alt={slide.title} className="w-full aspect-square object-cover" loading="lazy" width={1024} height={1024} />
              </div>
              <h2 className="text-2xl font-bold">{slide.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground px-4">{slide.desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-2">
            {SLIDES.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        <Button onClick={next} className="w-full h-12 rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90">
          {i === SLIDES.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
}
