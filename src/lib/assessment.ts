import type { AssessmentAnswers } from "./store";

export interface QuestionOption {
  value: string;
  label: string;
  weight: number; // 0 (best) -> 3 (worst)
  warn?: string; // suggestion popup if unhealthy
}

export interface Question {
  id: number;
  icon: string; // emoji icon
  title: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1, icon: "🪥", title: "How often do you brush your teeth?",
    options: [
      { value: "twice", label: "Twice a day", weight: 0 },
      { value: "once", label: "Once a day", weight: 1, warn: "Brushing twice daily is recommended for optimal oral health." },
      { value: "sometimes", label: "Sometimes", weight: 2, warn: "Try to brush at least twice a day to prevent plaque buildup." },
      { value: "rarely", label: "Rarely", weight: 3, warn: "Brushing rarely puts you at high risk of cavities and gum disease." },
    ],
  },
  {
    id: 2, icon: "⏱️", title: "How long do you brush each time?",
    options: [
      { value: "2min", label: "2 minutes or more", weight: 0 },
      { value: "1min", label: "About 1 minute", weight: 1, warn: "Aim for at least 2 minutes to clean all surfaces." },
      { value: "less", label: "Less than 1 minute", weight: 2, warn: "Short brushing leaves plaque behind." },
    ],
  },
  {
    id: 3, icon: "🧵", title: "Do you floss regularly?",
    options: [
      { value: "daily", label: "Daily", weight: 0 },
      { value: "weekly", label: "Few times a week", weight: 1 },
      { value: "rarely", label: "Rarely", weight: 2, warn: "Flossing prevents gum disease and removes food particles." },
      { value: "never", label: "Never", weight: 3, warn: "Not flossing significantly increases risk of gum problems." },
    ],
  },
  {
    id: 4, icon: "🩸", title: "Do your gums bleed when brushing?",
    options: [
      { value: "never", label: "Never", weight: 0 },
      { value: "sometimes", label: "Sometimes", weight: 2, warn: "Bleeding gums may indicate early gingivitis." },
      { value: "often", label: "Often", weight: 3, warn: "Frequent bleeding requires a dental visit." },
    ],
  },
  {
    id: 5, icon: "❄️", title: "Do you experience tooth sensitivity?",
    options: [
      { value: "no", label: "No", weight: 0 },
      { value: "mild", label: "Mild", weight: 1 },
      { value: "moderate", label: "Moderate", weight: 2 },
      { value: "severe", label: "Severe", weight: 3, warn: "Severe sensitivity may indicate enamel erosion." },
    ],
  },
  {
    id: 6, icon: "🍬", title: "How often do you consume sugary foods or drinks?",
    options: [
      { value: "rare", label: "Rarely", weight: 0 },
      { value: "weekly", label: "Few times a week", weight: 1 },
      { value: "daily", label: "Daily", weight: 2, warn: "Frequent sugar intake accelerates tooth decay." },
      { value: "multi", label: "Multiple times a day", weight: 3, warn: "High sugar exposure puts you at high risk for cavities." },
    ],
  },
  {
    id: 7, icon: "🚬", title: "Do you smoke or use tobacco?",
    options: [
      { value: "no", label: "No", weight: 0 },
      { value: "occasional", label: "Occasionally", weight: 2, warn: "Tobacco stains teeth and harms gums." },
      { value: "daily", label: "Daily", weight: 3, warn: "Tobacco use is a major cause of gum disease and oral cancer." },
    ],
  },
  {
    id: 8, icon: "🦷", title: "When was your last dental check-up?",
    options: [
      { value: "6m", label: "Within 6 months", weight: 0 },
      { value: "1y", label: "Within 1 year", weight: 1 },
      { value: "2y", label: "Within 2 years", weight: 2, warn: "Yearly checkups help catch issues early." },
      { value: "more", label: "More than 2 years ago", weight: 3, warn: "It's time to schedule a dental visit." },
    ],
  },
  {
    id: 9, icon: "😬", title: "Do you have bad breath issues?",
    options: [
      { value: "no", label: "No", weight: 0 },
      { value: "sometimes", label: "Sometimes", weight: 1 },
      { value: "often", label: "Often", weight: 2, warn: "Persistent bad breath can indicate gum issues." },
    ],
  },
  {
    id: 10, icon: "🌙", title: "Do you grind your teeth at night?",
    options: [
      { value: "no", label: "No", weight: 0 },
      { value: "sometimes", label: "Sometimes", weight: 1 },
      { value: "often", label: "Often", weight: 2, warn: "Grinding wears enamel; consider a night guard." },
    ],
  },
  {
    id: 11, icon: "💧", title: "How much water do you drink daily?",
    options: [
      { value: "8", label: "8+ glasses", weight: 0 },
      { value: "4", label: "4-7 glasses", weight: 1 },
      { value: "less", label: "Less than 4 glasses", weight: 2, warn: "Hydration helps wash away bacteria." },
    ],
  },
  {
    id: 12, icon: "🥤", title: "Do you drink coffee, tea, or soda regularly?",
    options: [
      { value: "no", label: "Rarely", weight: 0 },
      { value: "1-2", label: "1-2 cups daily", weight: 1 },
      { value: "many", label: "Many cups daily", weight: 2, warn: "These drinks can stain teeth and erode enamel." },
    ],
  },
  {
    id: 13, icon: "✨", title: "Are you happy with your smile?",
    options: [
      { value: "yes", label: "Very happy", weight: 0 },
      { value: "ok", label: "Somewhat", weight: 1 },
      { value: "no", label: "Not really", weight: 2 },
    ],
  },
];

