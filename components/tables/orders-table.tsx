import { formatCurrency, formatDate } from "@/lib/format";

interface OrderTableItem {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  } | null;
}

interface OrdersTableProps {
  orders: OrderTableItem[];
}

const statusStyles: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  COMPLETED: {
    label: "Paid",
    className: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  PENDING: {
    label: "Pending",
    className: "text-amber-300 bg-amber-500/10 border border-amber-500/30",
    dot: "bg-amber-300",
  },
  CANCELLED: {
    label: "Canceled",
    className: "text-red-300 bg-red-500/10 border border-red-500/30",
    dot: "bg-red-300",
  },
};

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <h3 className="mb-4 text-base font-medium text-textBase">Recent orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-textMuted">
            <tr>
              <th className="py-3">Customer</th>
              <th className="py-3">Email</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle/40 text-textBase">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-sm text-textMuted"
                >
                  No recent orders
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = statusStyles[order.status] ?? {
                  label: order.status,
                  className:
                    "text-textMuted border border-borderSubtle/60 bg-card/40",
                  dot: "bg-textMuted",
                };

                return (
                  <tr key={order.id} className="text-sm">
                    <td className="py-3">
                      {order.user?.name ?? "Unknown customer"}
                    </td>
                    <td className="py-3 text-textMuted">
                      {order.user?.email ?? "N/A"}
                    </td>
                    <td className="py-3">{formatCurrency(order.amount)}</td>
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
                    <td className="py-3 text-right text-textMuted">
                      {formatDate(order.createdAt)}
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


