interface Props {
  scores: number[]; // chronological, oldest -> newest
  height?: number;
}

export function ScoreChart({ scores, height = 80 }: Props) {
  if (scores.length === 0) return null;
  const w = 280;
  const h = height;
  const pad = 6;
  const max = 100;
  const min = 0;
  const step = scores.length > 1 ? (w - pad * 2) / (scores.length - 1) : 0;
  const points = scores.map((s, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (s - min) / (max - min)) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${points[points.length - 1][0].toFixed(1)},${h - pad} L${points[0][0].toFixed(1)},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad} x2={w - pad} y1={pad + g * (h - pad * 2)} y2={pad + g * (h - pad * 2)} stroke="var(--border)" strokeDasharray="2 3" />
      ))}
      <path d={area} fill="url(#scoreFill)" />
      <path d={path} stroke="var(--primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill="var(--primary)" />
      ))}
    </svg>
  );
}
