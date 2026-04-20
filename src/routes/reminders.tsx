import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppShell, PageHeader } from "@/components/AppShell";
import { store, type Reminder } from "@/lib/store";

export const Route = createFileRoute("/reminders")({
  component: Reminders,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newDays, setNewDays] = useState<string[]>([...DAYS]);

  useEffect(() => { setReminders(store.getReminders()); }, []);

  const update = (next: Reminder[]) => { setReminders(next); store.setReminders(next); };
  const toggle = (id: string) => update(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const remove = (id: string) => update(reminders.filter(r => r.id !== id));
  const toggleDay = (d: string) => setNewDays(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const add = () => {
    if (!newLabel) return;
    update([...reminders, { id: Date.now().toString(), label: newLabel, time: newTime, days: newDays, enabled: true }]);
    setShowAdd(false); setNewLabel(""); setNewTime("08:00"); setNewDays([...DAYS]);
  };

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

        <h2 className="text-base font-semibold mt-6 mb-3">Your reminders</h2>
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
