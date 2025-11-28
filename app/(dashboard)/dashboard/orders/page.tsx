import { StatCard } from "@/components/cards/stat-card";
import { OrdersToolbar } from "@/components/forms/orders-toolbar";
import { OrdersDetailedTable } from "@/components/tables/orders-detailed-table";
import { getOrderStats, getOrders } from "@/lib/orders";
import { formatCurrency } from "@/lib/format";
import { OrderStatus } from "@prisma/client";
import { ShoppingCart, CheckCircle, XCircle, DollarSign } from "lucide-react";

type SearchParams = Record<string, string | string[] | undefined>;

interface OrdersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const statusParam =
    (params.status as OrderStatus | "ALL" | undefined) ?? "ALL";
  const rangeParam = Number(
    Array.isArray(params.range) ? params.range[0] : params.range ?? "30"
  );
  const searchValue = Array.isArray(params.search)
    ? params.search[0] ?? ""
    : params.search ?? "";

  const safeRange = Number.isFinite(rangeParam) && rangeParam > 0 ? rangeParam : 30;

  const [stats, orders] = await Promise.all([
    getOrderStats(),
    getOrders({
      status: statusParam as OrderStatus | "ALL",
      days: safeRange,
      search: searchValue,
    }),
  ]);

  return (
    <div className="relative space-y-8 pb-8">
      {/* Background gradient effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-accent2/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Header Section */}
      <div className="relative mx-auto max-w-4xl text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
          <span>🛒</span>
          <span>Order Management</span>
        </div>
        <h1 className="text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            Orders
          </span>
        </h1>
        <p className="text-base text-textMuted md:text-lg max-w-2xl mx-auto leading-relaxed">
          Track purchases, billing events, and payment health
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total orders"
          value={stats.totalOrders.toLocaleString()}
          subtitle="All-time transactions"
          icon={ShoppingCart}
          iconColor="accent"
        />
        <StatCard
          title="Paid orders"
          value={stats.paidOrders.toLocaleString()}
          subtitle="Completed payments"
          icon={CheckCircle}
          iconColor="accent2"
        />
        <StatCard
          title="Refunded orders"
          value={stats.refundedOrders.toLocaleString()}
          subtitle="Canceled or refunded"
          icon={XCircle}
          iconColor="accent"
        />
        <StatCard
          title="Revenue this month"
          value={formatCurrency(stats.revenueThisMonth)}
          subtitle="Completed orders only"
          icon={DollarSign}
          iconColor="accent2"
        />
      </div>

      <OrdersToolbar
        initialStatus={statusParam as OrderStatus | "ALL"}
        initialRange={safeRange}
        initialSearch={searchValue}
      />

      <OrdersDetailedTable
        title="Recent orders"
        subtitle="Latest transactions and billing updates"
        orders={orders}
      />
    </div>
  );
}

