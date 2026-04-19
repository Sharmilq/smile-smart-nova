import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/lib/store";

export const Route = createFileRoute("/register")({
  component: Register,
});

function strength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const s = useMemo(() => strength(pwd), [pwd]);
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-primary", "bg-success"];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== confirm) { setError("Passwords do not match."); return; }
    if (s < 2) { setError("Please choose a stronger password."); return; }
    store.setProfile({ name, email });
    store.setAuthed(true);
    navigate({ to: "/profile-setup" });
  };

  return (
    <div className="min-h-screen bg-gradient-soft px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-sm text-muted-foreground">Join DentNova and start caring for your smile.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe" className="h-12 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="h-12 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required placeholder="••••••••" className="h-12 rounded-xl" />
            {pwd && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[0,1,2,3].map(i => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full ${i < s ? colors[s] : "bg-muted"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{labels[s]}</p>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Confirm password</Label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="••••••••" className="h-12 rounded-xl" />
            {confirm && pwd !== confirm && <p className="text-xs text-destructive">Passwords do not match</p>}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90">
            Create account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
