import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Trash2, Stethoscope, CalendarDays, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppShell, PageHeader } from "@/components/AppShell";
import { store, type Reminder, type VisitReminder } from "@/lib/store";
import { shouldRecommendDentist } from "@/lib/assessment";

export const Route = createFileRoute("/reminders")({
  component: Reminders,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function formatVisit(v: VisitReminder) {
  const d = new Date(`${v.date}T${v.time}`);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [visits, setVisits] = useState<VisitReminder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newDays, setNewDays] = useState<string[]>([...DAYS]);
  const [showDentistTip, setShowDentistTip] = useState(false);

  useEffect(() => {
    setReminders(store.getReminders());
    setVisits(store.getVisitReminders());
    const last = store.getResults()[0];
    if (last && shouldRecommendDentist(last.answers)) {
      setShowDentistTip(true);
    }
  }, []);

  const update = (next: Reminder[]) => { setReminders(next); store.setReminders(next); };
  const toggle = (id: string) => update(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const remove = (id: string) => update(reminders.filter(r => r.id !== id));
  const removeVisit = (id: string) => {
    store.removeVisitReminder(id);
    setVisits(store.getVisitReminders());
  };
  const toggleDay = (d: string) => setNewDays(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const add = () => {
    if (!newLabel) return;
    update([...reminders, { id: Date.now().toString(), label: newLabel, time: newTime, days: newDays, enabled: true }]);
    setShowAdd(false); setNewLabel(""); setNewTime("08:00"); setNewDays([...DAYS]);
  };

  const now = new Date();
  const upcoming = visits.filter(v => new Date(`${v.date}T${v.time}`) >= now);
  const past = visits.filter(v => new Date(`${v.date}T${v.time}`) < now);

  return (
    <AppShell>
      <PageHeader
        title="Reminders"
        back="/home"
        right={<button onClick={() => setShowAdd(s => !s)} className="rounded-full bg-primary text-primary-foreground p-2 shadow-soft"><Plus className="h-4 w-4" /></button>}
      />
      <div className="px-5 pt-4 pb-6">
        <div className="rounded-3xl bg-gradient-hero p-5 flex items-center gap-3">
          <div className="rounded-2xl bg-card p-3 shadow-soft">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Time to brush! Keep your smile healthy 😊</p>
            <p className="text-xs text-muted-foreground">Includes a 3-month toothbrush replacement reminder.</p>
          </div>
        </div>

        {/* Smart suggestion */}
        {showDentistTip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border-2 border-warning/40 bg-warning/10 p-4 flex gap-3"
          >
            <div className="rounded-full bg-warning/20 text-warning p-2 h-fit shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Consider scheduling a dental visit soon</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your last assessment showed signs that may need professional care.
              </p>
              <Link to="/visit-reminder">
                <Button size="sm" className="mt-2 h-8 rounded-lg bg-warning text-white hover:bg-warning/90">
                  Set visit reminder
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Dental visits section */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" /> Dental visits
          </h2>
          <Link to="/visit-reminder" className="text-xs font-semibold text-primary">+ Add</Link>
        </div>
        <div className="mt-3 space-y-2">
          {upcoming.length === 0 && past.length === 0 && (
            <Link to="/visit-reminder" className="block rounded-2xl border-2 border-dashed border-border p-4 text-center text-sm text-muted-foreground active:scale-[0.99] transition-transform">
              No dental visits scheduled. Tap to set one.
            </Link>
          )}
          {upcoming.map(v => (
            <div key={v.id} className="rounded-2xl bg-card border border-border p-4 shadow-soft flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{v.note || "Dental Checkup"}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{formatVisit(v)}</p>
              </div>
              <button onClick={() => removeVisit(v.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {past.map(v => (
            <div key={v.id} className="rounded-2xl bg-muted/40 border border-border p-4 flex items-start gap-3 opacity-70">
              <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{v.note || "Dental Checkup"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatVisit(v)} · past</p>
              </div>
              <button onClick={() => removeVisit(v.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 rounded-2xl bg-card border border-border p-4 shadow-soft space-y-3">
            <div>
              <Label>Label</Label>
              <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Morning brushing" className="mt-1 h-11 rounded-xl" />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="mt-1 h-11 rounded-xl" />
            </div>
            <div>
              <Label className="mb-2 block">Days</Label>
              <div className="flex gap-1.5 flex-wrap">
                {DAYS.map(d => {
                  const active = newDays.includes(d);
                  return (
                    <button key={d} onClick={() => toggleDay(d)} className={`px-3 py-1.5 rounded-full text-xs border-2 ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={add} className="flex-1 rounded-xl bg-gradient-primary text-primary-foreground">Save</Button>
            </div>
          </motion.div>
        )}

        <h2 className="text-base font-semibold mt-6 mb-3">Daily reminders</h2>
        <div className="space-y-3">
          {reminders.map(r => (
            <div key={r.id} className="rounded-2xl bg-card border border-border p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{r.label}</p>
                  <p className="text-2xl font-bold text-primary mt-0.5">{r.time}</p>
                  <div className="flex gap-1 mt-2">
                    {DAYS.map(d => (
                      <span key={d} className={`text-[10px] w-6 h-6 rounded-full flex items-center justify-center ${r.days.includes(d) ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {d[0]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} />
                  <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {reminders.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No reminders yet. Add one to get started.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
