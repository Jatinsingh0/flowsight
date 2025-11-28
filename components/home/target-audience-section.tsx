import { Check } from "lucide-react";

const targetPoints = [
  "Founders who want analytics without building it from scratch",
  "Developers needing a plug-and-play admin dashboard",
  "Startups needing internal dashboards for operations",
  "Teams connecting Stripe, Postgres, Mongo, or internal APIs",
];

export function TargetAudienceSection() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-space-grotesk font-bold text-textBase md:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              SaaS Founders
            </span>
            , Product Teams & Developers
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {targetPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-borderSubtle bg-card/50 p-4"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <p className="text-sm leading-relaxed text-textMuted md:text-base">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* SEO Keywords naturally integrated */}
          <div className="mt-12 text-center">
            <p className="text-sm text-textMuted leading-relaxed">
              FlowSight is the perfect{" "}
              <span className="text-textBase font-medium">
                SaaS analytics dashboard
              </span>{" "}
              and{" "}
              <span className="text-textBase font-medium">
                SaaS admin dashboard
              </span>{" "}
              for teams looking for{" "}
              <span className="text-textBase font-medium">
                subscription analytics
              </span>
              ,{" "}
              <span className="text-textBase font-medium">
                revenue analytics dashboard
              </span>
              , and{" "}
              <span className="text-textBase font-medium">
                SaaS metrics tool
              </span>
              . Whether you need a{" "}
              <span className="text-textBase font-medium">
                Stripe analytics alternative
              </span>{" "}
              or{" "}
              <span className="text-textBase font-medium">
                product usage analytics
              </span>
              , FlowSight provides{" "}
              <span className="text-textBase font-medium">
                subscription management dashboard
              </span>{" "}
              capabilities with{" "}
              <span className="text-textBase font-medium">
                user activity tracking
              </span>{" "}
              and{" "}
              <span className="text-textBase font-medium">
                AI analytics tool
              </span>{" "}
              features. Built with Next.js, it's the ideal{" "}
              <span className="text-textBase font-medium">
                admin dashboard template
              </span>{" "}
              for modern SaaS teams.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

