import { StatCard } from "@/components/cards/stat-card";
import { PlanBreakdown } from "@/components/cards/plan-breakdown";
import { SubscriptionsToolbar } from "@/components/forms/subscriptions-toolbar";
import { SubscriptionsTable } from "@/components/tables/subscriptions-table";
import {
  getPlanBreakdown,
  getSubscriptionStats,
  getSubscriptions,
} from "@/lib/subscriptions";
import { SubscriptionStatus } from "@prisma/client";
import { CreditCard, XCircle, Clock, Layers } from "lucide-react";

type SearchParams = Record<string, string | string[] | undefined>;

interface SubscriptionsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SubscriptionsPage({
  searchParams,
}: SubscriptionsPageProps) {
  const params = await searchParams;

  const statusParam =
    (params.status as SubscriptionStatus | "ALL" | undefined) ?? "ALL";
  const planParam =
    (Array.isArray(params.plan) ? params.plan[0] : params.plan) ?? "ALL";
  const rangeParam = Number(
    Array.isArray(params.range) ? params.range[0] : params.range ?? "60"
  );
  const searchValue = Array.isArray(params.search)
    ? params.search[0] ?? ""
    : params.search ?? "";

  const safeRange =
    Number.isFinite(rangeParam) && rangeParam > 0 ? rangeParam : 60;

  const [stats, subscriptions, planBreakdown] = await Promise.all([
    getSubscriptionStats(),
    getSubscriptions({
      status: statusParam as SubscriptionStatus | "ALL",
      plan: planParam,
      days: safeRange,
      search: searchValue,
    }),
    getPlanBreakdown(),
  ]);

  const planOptions = planBreakdown.map((plan) => plan.plan);

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
          <span>💳</span>
          <span>Subscription Management</span>
        </div>
        <h1 className="text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            Subscriptions
          </span>
        </h1>
        <p className="text-base text-textMuted md:text-lg max-w-2xl mx-auto leading-relaxed">
          Track recurring customers, plan performance, and churn
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active subscriptions"
          value={stats.activeCount.toLocaleString()}
          subtitle="Currently billed customers"
          icon={CreditCard}
          iconColor="accent"
        />
        <StatCard
          title="Canceled"
          value={stats.canceledCount.toLocaleString()}
          subtitle="All-time cancellations"
          icon={XCircle}
          iconColor="accent2"
        />
        <StatCard
          title="Expired"
          value={stats.expiredCount.toLocaleString()}
          subtitle="Ended plans"
          icon={Clock}
          iconColor="accent"
        />
        <StatCard
          title="Plans in use"
          value={stats.planCount.toLocaleString()}
          subtitle="Distinct pricing tiers"
          icon={Layers}
          iconColor="accent2"
        />
      </div>

      <SubscriptionsToolbar
        initialStatus={statusParam as SubscriptionStatus | "ALL"}
        initialPlan={planParam}
        initialRange={safeRange}
        initialSearch={searchValue}
        planOptions={planOptions}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubscriptionsTable subscriptions={subscriptions} />
        </div>
        <PlanBreakdown plans={planBreakdown} />
      </div>
    </div>
  );
}

