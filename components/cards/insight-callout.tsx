import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

interface InsightCalloutProps {
  text: string;
  type: "positive" | "negative" | "neutral";
}

export function InsightCallout({ text, type }: InsightCalloutProps) {
  const colors = {
    positive: "text-emerald-400",
    negative: "text-rose-400",
    neutral: "text-amber-400",
  };

  const bgColors = {
    positive: "bg-emerald-500/10 border-emerald-500/20",
    negative: "bg-rose-500/10 border-rose-500/20",
    neutral: "bg-amber-500/10 border-amber-500/20",
  };

  const Icon =
    type === "positive" ? ArrowUp : type === "negative" ? ArrowDown : TrendingUp;

  return (
    <div
      className={`mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ${bgColors[type]} ${colors[type]}`}
    >
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </div>
  );
}

