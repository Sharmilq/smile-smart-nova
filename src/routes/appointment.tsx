import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, MapPin, CheckCircle2, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/appointment")({
  component: Appointment,
});

const SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const REASONS = ["Routine check-up", "Cleaning", "Bleeding gums", "Tooth pain", "Whitening consult"];

function Appointment() {
  const navigate = useNavigate();
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [booked, setBooked] = useState(false);

  const days = useMemo(() => {
    const arr: { iso: string; label: string; dayNum: number; weekday: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      arr.push({
        iso: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString(undefined, { month: "short" }),
        dayNum: d.getDate(),
        weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
      });
    }
    return arr;
  }, []);

  const confirm = () => {
    if (!date || !slot) {
      toast.error("Pick a date and time slot");
      return;
    }
    setBooked(true);
    toast.success("Appointment booked!");
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Book Appointment" back="/home" />
      <div className="px-5 pt-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-card flex items-center gap-3"
        >
          <div className="rounded-2xl bg-white/20 backdrop-blur p-3">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm opacity-90">DentNova Care Network</p>
            <p className="font-bold">Book a dental visit</p>
            <p className="text-xs opacity-80 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> Nearest verified clinic
            </p>
          </div>
        </motion.div>

        {/* Reason */}
        <h2 className="text-base font-semibold mt-6 mb-2 flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" /> Reason for visit
        </h2>
        <div className="flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all active:scale-95 ${
                reason === r ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Date picker */}
        <h2 className="text-base font-semibold mt-6 mb-2 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" /> Select date
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
          {days.map((d) => {
            const active = date === d.iso;
            return (
              <button
                key={d.iso}
                onClick={() => setDate(d.iso)}
                className={`shrink-0 w-16 rounded-2xl border-2 p-3 text-center transition-all active:scale-95 ${
                  active ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-card"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider opacity-80">{d.weekday}</p>
                <p className="text-xl font-bold leading-tight">{d.dayNum}</p>
                <p className="text-[10px] opacity-80">{d.label}</p>
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        <h2 className="text-base font-semibold mt-6 mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Select time
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {SLOTS.map((s) => {
            const active = slot === s;
            return (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all active:scale-95 ${
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <Button
          onClick={confirm}
          disabled={!date || !slot}
          className="w-full h-13 mt-8 h-12 rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft disabled:opacity-50 active:scale-[0.98]"
        >
          Book Appointment
        </Button>
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Demo only — no real booking is made.
        </p>
      </div>

      {/* Confirmation */}
      <AnimatePresence>
        {booked && date && slot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setBooked(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-6 max-w-sm w-full shadow-card text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <h3 className="font-bold text-lg mt-3">Appointment confirmed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at {slot}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{reason}</p>
              <Button
                onClick={() => navigate({ to: "/home" })}
                className="w-full h-12 rounded-xl mt-5 bg-gradient-primary text-primary-foreground"
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
