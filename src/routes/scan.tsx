import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RefreshCw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/scan")({
  component: Scan,
});

type Stage = "idle" | "preview" | "analyzing" | "result";

interface ScanResult {
  plaque: number;
  gum: number;
  cleanliness: number;
}

function Scan() {
  const [stage, setStage] = useState<Stage>("idle");
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result as string);
      setStage("preview");
    };
    reader.readAsDataURL(f);
  };

  const analyze = () => {
    setStage("analyzing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        const np = p + 8 + Math.random() * 6;
        if (np >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setResult({
              plaque: Math.round(20 + Math.random() * 40),
              gum: Math.round(60 + Math.random() * 35),
              cleanliness: Math.round(55 + Math.random() * 40),
            });
            setStage("result");
          }, 400);
          return 100;
        }
        return np;
      });
    }, 200);
  };

  const reset = () => { setImg(null); setResult(null); setStage("idle"); setProgress(0); };

  return (
    <AppShell>
      <PageHeader title="AI Tooth Scan" back="/home" />
      <div className="px-5 pt-4 pb-6">

        {stage === "idle" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-3xl bg-gradient-hero p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-card mx-auto flex items-center justify-center shadow-soft animate-float">
                <Camera className="h-9 w-9 text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-bold">Scan your teeth</h2>
              <p className="mt-1 text-sm text-muted-foreground px-4">
                Take a clear photo of your teeth or upload one. Our AI will analyze it instantly.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Button onClick={() => fileRef.current?.click()} className="w-full h-14 rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
                <Camera className="h-5 w-5 mr-2" /> Open Camera
              </Button>
              <Button onClick={() => fileRef.current?.click()} variant="outline" className="w-full h-14 rounded-2xl border-2">
                <Upload className="h-5 w-5 mr-2" /> Upload from gallery
              </Button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            </div>

            <div className="mt-6 rounded-2xl bg-card border border-border p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Tips for best results</p>
              <ul className="space-y-1">
                <li>• Use good lighting and a clean background</li>
                <li>• Open your mouth wide and smile</li>
                <li>• Hold the camera steady and close</li>
              </ul>
            </div>
          </motion.div>
        )}

        {stage === "preview" && img && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-3xl overflow-hidden shadow-card relative">
              <img src={img} alt="scan preview" className="w-full aspect-square object-cover" />
              <button onClick={reset} className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 backdrop-blur">
                <X className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={analyze} className="w-full h-14 mt-4 rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Sparkles className="h-5 w-5 mr-2" /> Analyze with AI
            </Button>
          </motion.div>
        )}

        {stage === "analyzing" && img && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="rounded-3xl overflow-hidden shadow-card relative">
              <img src={img} alt="scan" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 rounded-full border-4 border-white border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              {/* Scanning bar */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-primary-glow shadow-glow"
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <p className="mt-5 text-sm font-medium">Analyzing your scan…</p>
            <p className="text-xs text-muted-foreground mt-1">Detecting plaque, gum condition and cleanliness</p>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}%</p>
          </motion.div>
        )}

        <AnimatePresence>
          {stage === "result" && img && result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-3xl overflow-hidden shadow-card relative">
                <img src={img} alt="scan" className="w-full aspect-square object-cover" />
                {/* Mock highlight overlays */}
                <div className="absolute top-[30%] left-[25%] w-12 h-12 rounded-full border-2 border-warning bg-warning/20 animate-pulse" />
                <div className="absolute top-[55%] right-[30%] w-10 h-10 rounded-full border-2 border-success bg-success/20" />
              </div>

              <div className="mt-5 space-y-3">
                <ScanBar label="Plaque level" value={result.plaque} inverse tone={result.plaque < 30 ? "good" : result.plaque < 60 ? "warn" : "bad"} />
                <ScanBar label="Gum condition" value={result.gum} tone={result.gum > 75 ? "good" : result.gum > 50 ? "warn" : "bad"} />
                <ScanBar label="Cleanliness score" value={result.cleanliness} tone={result.cleanliness > 75 ? "good" : result.cleanliness > 50 ? "warn" : "bad"} />
              </div>

              <Button onClick={reset} variant="outline" className="w-full h-12 mt-6 rounded-xl">
                <RefreshCw className="h-4 w-4 mr-2" /> Scan again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

function ScanBar({ label, value, tone, inverse }: { label: string; value: number; tone: "good" | "warn" | "bad"; inverse?: boolean }) {
  const color = tone === "good" ? "bg-success" : tone === "warn" ? "bg-warning" : "bg-destructive";
  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold">{value}{inverse ? "%" : "/100"}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className={`h-full ${color}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} />
      </div>
    </div>
  );
}
