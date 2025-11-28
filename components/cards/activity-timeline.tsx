"use client";

import { formatDistanceToNow, format } from "date-fns";

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const ACTION_COLORS: Record<string, string> = {
  login: "bg-emerald-500",
  order: "bg-blue-500",
  subscription: "bg-purple-500",
  subscription_update: "bg-amber-500",
  billing: "bg-cyan-500",
};

const ACTION_ICONS: Record<string, string> = {
  login: "🔐",
  order: "💳",
  subscription: "📋",
  subscription_update: "🔄",
  billing: "💵",
};

function getActionColor(action: string): string {
  return ACTION_COLORS[action] || "bg-accent";
}

function getActionIcon(action: string): string {
  return ACTION_ICONS[action] || "•";
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, "dd MMM yyyy · HH:mm");
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent2/5">
        <p className="text-sm text-textMuted">No activity found for the selected filters</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent2/5">
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const color = getActionColor(activity.action);
          const icon = getActionIcon(activity.action);

          return (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${color} text-sm text-white shadow-sm`}
                >
                  {icon}
                </div>
                {index < activities.length - 1 && (
                  <div className="mt-2 h-full w-0.5 bg-borderSubtle" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-textBase">
                      <span className="font-semibold">
                        {activity.user.name || activity.user.email}
                      </span>{" "}
                      <span className="text-textMuted">{activity.description}</span>
                    </p>
                    <p className="mt-1 text-xs text-textMuted">
                      {formatTimestamp(activity.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