export function calcScore(answers: AssessmentAnswers) {
  const max = QUESTIONS.length * 3;
  let total = 0;
  for (const q of QUESTIONS) {
    const a = answers[q.id];
    const opt = q.options.find((o) => o.value === a);
    total += opt?.weight ?? 0;
  }
  // 100 = perfect, 0 = terrible
  const score = Math.round(((max - total) / max) * 100);
  const level: "Good" | "Moderate" | "Risk" = score >= 80 ? "Good" : score >= 55 ? "Moderate" : "Risk";
  return { score, level };
}

// Per-question score deltas (positive = healthy, negative = risky) used to
// build a transparent breakdown shown to the user.
const DELTA_LABELS: Record<number, string> = {
  1: "Brushing frequency",
  2: "Brushing duration",
  3: "Flossing habit",
  4: "Gum bleeding",
  5: "Tooth sensitivity",
  6: "Sugar intake",
  7: "Tobacco use",
  8: "Dental checkup",
  9: "Bad breath",
  10: "Teeth grinding",
  11: "Hydration",
  12: "Staining drinks",
  13: "Smile confidence",
};

export interface ScoreDelta {
  label: string;
  delta: number; // positive or negative contribution
  reason: string;
}

export function getScoreBreakdown(answers: AssessmentAnswers): ScoreDelta[] {
  const out: ScoreDelta[] = [];
  for (const q of QUESTIONS) {
    const a = answers[q.id];
    const opt = q.options.find((o) => o.value === a);
    if (!opt) continue;
    // Map weight (0..3) to a +/- delta. weight 0 -> +10, 1 -> 0, 2 -> -8, 3 -> -12
    const deltaMap: Record<number, number> = { 0: 10, 1: 0, 2: -8, 3: -12 };
    const delta = deltaMap[opt.weight] ?? 0;
    if (delta === 0) continue;
    out.push({
      label: DELTA_LABELS[q.id] ?? q.title,
      delta,
      reason: delta > 0 ? `${opt.label} 👍` : opt.label,
    });
  }
  return out.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

export function getScoreReason(answers: AssessmentAnswers): string {
  const breakdown = getScoreBreakdown(answers);
  const negatives = breakdown.filter((b) => b.delta < 0).slice(0, 3).map((b) => b.label.toLowerCase());
  const positives = breakdown.filter((b) => b.delta > 0).slice(0, 2).map((b) => b.label.toLowerCase());
  if (negatives.length === 0 && positives.length > 0) {
    return `Score boosted by your ${positives.join(" and ")}.`;
  }
  if (negatives.length === 0) return "Balanced answers — keep your routine consistent.";
  return `Score reduced due to ${negatives.join(", ")}${positives.length ? `; boosted by ${positives.join(" and ")}` : ""}.`;
}

export function shouldRecommendDentist(answers: AssessmentAnswers): boolean {
  // Frequent gum bleeding, severe sensitivity, or long overdue checkup
  if (answers[4] === "often") return true;
  if (answers[5] === "severe") return true;
  if (answers[8] === "more") return true;
  if (answers[9] === "often" && (answers[4] === "sometimes" || answers[4] === "often")) return true;
  return false;
}

export interface ImprovementItem {
  text: string;
  priority: "high" | "medium" | "low";
}

export function getImprovementPlan(answers: AssessmentAnswers): ImprovementItem[] {
  const plan: ImprovementItem[] = [];
  if (answers[1] !== "twice") plan.push({ text: "Brush twice daily — morning and before bed", priority: "high" });
  if (answers[2] !== "2min") plan.push({ text: "Brush for the full 2 minutes each session", priority: "medium" });
  if (answers[3] !== "daily") plan.push({ text: "Floss at least once a day", priority: "medium" });
  if (answers[4] === "sometimes" || answers[4] === "often") plan.push({ text: "Switch to soft bristles and book a dental check-up for bleeding gums", priority: "high" });
  if (answers[6] === "daily" || answers[6] === "multi") plan.push({ text: "Reduce sugary snacks and rinse with water after sweets", priority: "high" });
  if (answers[7] === "occasional" || answers[7] === "daily") plan.push({ text: "Cut down on tobacco — major risk for gums", priority: "high" });
  if (answers[8] === "2y" || answers[8] === "more") plan.push({ text: "Schedule a dental check-up soon", priority: "high" });
  if (answers[11] === "less") plan.push({ text: "Drink at least 6–8 glasses of water daily", priority: "low" });
  if (answers[10] === "often") plan.push({ text: "Ask your dentist about a night guard for grinding", priority: "medium" });
  if (plan.length === 0) plan.push({ text: "Maintain your current routine — you're doing great!", priority: "low" });
  return plan.slice(0, 6);
}

export function getRecommendations(answers: AssessmentAnswers): { issues: string[]; tips: string[] } {
  const issues: string[] = [];
  const tips: string[] = [];
  for (const q of QUESTIONS) {
    const a = answers[q.id];
    const opt = q.options.find((o) => o.value === a);
    if (opt && opt.weight >= 2 && opt.warn) {
      issues.push(opt.warn);
    }
  }

  // Personalized smart suggestions based on specific answers
  const smart: string[] = [];
  if (answers[1] === "once" || answers[1] === "sometimes" || answers[1] === "rarely") {
    smart.push("Brush at least twice daily — morning and before bed.");
  }
  if (answers[3] === "rarely" || answers[3] === "never") {
    smart.push("Add daily flossing to your routine for healthier gums.");
  }
  if (answers[4] === "sometimes" || answers[4] === "often") {
    smart.push("Bleeding gums detected — consider booking a dental consultation.");
  }
  if (answers[6] === "daily" || answers[6] === "multi") {
    smart.push("Cut back on sugar and rinse with water after sweets.");
  }
  if (answers[7] === "occasional" || answers[7] === "daily") {
    smart.push("Tobacco harms your gums and stains teeth — quitting helps fast.");
  }
  if (answers[2] === "less" || answers[2] === "1min") {
    smart.push("Use a soft-bristled brush and aim for the full 2 minutes.");
  }
  if (answers[8] === "2y" || answers[8] === "more") {
    smart.push("Schedule a dental checkup — early detection prevents bigger issues.");
  }
  if (answers[11] === "less") {
    smart.push("Drink more water daily to wash away food and bacteria.");
  }

  // Generic best-practice tips fill the rest
  const generic = [
    "Brush twice daily for 2 minutes with fluoride toothpaste.",
    "Floss at least once a day to remove plaque between teeth.",
    "Limit sugary snacks and drinks; rinse with water after.",
    "Visit your dentist every 6 months for a checkup and cleaning.",
    "Stay hydrated and consider chewing sugar-free gum after meals.",
  ];
  for (const t of [...smart, ...generic]) {
    if (tips.length >= 6) break;
    if (!tips.includes(t)) tips.push(t);
  }

  return { issues: issues.slice(0, 5), tips };
}

export interface RiskBadge {
  label: string;
  tone: "good" | "warn" | "bad";
  icon: string;
}

export function getBadges(answers: AssessmentAnswers): RiskBadge[] {
  const badges: RiskBadge[] = [];
  // Brushing habit
  if (answers[1] === "twice" && (answers[2] === "2min")) {
    badges.push({ label: "Good Brushing Habit", tone: "good", icon: "🪥" });
  } else if (answers[1] === "rarely" || answers[1] === "sometimes") {
    badges.push({ label: "Inconsistent Brushing", tone: "bad", icon: "🪥" });
  }
  // Flossing
  if (answers[3] === "daily") {
    badges.push({ label: "Floss Pro", tone: "good", icon: "🧵" });
  }
  // Sugar
  if (answers[6] === "daily" || answers[6] === "multi") {
    badges.push({ label: "High Sugar Intake", tone: "bad", icon: "🍬" });
  }
  // Gum sensitivity
  if (answers[4] === "sometimes" || answers[4] === "often") {
    badges.push({ label: "Gum Sensitivity", tone: "warn", icon: "🩸" });
  }
  // Tooth sensitivity
  if (answers[5] === "moderate" || answers[5] === "severe") {
    badges.push({ label: "Tooth Sensitivity", tone: "warn", icon: "❄️" });
  }
  // Tobacco
  if (answers[7] === "occasional" || answers[7] === "daily") {
    badges.push({ label: "Tobacco Use", tone: "bad", icon: "🚬" });
  }
  // Hydration
  if (answers[11] === "8") {
    badges.push({ label: "Well Hydrated", tone: "good", icon: "💧" });
  }
  // Recent checkup
  if (answers[8] === "6m") {
    badges.push({ label: "Up-to-date Checkup", tone: "good", icon: "🦷" });
  }
  return badges.slice(0, 6);
}
