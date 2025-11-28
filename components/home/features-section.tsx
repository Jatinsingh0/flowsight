import { BarChart3, Users, Activity, Sparkles } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Revenue & Sales Analytics",
    description:
      "Visualize payments, daily revenue, and order patterns with AI-powered explanations.",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: Users,
    title: "User & Subscription Tracking",
    description:
      "Monitor user growth, active plans, churn, upgrades, and retention trends.",
    gradient: "from-accent2/20 to-accent2/5",
    iconColor: "text-accent2",
  },
  {
    icon: Activity,
    title: "Activity Timeline",
    description:
      "A complete log of user behavior, purchases, and product events.",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: Sparkles,
    title: "AI Insights & Summaries",
    description:
      "Ask FlowSight to explain charts, trends, and business health in plain English.",
    gradient: "from-accent2/20 to-accent2/5",
    iconColor: "text-accent2",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-space-grotesk font-bold text-textBase md:text-4xl lg:text-5xl">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              Run Your SaaS
            </span>
          </h2>
          <p className="text-lg text-textMuted">
            A complete SaaS analytics dashboard and admin panel in one powerful platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-xl border border-borderSubtle bg-card p-6 shadow-sm transition-all hover:border-accent/30 hover:shadow-lg"
              >
                {/* Icon */}
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} border border-borderSubtle`}
                >
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-space-grotesk font-semibold text-textBase">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-textMuted">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

