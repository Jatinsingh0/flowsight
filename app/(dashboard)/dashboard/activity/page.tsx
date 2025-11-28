import { StatCard } from "@/components/cards/stat-card";
import { ActivityToolbar } from "@/components/forms/activity-toolbar";
import { ActivityTimeline } from "@/components/cards/activity-timeline";
import { getActivity, getActivityStats, getActivityTypes } from "@/lib/activity";
import { Clock, Calendar, CalendarDays, Activity as ActivityIcon } from "lucide-react";

type SearchParams = Record<string, string | string[] | undefined>;

interface ActivityPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ActivityPage({ searchParams }: ActivityPageProps) {
  const params = await searchParams;

  const typeParam =
    (Array.isArray(params.type) ? params.type[0] : params.type) ?? "ALL";
  const rangeParam = Number(
    Array.isArray(params.range) ? params.range[0] : params.range ?? "30"
  );
  const searchValue = Array.isArray(params.search)
    ? params.search[0] ?? ""
    : params.search ?? "";

  const safeRange =
    Number.isFinite(rangeParam) && rangeParam > 0 ? rangeParam : 30;

  const [stats, activities, activityTypes] = await Promise.all([
    getActivityStats(),
    getActivity({
      type: typeParam === "ALL" ? undefined : typeParam,
      days: safeRange,
      search: searchValue,
    }),
    getActivityTypes(),
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
          <span>📊</span>
          <span>Activity Feed</span>
        </div>
        <h1 className="text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            Activity
          </span>
        </h1>
        <p className="text-base text-textMuted md:text-lg max-w-2xl mx-auto leading-relaxed">
          Chronological feed of user and billing events in your product
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Last 24 hours"
          value={stats.count24h.toLocaleString()}
          subtitle="Recent events"
          icon={Clock}
          iconColor="accent"
        />
        <StatCard
          title="Last 7 days"
          value={stats.count7d.toLocaleString()}
          subtitle="Weekly activity"
          icon={Calendar}
          iconColor="accent2"
        />
        <StatCard
          title="Last 30 days"
          value={stats.count30d.toLocaleString()}
          subtitle="Monthly activity"
          icon={CalendarDays}
          iconColor="accent"
        />
        <StatCard
          title="Total events"
          value={stats.totalCount.toLocaleString()}
          subtitle="All-time activity"
          icon={ActivityIcon}
          iconColor="accent2"
        />
      </div>

      <ActivityToolbar
        initialType={typeParam}
        initialRange={safeRange}
        initialSearch={searchValue}
        activityTypes={activityTypes}
      />

      <ActivityTimeline activities={activities} />
    </div>
  );
}

