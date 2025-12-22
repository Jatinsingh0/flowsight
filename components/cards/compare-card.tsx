import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { ComparisonMetric } from "@/lib/compare";
import { formatCurrency } from "@/lib/format";

interface CompareCardProps {
  metric: ComparisonMetric;
  isRevenue?: boolean;
}

export function CompareCard({ metric, isRevenue = false }: CompareCardProps) {
  const { label, current, previous, changePercent, positive } = metric;

  // Format the value based on type
  const formatValue = (value: number) => {
    if (isRevenue) {
      return formatCurrency(value);
    }
    return value.toLocaleString();
  };

  // Determine color classes based on positive/negative change
  const changeColor = positive
    ? "text-emerald-400"
    : changePercent === 0
    ? "text-amber-400"
    : "text-rose-400";

  const changeBg = positive
    ? "bg-emerald-500/10 border-emerald-500/20"
    : changePercent === 0
    ? "bg-amber-500/10 border-amber-500/20"
    : "bg-rose-500/10 border-rose-500/20";

  // Get trend arrow icon
  const TrendIcon =
    changePercent > 0 ? ArrowUp : changePercent < 0 ? ArrowDown : Minus;

  // Format change percentage
  const formattedChange = changePercent > 0 ? `+${changePercent.toFixed(1)}%` : changePercent === 0 ? "0%" : `${changePercent.toFixed(1)}%`;

  return (
    <div className="group relative rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:border-accent/50 hover:bg-card/80 hover:shadow-lg hover:shadow-accent/10">
      {/* Label */}
      <p className="text-sm text-textMuted mb-3">{label}</p>

      {/* Current Value */}
      <p className="text-2xl font-semibold text-textBase mb-2">
        {formatValue(current)}
      </p>

      {/* Previous Period Value */}
      <p className="text-xs text-textMuted mb-3">
        Previous: {formatValue(previous)}
      </p>

      {/* Change Indicator */}
      <div
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium ${changeBg} ${changeColor}`}
      >
        <TrendIcon className="h-3 w-3" />
        <span>{formattedChange}</span>
      </div>
    </div>
  );
}

