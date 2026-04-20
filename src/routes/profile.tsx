import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings, Edit3, MessageSquare, LogOut, ChevronRight, User, Flame, TrendingUp } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreChart } from "@/components/ScoreChart";
import { store } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const profile = store.getProfile();
  const results = store.getResults();
  const lastScore = results[0]?.score ?? 0;
  const streak = store.getStreak();
  const achievements = store.getAchievements();
  // chronological oldest -> newest, capped to last 10
  const chartScores = [...results].slice(0, 10).reverse().map(r => r.score);

  const logout = () => {
    store.setAuthed(false);
    navigate({ to: "/login" });
  };

  return (
    <AppShell>
      <PageHeader title="Profile" back="/home" right={
        <Link to="/settings" className="text-muted-foreground"><Settings className="h-5 w-5" /></Link>
      } />
      <div className="px-5 pt-4 pb-6">
        {/* Header card */}
        <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-card overflow-hidden border-4 border-white/30 flex items-center justify-center">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="me" className="w-full h-full object-cover" />
              ) : (
                <User className="h-9 w-9 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold truncate">{profile?.name || "Friend"}</p>
              <p className="text-sm opacity-90 truncate">{profile?.email || "—"}</p>
              {profile?.age && <p className="text-xs opacity-80 mt-1">{profile.age} • {profile.gender || ""}</p>}
            </div>
          </div>
          <Link to="/edit-profile" className="mt-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium">
            <Edit3 className="h-3.5 w-3.5" /> Edit profile
          </Link>
        </div>

        {/* Health summary */}
        <div className="mt-5 rounded-3xl bg-card border border-border p-5 shadow-soft flex items-center gap-4">
          <ScoreRing score={lastScore} size={100} label="Score" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Health Summary</p>
            <p className="font-semibold mt-1">{results.length ? "Keep up the good work!" : "Take your first assessment"}</p>
            <p className="text-xs text-muted-foreground mt-1">{results.length} assessment{results.length !== 1 ? "s" : ""} completed</p>
          </div>
        </div>

        {/* History */}
        <h2 className="text-base font-semibold mt-6 mb-3">Past assessments</h2>
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No history yet.</p>
        ) : (
          <div className="space-y-2">
            {results.map(r => (
              <Link
                key={r.id}
                to="/result"
                search={{ id: r.id }}
                className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3 shadow-soft hover:shadow-card transition-all"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  r.level === "Good" ? "bg-success" : r.level === "Moderate" ? "bg-warning" : "bg-destructive"
                }`}>{r.score}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.level}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleString()}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Link to="/feedback" className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4 shadow-soft">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="flex-1 font-medium">Send feedback</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 rounded-2xl bg-card border border-border p-4 shadow-soft text-destructive">
            <LogOut className="h-5 w-5" />
            <span className="flex-1 font-medium text-left">Log out</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
