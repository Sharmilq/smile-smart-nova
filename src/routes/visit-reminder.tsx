import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, CheckCircle2, Stethoscope, NotebookPen, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppShell, PageHeader } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { store, type VisitReminder } from "@/lib/store";

export const Route = createFileRoute("/visit-reminder")({
  component: VisitReminderPage,
});

function VisitReminderPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("10:00");
  const [note, setNote] = useState<string>("Routine checkup");
  const [confirmed, setConfirmed] = useState(false);

  const setIn3Months = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    setDate(d);
    toast.success("Date set to 3 months from today");
  };

  const save = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    const v: VisitReminder = {
      id: Date.now().toString(),
      date: date.toISOString().slice(0, 10),
      time,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    store.addVisitReminder(v);
    setConfirmed(true);
    toast.success("Dental visit reminder set");
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Dental Visit Reminder" back="/home" />
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
            <p className="text-sm opacity-90">Stay on top of your oral health</p>
            <p className="font-bold">Schedule a dental checkup</p>
            <p className="text-xs opacity-80 mt-0.5">We'll remind you when it's time</p>
          </div>
        </motion.div>

        {/* Quick action */}
        <button
          onClick={setIn3Months}
          className="mt-4 w-full rounded-2xl bg-card border border-border p-4 shadow-soft flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-soft">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold text-sm">Remind me after 3 months</p>
            <p className="text-[11px] text-muted-foreground">Standard dental checkup interval</p>
          </div>
        </button>

        {/* Form card */}
        <div className="mt-4 rounded-2xl bg-card border border-border p-4 shadow-soft space-y-4">
          {/* Date */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Select date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 rounded-xl justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" /> Select time
            </Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          {/* Note */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <NotebookPen className="h-4 w-4 text-primary" /> Note (optional)
            </Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Routine checkup"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <Button
          onClick={save}
          disabled={!date}
          className="w-full h-12 mt-6 rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft disabled:opacity-50 active:scale-[0.98]"
        >
          Set Reminder
        </Button>
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Your reminder will appear in the Reminders screen.
        </p>
      </div>

      {/* Confirmation */}
      <AnimatePresence>
        {confirmed && date && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setConfirmed(false)}
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
              <h3 className="font-bold text-lg mt-3">Reminder set</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {format(date, "EEEE, MMMM d")} at {time}
              </p>
              {note && <p className="text-xs text-muted-foreground mt-1">{note}</p>}
              <Button
                onClick={() => navigate({ to: "/reminders" })}
                className="w-full h-12 rounded-xl mt-5 bg-gradient-primary text-primary-foreground"
              >
                View reminders
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
