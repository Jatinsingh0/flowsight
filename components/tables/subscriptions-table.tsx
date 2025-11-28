import { formatDate } from "@/lib/format";
import { SubscriptionStatus } from "@prisma/client";

interface SubscriptionRow {
  id: string;
  plan: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  user: {
    name: string | null;
    email: string;
  } | null;
}

interface SubscriptionsTableProps {
  subscriptions: SubscriptionRow[];
}

const statusStyles: Record<
  SubscriptionStatus,
  { label: string; className: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "text-emerald-300 bg-emerald-500/10 border border-emerald-500/30",
    dot: "bg-emerald-300",
  },
  CANCELLED: {
    label: "Canceled",
    className: "text-amber-300 bg-amber-500/10 border border-amber-500/30",
    dot: "bg-amber-300",
  },
  EXPIRED: {
    label: "Expired",
    className: "text-textMuted border border-borderSubtle/60 bg-card/30",
    dot: "bg-textMuted",
  },
};

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-4">
        <h3 className="text-base font-medium text-textBase">Subscriptions</h3>
        <p className="text-sm text-textMuted">
          Recurring revenue and retention signals
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-textMuted">
            <tr>
              <th className="py-3">Customer</th>
              <th className="py-3">Plan</th>
              <th className="py-3">Status</th>
              <th className="py-3">Started</th>
              <th className="py-3 text-right">Ends</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle/40 text-textBase">
            {subscriptions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-sm text-textMuted"
                >
                  No subscriptions found
                </td>
              </tr>
            ) : (
              subscriptions.map((subscription) => {
                const status = statusStyles[subscription.status];
                return (
                  <tr key={subscription.id} className="text-sm">
                    <td className="py-3">
                      <div className="font-medium text-textBase">
                        {subscription.user?.name ?? "Unknown customer"}
                      </div>
                      <div className="text-xs text-textMuted">
                        {subscription.user?.email ?? "N/A"}
                      </div>
                    </td>
                    <td className="py-3 text-textBase">{subscription.plan}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 text-textMuted">
                      {formatDate(subscription.startDate)}
                    </td>
                    <td className="py-3 text-right text-textMuted">
                      {subscription.endDate
                        ? formatDate(subscription.endDate)
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


