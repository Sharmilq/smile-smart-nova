// Lightweight client-side store using localStorage for demo purposes.
import { useEffect, useState } from "react";

export type AssessmentAnswers = Record<number, string>;

export interface UserProfile {
  name: string;
  email: string;
  age?: string;
  gender?: string;
  concerns?: string[];
  avatar?: string;
}

export interface AssessmentResult {
  id: string;
  date: string;
  score: number;
  level: "Good" | "Moderate" | "Risk";
  answers: AssessmentAnswers;
}

const KEY_PROFILE = "dn_profile";
const KEY_RESULTS = "dn_results";
const KEY_REMINDERS = "dn_reminders";
const KEY_AUTH = "dn_auth";
const KEY_ONBOARD = "dn_onboard";

export interface Reminder {
  id: string;
  label: string;
  time: string;
  days: string[];
  enabled: boolean;
}

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getProfile: () => read<UserProfile | null>(KEY_PROFILE, null),
  setProfile: (p: UserProfile) => write(KEY_PROFILE, p),
  getResults: () => read<AssessmentResult[]>(KEY_RESULTS, []),
  addResult: (r: AssessmentResult) => {
    const all = read<AssessmentResult[]>(KEY_RESULTS, []);
    write(KEY_RESULTS, [r, ...all].slice(0, 20));
  },
  getReminders: () => read<Reminder[]>(KEY_REMINDERS, [
    { id: "1", label: "Morning Brushing", time: "07:30", days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], enabled: true },
    { id: "2", label: "Night Brushing", time: "22:00", days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], enabled: true },
    { id: "3", label: "Floss", time: "21:45", days: ["Mon","Wed","Fri"], enabled: false },
  ]),
  setReminders: (r: Reminder[]) => write(KEY_REMINDERS, r),
  isAuthed: () => read<boolean>(KEY_AUTH, false),
  setAuthed: (v: boolean) => write(KEY_AUTH, v),
  hasOnboarded: () => read<boolean>(KEY_ONBOARD, false),
  setOnboarded: (v: boolean) => write(KEY_ONBOARD, v),
};

export function useLocalState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    setV(read<T>(key, initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = (val: T) => {
    setV(val);
    write(key, val);
  };
  return [v, set];
}
