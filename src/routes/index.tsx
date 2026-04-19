import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import heroTooth from "@/assets/hero-tooth.jpg";
import { store } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      const next = !store.hasOnboarded()
        ? "/onboarding"
        : !store.isAuthed()
          ? "/login"
          : "/home";
      navigate({ to: next });
    }, 2400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden flex items-center justify-center px-6">
      {/* Floating decorative icons */}
      <div className="absolute inset-0 pointer-events-none">
        {["🦷", "✨", "💧", "🪥", "🌿", "💎"].map((e, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-40"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative text-center"
      >
        <motion.div
          className="mx-auto mb-6 rounded-full bg-card shadow-glow p-4 w-32 h-32 flex items-center justify-center animate-pulse-ring"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={heroTooth} alt="DentNova logo" className="w-24 h-24 object-contain" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gradient flex items-center justify-center gap-2">
          DentNova <Sparkles className="h-6 w-6 text-primary-glow" />
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xs mx-auto">
          Smart Dental Care for a Healthier Smile
        </p>

        <div className="mt-10 flex justify-center">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
