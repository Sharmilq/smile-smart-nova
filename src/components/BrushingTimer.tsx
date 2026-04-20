import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";

const TOTAL = 120; // 2 minutes

export function BrushingTimer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [remaining, setRemaining] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setRemaining(TOTAL); setRunning(false); setDone(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [open]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            store.logBrushSession();
            store.toggleHabit("brush");
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const progress = ((TOTAL - remaining) / TOTAL) * 100;
  const r = 88;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl p-6 w-full max-w-sm shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-lg">Brushing Timer</p>
              <button onClick={onClose} className="text-muted-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="relative w-56 h-56 mx-auto">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={r} className="stroke-muted" strokeWidth="10" fill="none" />
                <circle
                  cx="100" cy="100" r={r}
                  className={done ? "stroke-success" : "stroke-primary"}
                  strokeWidth="10" fill="none" strokeLinecap="round"
                  strokeDasharray={c} strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {done ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-success/15 text-success flex items-center justify-center mb-2">
                      <Check className="h-7 w-7" />
                    </div>
                    <p className="font-bold text-base">Well done!</p>
                    <p className="text-xs text-muted-foreground text-center px-4 mt-1">You completed your brushing session</p>
                  </>
                ) : (
                  <>
                    <p className="text-5xl font-bold tabular-nums">{mm}:{ss}</p>
                    <p className="text-xs text-muted-foreground mt-1">{running ? "Keep brushing…" : "Ready when you are"}</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              {!done ? (
                <>
                  <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => { setRemaining(TOTAL); setRunning(false); }}>
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset
                  </Button>
                  <Button onClick={() => setRunning((v) => !v)} className="flex-1 rounded-xl h-11 bg-gradient-primary text-primary-foreground">
                    {running ? <><Pause className="h-4 w-4 mr-2" /> Pause</> : <><Play className="h-4 w-4 mr-2" /> Start</>}
                  </Button>
                </>
              ) : (
                <Button onClick={onClose} className="flex-1 rounded-xl h-11 bg-gradient-primary text-primary-foreground">
                  Done
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
