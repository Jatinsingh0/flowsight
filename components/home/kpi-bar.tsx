import { getDashboardStats } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/format";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export async function KPIBar() {
  let stats;
  try {
    stats = await getDashboardStats();
  } catch (error) {
    // Fallback to default values if database connection fails
    stats = {
      totalRevenue: 0,
      totalUsers: 0,
      activeSubscriptions: 0,
      newOrdersToday: 0,
    };
  }

  const kpis = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      icon: Users,
      label: "Active Users",
      value: stats.totalUsers.toLocaleString(),
      color: "text-accent2",
      bgColor: "bg-accent2/10",
      borderColor: "border-accent2/20",
    },
    {
      icon: CreditCard,
      label: "Active Subscriptions",
      value: stats.activeSubscriptions.toLocaleString(),
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      icon: Activity,
      label: "New Orders Today",
      value: stats.newOrdersToday.toLocaleString(),
      color: "text-accent2",
      bgColor: "bg-accent2/10",
      borderColor: "border-accent2/20",
    },
  ];

  return (
    <section className="border-b border-borderSubtle bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-lg font-space-grotesk font-semibold text-textBase">
            Quick Snapshot
          </h2>
          <p className="text-sm text-textMuted">
            Here's a quick snapshot of your product
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="group rounded-lg border border-borderSubtle bg-card p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border ${kpi.borderColor} ${kpi.bgColor}`}
                  >
                    <Icon className={`h-4 w-4 ${kpi.color} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  <p className="text-xs text-textMuted">{kpi.label}</p>
                </div>
                <p className={`text-2xl font-semibold ${kpi.color} transition-colors duration-300 group-hover:scale-105`}>
                  {kpi.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

