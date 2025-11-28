import { formatCurrency, formatDate } from "@/lib/format";
import { OrderStatus } from "@prisma/client";

interface OrderTableRow {
  id: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  } | null;
}

interface OrdersDetailedTableProps {
  title?: string;
  subtitle?: string;
  orders: OrderTableRow[];
}

const statusStyles: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  COMPLETED: {
    label: "Paid",
    className: "text-emerald-300 bg-emerald-500/10 border border-emerald-500/30",
    dot: "bg-emerald-300",
  },
  PENDING: {
    label: "Pending",
    className: "text-amber-300 bg-amber-500/10 border border-amber-500/30",
    dot: "bg-amber-300",
  },
  CANCELLED: {
    label: "Canceled",
    className: "text-rose-300 bg-rose-500/10 border border-rose-500/30",
    dot: "bg-rose-300",
  },
};

export function OrdersDetailedTable({
  title = "Orders",
  subtitle = "Latest payment activity",
  orders,
}: OrdersDetailedTableProps) {
  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-base font-medium text-textBase">{title}</h3>
        <p className="text-sm text-textMuted">{subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-textMuted">
            <tr>
              <th className="py-3">Customer</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle/40 text-textBase">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-sm text-textMuted"
                >
                  No orders found
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
                      <div className="font-medium text-textBase">
                        {order.user?.name ?? "Unknown customer"}
                      </div>
                      <div className="text-xs text-textMuted">
                        {order.user?.email ?? "N/A"}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium">
                        {formatCurrency(order.amount)}
                      </div>
                      <div className="text-xs text-textMuted">USD</div>
                    </td>
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


