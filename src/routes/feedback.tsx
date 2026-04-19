import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/feedback")({
  component: Feedback,
});

function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => navigate({ to: "/profile" }), 1200);
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Send feedback" back="/profile" />
      <form onSubmit={submit} className="px-5 pt-4 pb-8 space-y-6">
        <div className="rounded-3xl bg-gradient-hero p-6 text-center">
          <p className="text-sm text-muted-foreground">How would you rate DentNova?</p>
          <div className="flex justify-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
                className="p-1"
              >
                <Star className={`h-9 w-9 transition-all ${
                  (hover || rating) >= i ? "fill-warning text-warning scale-110" : "text-muted-foreground"
                }`} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-3 text-sm font-medium">
              {rating === 5 ? "We're thrilled! 🎉" : rating >= 3 ? "Thanks for the rating!" : "We'll do better."}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Tell us more (optional)</label>
          <Textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            className="mt-2 rounded-2xl"
          />
        </div>

        <Button type="submit" disabled={rating === 0} className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft disabled:opacity-50">
          <Send className="h-4 w-4 mr-2" /> Submit feedback
        </Button>
      </form>

      <AnimatePresence>
        {sent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-card rounded-3xl p-6 text-center shadow-card max-w-xs">
              <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
              <p className="font-semibold mt-3">Thank you!</p>
              <p className="text-sm text-muted-foreground">Your feedback helps us improve.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
