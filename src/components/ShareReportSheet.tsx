import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MessageCircle, Copy, Check, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  summary: string;
}

export function ShareReportSheet({ open, onClose, summary }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* no-op */ }
  };
  const options = [
    { label: "WhatsApp", icon: MessageCircle, color: "bg-success/15 text-success" },
    { label: "Email", icon: Mail, color: "bg-primary/15 text-primary" },
    { label: "Copy link", icon: LinkIcon, color: "bg-warning/15 text-warning" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl w-full max-w-sm shadow-card"
          >
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <p className="font-bold">Share report</p>
              <button onClick={onClose} className="text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3">
                {options.map((o) => {
                  const Icon = o.icon;
                  const handler = o.label === "Copy link" ? copy : () => { /* placeholder */ };
                  return (
                    <button
                      key={o.label}
                      onClick={handler}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-muted/40 p-4 active:scale-[0.97] transition-transform"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${o.color}`}>
                        {o.label === "Copy link" && copied ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <span className="text-xs font-medium">{o.label === "Copy link" && copied ? "Copied!" : o.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 rounded-xl bg-muted/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Preview</p>
                <p className="text-xs leading-relaxed whitespace-pre-line">{summary}</p>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-3">
                <Copy className="inline h-3 w-3 mr-1" />
                Sharing options are demo placeholders
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
