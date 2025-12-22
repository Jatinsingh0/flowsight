import { getComparativeAnalytics } from "@/lib/compare";
import { CompareCard } from "@/components/cards/compare-card";
import { TrendingUp, Calendar } from "lucide-react";

export default async function ComparePage() {
  try {
    const analytics = await getComparativeAnalytics();

    return (
      <div className="relative space-y-8 pb-8">
        {/* Background gradient effects */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-96 w-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-accent2/5 rounded-full blur-3xl" />
        </div>

        {/* Page Header */}
        <div className="relative mx-auto max-w-4xl text-center space-y-4 pt-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <TrendingUp className="h-4 w-4" />
            <span>Comparative Analytics</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl">
            Comparative{" "}
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              Analytics
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base text-textMuted md:text-lg max-w-2xl mx-auto leading-relaxed">
            Week-over-week and month-over-month performance insights
          </p>
        </div>

        {/* Week Over Week Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-textBase">
                Week Over Week
              </h2>
              <p className="text-sm text-textMuted">
                This week vs last week comparison
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <CompareCard metric={analytics.weekOverWeek.users} />
            <CompareCard metric={analytics.weekOverWeek.orders} />
            <CompareCard
              metric={analytics.weekOverWeek.revenue}
              isRevenue={true}
            />
            <CompareCard metric={analytics.weekOverWeek.subscriptions} />
          </div>
        </div>

        {/* Month Over Month Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent2/10">
              <Calendar className="h-5 w-5 text-accent2" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-textBase">
                Month Over Month
              </h2>
              <p className="text-sm text-textMuted">
                This month vs last month comparison
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <CompareCard metric={analytics.monthOverMonth.users} />
            <CompareCard metric={analytics.monthOverMonth.orders} />
            <CompareCard
              metric={analytics.monthOverMonth.revenue}
              isRevenue={true}
            />
            <CompareCard metric={analytics.monthOverMonth.subscriptions} />
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
              <li>
                Verify your IP address is whitelisted in MongoDB Atlas Network
                Access
              </li>
              <li>Check that your DATABASE_URL in .env is correct</li>
              <li>
                Ensure your MongoDB Atlas cluster is running (not paused)
              </li>
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

