import { formatRelativeTime } from "@/lib/format";

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
  user: {
    name: string;
  } | null;
}

interface ActivityListProps {
  title?: string;
  items: ActivityItem[];
}

const actionLabels: Record<string, string> = {
  login: "Logged in",
  order: "Placed an order",
  subscription: "Started subscription",
  subscription_update: "Updated subscription",
  billing: "Updated billing",
  support: "Contacted support",
};

export function ActivityList({
  title = "Recent activity",
  items,
}: ActivityListProps) {
  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent2/5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-medium text-textBase">{title}</h3>
        <span className="text-xs uppercase tracking-wide text-textMuted">
          {items.length} updates
        </span>
      </div>
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-textMuted">No recent activity</p>
        ) : (
          items.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-borderSubtle/50 bg-card/40 p-3"
            >
              <div>
                <p className="text-sm font-medium text-textBase">
                  {activity.user?.name ?? "User"}{" "}
                  <span className="text-textMuted">
                    {actionLabels[activity.action] ?? activity.action}
                  </span>
                </p>
                <p className="text-xs text-textMuted">{activity.description}</p>
              </div>
              <span className="text-xs text-textMuted whitespace-nowrap">
                {formatRelativeTime(activity.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


