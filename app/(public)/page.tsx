import type { Metadata } from "next";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentUserProfile } from "@/lib/profile";
import { getDashboardStats } from "@/lib/dashboard";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DemoModeBanner } from "@/components/home/demo-mode-banner";
import { HeroSection } from "@/components/home/hero-section";
import { QuickLinks } from "@/components/home/quick-links";
import { FeaturesSection } from "@/components/home/features-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { TargetAudienceSection } from "@/components/home/target-audience-section";
import { DemoCTASection } from "@/components/home/demo-cta-section";
import { shouldShowDemoBanner } from "@/lib/workspace-banner";

export const metadata: Metadata = {
  title: "FlowSight - SaaS Analytics Dashboard & Admin Panel | AI-Powered Insights",
  description:
    "The all-in-one SaaS analytics dashboard and admin panel. Track revenue, users, subscriptions, and product performance with AI-powered insights. Perfect for SaaS founders, developers, and product teams.",
  keywords: [
    "SaaS analytics dashboard",
    "SaaS admin dashboard",
    "subscription analytics",
    "revenue analytics dashboard",
    "SaaS metrics tool",
    "Stripe analytics alternative",
    "product usage analytics",
    "subscription management dashboard",
    "user activity tracking",
    "business dashboard",
    "AI analytics tool",
    "SaaS reporting tool",
    "Next.js dashboard",
    "admin dashboard template",
    "open-source analytics dashboard",
  ].join(", "),
};

export default async function LandingPage() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  // Fetch user profile for name
  let userName: string | null = null;
  if (isLoggedIn) {
    const userProfile = await getCurrentUserProfile();
    userName = userProfile?.name || null;
  }

  // Fetch real stats if user is logged in
  let stats = undefined;
  if (isLoggedIn) {
    try {
      const dashboardStats = await getDashboardStats();
      stats = {
        totalRevenue: dashboardStats.totalRevenue,
        totalUsers: dashboardStats.totalUsers,
        activeSubscriptions: dashboardStats.activeSubscriptions,
        newOrdersToday: dashboardStats.newOrdersToday,
        insights: {
          activeSubscriptionsChange: dashboardStats.insights.activeSubscriptionsChange,
          usersChangePercent: dashboardStats.insights.usersChangePercent,
          ordersTodayVsAvg: dashboardStats.insights.ordersTodayVsAvg,
        },
      };
    } catch (error) {
      // If database fails, stats will be undefined and hero will use placeholder data
      console.error("Failed to fetch dashboard stats:", error);
    }
  }

  const showBanner = isLoggedIn && (await shouldShowDemoBanner());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {showBanner && <DemoModeBanner />}
      <main>
        <HeroSection isLoggedIn={isLoggedIn} userName={userName} stats={stats} />
        {isLoggedIn && <QuickLinks />}
        <FeaturesSection />
        <HowItWorksSection />
        <TargetAudienceSection />
        {!isLoggedIn && <DemoCTASection />}
      </main>
      <Footer />
    </div>
  );
}

