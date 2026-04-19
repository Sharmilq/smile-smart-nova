import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppShell, PageHeader } from "@/components/AppShell";
import { store } from "@/lib/store";

export const Route = createFileRoute("/edit-profile")({
  component: EditProfile,
});

function EditProfile() {
  const navigate = useNavigate();
  const p = store.getProfile();
  const [name, setName] = useState(p?.name ?? "");
  const [email, setEmail] = useState(p?.email ?? "");
  const [age, setAge] = useState(p?.age ?? "");
  const [gender, setGender] = useState(p?.gender ?? "");
  const [avatar, setAvatar] = useState<string | undefined>(p?.avatar);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setAvatar(r.result as string);
    r.readAsDataURL(f);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    store.setProfile({ name, email, age, gender, avatar, concerns: p?.concerns });
    setSaved(true);
    setTimeout(() => navigate({ to: "/profile" }), 900);
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Edit profile" back="/profile" />
      <form onSubmit={save} className="px-5 pt-4 pb-8 space-y-5">
        <div className="flex justify-center">
          <button type="button" onClick={() => fileRef.current?.click()} className="relative">
            <div className="w-24 h-24 rounded-full bg-card shadow-soft overflow-hidden border-2 border-primary/20 flex items-center justify-center">
              {avatar ? <img src={avatar} alt="me" className="w-full h-full object-cover" /> : <Camera className="h-7 w-7 text-muted-foreground" />}
            </div>
            <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-soft">
              <Camera className="h-3.5 w-3.5" />
            </span>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          </button>
        </div>

        <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl" /></div>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Age</Label><Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="h-12 rounded-xl" /></div>
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

        <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">Save changes</Button>
      </form>

      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-card rounded-3xl p-6 text-center shadow-card max-w-xs">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
              </motion.div>
              <p className="font-semibold mt-3">Saved!</p>
              <p className="text-sm text-muted-foreground">Your profile has been updated.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
