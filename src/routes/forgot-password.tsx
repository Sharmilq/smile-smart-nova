import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        <Link to="/login" className="text-sm text-muted-foreground">← Back</Link>
        <h1 className="mt-6 text-2xl font-bold">Forgot password?</h1>
        <p className="text-sm text-muted-foreground">Enter your email and we'll send you reset instructions.</p>

        {!sent ? (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground">Send link</Button>
          </form>
        ) : (
          <div className="mt-10 text-center bg-card rounded-2xl p-8 shadow-soft">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
            <p className="mt-4 font-medium">Check your inbox</p>
            <p className="text-sm text-muted-foreground mt-1">We sent a reset link to {email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
