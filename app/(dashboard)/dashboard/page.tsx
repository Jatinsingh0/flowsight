import { StatCard } from "@/components/cards/stat-card";
import { ActivityList } from "@/components/cards/activity-list";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { OrdersTable } from "@/components/tables/orders-table";
import { BusinessSummaryCard } from "@/components/ai/business-summary-card";
import {
  getDashboardStats,
  getRecentActivity,
  getRecentOrders,
  getBusinessMetrics,
} from "@/lib/dashboard";
import { formatCurrency } from "@/lib/format";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export default async function DashboardPage() {
  try {
    const [stats, recentOrders, recentActivity, businessMetrics] =
      await Promise.all([
        getDashboardStats(),
        getRecentOrders(),
        getRecentActivity(),
        getBusinessMetrics(),
      ]);

  return (
    <div className="relative space-y-8 pb-8">
      {/* Background gradient effects - matching homepage */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-accent2/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Header Section - Centered and Styled */}
      <div className="relative mx-auto max-w-4xl text-center space-y-4 pt-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
          <span>📊</span>
          <span>Real-time Analytics Dashboard</span>
        </div>

        {/* Main Title with Gradient */}
        <h1 className="text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl">
          Dashboard{" "}
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            Overview
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base text-textMuted md:text-lg max-w-2xl mx-auto leading-relaxed">
          Key metrics for your SaaS operations
        </p>
      </div>

      {/* Stat Cards Grid - Enhanced spacing */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="All-time completed orders"
          icon={DollarSign}
          iconColor="accent"
        />
        <StatCard
          title="Total users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="Including admins"
          icon={Users}
          iconColor="accent2"
        />
        <StatCard
          title="Active subscriptions"
          value={stats.activeSubscriptions.toLocaleString()}
          subtitle="Currently active plans"
          icon={CreditCard}
          iconColor="accent"
          insight={
            stats.insights.activeSubscriptionsChange !== 0
              ? {
                  text:
                    stats.insights.activeSubscriptionsChange > 0
                      ? `+${stats.insights.activeSubscriptionsChange} vs last month`
                      : `${stats.insights.activeSubscriptionsChange} vs last month`,
                  type:
                    stats.insights.activeSubscriptionsChange > 0
                      ? "positive"
                      : "negative",
                }
              : undefined
          }
        />
        <StatCard
          title="New orders today"
          value={stats.newOrdersToday.toString()}
          subtitle="Since midnight"
          icon={Activity}
          iconColor="accent2"
          insight={
            stats.insights.ordersTodayVsAvg !== 0
              ? {
                  text:
                    stats.insights.ordersTodayVsAvg > 0
                      ? `Above your 7-day average`
                      : `Below your 7-day average`,
                  type:
                    stats.insights.ordersTodayVsAvg > 0 ? "positive" : "negative",
                }
              : undefined
          }
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart
            data={stats.revenueByDay}
            totalRevenue={stats.totalRevenue}
          />
        </div>
        <div className="space-y-6">
          <ActivityList items={recentActivity} />
          {stats.insights.mostActiveDay && (
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm px-4 py-3 shadow-lg shadow-amber-500/5">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-sm font-medium text-amber-300">Weekly Insight</p>
                  <p className="text-xs text-amber-400/80 mt-1">
                    Most activity this week happened on {stats.insights.mostActiveDay}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders and Business Summary Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrdersTable orders={recentOrders} />
        </div>
        <div className="lg:col-span-1">
          <BusinessSummaryCard metrics={businessMetrics} />
        </div>
      </div>
    </div>
  );
  } catch (error: any) {
    const isConnectionError = 
      error?.message?.includes("timeout") || 
      error?.message?.includes("No available servers") ||
      error?.code === "P1001";

    if (isConnectionError) {
      return (
        <div className="space-y-6">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6">
            <h2 className="mb-2 text-xl font-semibold text-red-400">
              Database Connection Error
            </h2>
            <p className="mb-4 text-sm text-textMuted">
              Unable to connect to MongoDB Atlas. Please check the following:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-sm text-textMuted">
              <li>Verify your IP address is whitelisted in MongoDB Atlas Network Access</li>
              <li>Check that your DATABASE_URL in .env is correct</li>
              <li>Ensure your MongoDB Atlas cluster is running (not paused)</li>
              <li>Check your network/firewall settings</li>
            </ul>
            <p className="mt-4 text-xs text-textMuted">
              Error: {error?.message || "Connection timeout"}
            </p>
          </div>
        </div>
      );
    }

    // Re-throw other errors
    throw error;
  }
}

