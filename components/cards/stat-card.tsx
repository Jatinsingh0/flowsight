import { InsightCallout } from "./insight-callout";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: "accent" | "accent2";
  insight?: {
    text: string;
    type: "positive" | "negative" | "neutral";
  };
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  iconColor = "accent",
  insight 
}: StatCardProps) {
  const colorClasses = {
    accent: {
      icon: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
      hoverBorder: "hover:border-accent/50",
      hoverShadow: "hover:shadow-accent/10",
      hoverText: "group-hover:text-accent",
    },
    accent2: {
      icon: "text-accent2",
      bg: "bg-accent2/10",
      border: "border-accent2/20",
      hoverBorder: "hover:border-accent2/50",
      hoverShadow: "hover:shadow-accent2/10",
      hoverText: "group-hover:text-accent2",
    },
  };

  const colors = colorClasses[iconColor];

  return (
    <div className={`group relative rounded-xl border ${colors.border} bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 ${colors.hoverBorder} hover:bg-card/80 hover:shadow-lg ${colors.hoverShadow} cursor-pointer`}>
      {/* Icon */}
      {Icon && (
        <div className="mb-3 flex items-center gap-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.bg} transition-all duration-300 group-hover:scale-110`}>
            <Icon className={`h-4 w-4 ${colors.icon} transition-transform duration-300 group-hover:scale-110`} />
          </div>
          <p className="text-sm text-textMuted">{title}</p>
        </div>
      )}
      
      {/* Title (if no icon) */}
      {!Icon && (
        <p className="text-sm text-textMuted">{title}</p>
      )}

      {/* Value */}
      <p className={`mt-2 text-2xl font-semibold text-textBase transition-colors duration-300 ${colors.hoverText}`}>
        {value}
      </p>

      {/* Subtitle */}
      {subtitle ? (
        <p className="mt-1 text-xs text-textMuted">{subtitle}</p>
      ) : null}

      {/* Insight */}
      {insight ? (
        <div className="mt-3">
          <InsightCallout text={insight.text} type={insight.type} />
        </div>
      ) : null}
    </div>
  );
}


