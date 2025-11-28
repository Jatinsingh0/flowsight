import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "Step 1",
      title: "Export your data",
      description:
        "Export users, orders, and subscription data from Stripe, Paddle, Shopify, or your database as simple CSV files.",
    },
    {
      step: "Step 2",
      title: "Upload to FlowSight",
      description:
        "Go to the Data Import page, upload your CSV files, and let FlowSight validate and import everything into your private workspace.",
    },
    {
      step: "Step 3",
      title: "Get instant analytics",
      description:
        "Your dashboards update instantly with real revenue analytics, subscriptions, user metrics, and AI-powered insights — all in one admin dashboard.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <span>How it works</span>
          </div> */}
          <h2 className="mt-4 text-3xl font-space-grotesk font-bold text-textBase md:text-4xl">
            Bring your own data via CSV — no API setup required
          </h2>
          <p className="mt-4 text-lg text-textMuted leading-relaxed">
            Export your users, orders, and subscriptions from your existing tools as CSV files and
            upload them into FlowSight. In minutes, your own data powers a full SaaS analytics
            dashboard with real revenue, subscription, and user insights.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="text-sm font-semibold text-accent">{step.step}</div>
              <h3 className="mt-2 text-xl font-semibold text-textBase">{step.title}</h3>
              <p className="mt-3 text-sm text-textMuted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard/data-import"
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-soft transition-colors group"
          >
            <span>
              No API keys, no integration hassle — just upload CSVs and start analyzing your SaaS
              business.
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

