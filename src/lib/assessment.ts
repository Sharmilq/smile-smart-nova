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
  tips.push("Brush twice daily for 2 minutes with fluoride toothpaste.");
  tips.push("Floss at least once a day to remove plaque between teeth.");
  tips.push("Limit sugary snacks and drinks; rinse with water after.");
  tips.push("Visit your dentist every 6 months for a checkup and cleaning.");
  tips.push("Stay hydrated and consider chewing sugar-free gum after meals.");
  return { issues: issues.slice(0, 5), tips };
}
