import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/lib/store";

export const Route = createFileRoute("/profile-setup")({
  component: ProfileSetup,
});

const CONCERNS = ["Sensitivity", "Bleeding gums", "Bad breath", "Whitening", "Cavities", "Alignment"];

function ProfileSetup() {
  const navigate = useNavigate();
  const existing = store.getProfile();
  const [name, setName] = useState(existing?.name ?? "");
  const [age, setAge] = useState(existing?.age ?? "");
  const [gender, setGender] = useState(existing?.gender ?? "");
  const [concerns, setConcerns] = useState<string[]>(existing?.concerns ?? []);
  const [avatar, setAvatar] = useState<string | undefined>(existing?.avatar);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggle = (c: string) =>
    setConcerns((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(f);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    store.setProfile({
      name,
      email: existing?.email ?? "",
      age,
      gender,
      concerns,
      avatar,
    });
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-gradient-soft px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold">Set up your profile</h1>
        <p className="text-sm text-muted-foreground">Help us personalize your experience.</p>

        <form onSubmit={save} className="mt-8 space-y-5">
          <div className="flex justify-center">
            <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
              <div className="w-24 h-24 rounded-full bg-card shadow-soft overflow-hidden flex items-center justify-center border-2 border-primary/20">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-soft">
                <Camera className="h-3.5 w-3.5" />
              </span>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            </button>
          </div>

          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Age</Label>
              <Input value={age} onChange={(e) => setAge(e.target.value)} type="number" min="1" max="120" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm">
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Dental concerns (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {CONCERNS.map((c) => {
                const active = concerns.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle(c)}
                    className={`px-3 py-2 rounded-full text-sm border-2 transition-all ${
                      active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
