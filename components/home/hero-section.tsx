"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, DollarSign, Users, CreditCard, Activity } from "lucide-react";

interface HeroSectionProps {
  isLoggedIn?: boolean;
  userName?: string | null;
  stats?: {
    totalRevenue: number;
    totalUsers: number;
    activeSubscriptions: number;
    newOrdersToday: number;
    insights?: {
      activeSubscriptionsChange?: number;
      usersChangePercent?: number;
      ordersTodayVsAvg?: number;
    };
  };
}

export function HeroSection({ isLoggedIn = false, userName, stats }: HeroSectionProps) {
  const [chartAnimated, setChartAnimated] = useState(false);

  useEffect(() => {
    // Animate chart on mount
    const timer = setTimeout(() => setChartAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Use real stats if logged in, otherwise use demo data
  const displayStats = isLoggedIn && stats ? stats : {
    totalRevenue: 124580,
    totalUsers: 2847,
    activeSubscriptions: 1234,
    newOrdersToday: 342,
    insights: {
      activeSubscriptionsChange: 12.5,
      usersChangePercent: 8.2,
      ordersTodayVsAvg: 14.4,
    },
  };
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-32">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent2/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent2/10 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge - Only show for non-logged-in users */}
          {!isLoggedIn && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
              <TrendingUp className="h-4 w-4" />
              <span>AI-Powered SaaS Analytics Dashboard</span>
            </div>
          )}

          {/* Main Title - Personalized for logged-in users */}
          <h1 className="mb-6 text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl xl:text-7xl">
            {isLoggedIn ? (
              <>
                Welcome back{userName ? `, ${userName.split(" ")[0]}` : " to FlowSight"}
                <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                  !
                </span>
              </>
            ) : (
              <>
                The All-In-One{" "}
                <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                  SaaS Analytics
                </span>{" "}
                & Admin Dashboard
              </>
            )}
          </h1>

          {/* Subtitle - Personalized for logged-in users */}
          <p className="mb-10 text-base text-textMuted md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            {isLoggedIn ? (
              "Review your latest revenue, users, subscriptions and activity in one place."
            ) : (
              <>
                Track revenue, users, subscriptions, activity, and product performance — all in one intelligent dashboard powered by{" "}
                <span className="text-accent font-medium">AI insights</span>.
              </>
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent-soft text-white px-8 py-6 text-base font-medium group"
                  >
                    Open Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/dashboard/activity">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-borderSubtle bg-card/50 hover:bg-card text-textBase px-8 py-6 text-base font-medium group"
                  >
                    View Activity Log
                    <Activity className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <a href="#demo">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent-soft text-white px-8 py-6 text-base font-medium group"
                  >
                    Try Demo Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-borderSubtle bg-card/50 hover:bg-card text-textBase px-8 py-6 text-base font-medium"
                  >
                    View Features
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Personalized Greeting - Only for logged-in users - Outside the box */}
          {isLoggedIn && userName && (
            <div className="mb-6 mx-auto max-w-6xl px-4">
              <div className="rounded-lg border border-borderSubtle/50 bg-card/30 backdrop-blur-sm px-6 py-4">
                <p className="text-base font-medium text-textBase">
                  Hey <span className="text-accent font-semibold">{userName.split(" ")[0]}</span>, here's a quick snapshot of your product
                </p>
              </div>
            </div>
          )}

          {/* Hero Dashboard Mockup - BIG and VISUAL */}
          <div className="relative mx-auto max-w-6xl">
            <div className="relative rounded-2xl border border-borderSubtle bg-card/50 p-3 shadow-2xl backdrop-blur-sm">
              {/* Dashboard Preview Frame */}
              <div className="relative overflow-hidden rounded-xl bg-background">
                {/* Mock Dashboard Content - Realistic Layout */}
                <div className="aspect-[16/10] bg-gradient-to-br from-card via-card/80 to-card p-6 md:p-8">
                  {/* Top Stats Row - Using Real Data */}
                  <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {/* Stat Card 1 - Revenue */}
                    <div className="group cursor-pointer rounded-lg border border-borderSubtle bg-card p-4 transition-all duration-300 hover:border-accent/50 hover:bg-card/80 hover:shadow-lg hover:shadow-accent/10">
                      <div className="mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-accent transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-xs text-textMuted">Total Revenue</p>
                      </div>
                      <p className="text-xl font-semibold text-textBase transition-colors duration-300 group-hover:text-accent">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(displayStats.totalRevenue)}
                      </p>
                      {displayStats.insights?.activeSubscriptionsChange !== undefined && (
                        <p className={`mt-1 text-xs ${
                          displayStats.insights.activeSubscriptionsChange > 0 
                            ? "text-green-400" 
                            : displayStats.insights.activeSubscriptionsChange < 0 
                            ? "text-red-400" 
                            : "text-accent2"
                        }`}>
                          {displayStats.insights.activeSubscriptionsChange > 0 ? "+" : ""}
                          {displayStats.insights.activeSubscriptionsChange.toFixed(1)}% vs last month
                        </p>
                      )}
                    </div>

                    {/* Stat Card 2 - Users */}
                    <div className="group cursor-pointer rounded-lg border border-borderSubtle bg-card p-4 transition-all duration-300 hover:border-accent2/50 hover:bg-card/80 hover:shadow-lg hover:shadow-accent2/10">
                      <div className="mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-accent2 transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-xs text-textMuted">Total Users</p>
                      </div>
                      <p className="text-xl font-semibold text-textBase transition-colors duration-300 group-hover:text-accent2">
                        {displayStats.totalUsers.toLocaleString()}
                      </p>
                      {displayStats.insights?.usersChangePercent !== undefined && (
                        <p className={`mt-1 text-xs ${
                          displayStats.insights.usersChangePercent > 0 
                            ? "text-green-400" 
                            : displayStats.insights.usersChangePercent < 0 
                            ? "text-red-400" 
                            : "text-accent2"
                        }`}>
                          {displayStats.insights.usersChangePercent > 0 ? "+" : ""}
                          {displayStats.insights.usersChangePercent.toFixed(1)}% vs last month
                        </p>
                      )}
                    </div>

                    {/* Stat Card 3 - Subscriptions */}
                    <div className="group cursor-pointer rounded-lg border border-borderSubtle bg-card p-4 transition-all duration-300 hover:border-accent/50 hover:bg-card/80 hover:shadow-lg hover:shadow-accent/10">
                      <div className="mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-accent transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-xs text-textMuted">Active Plans</p>
                      </div>
                      <p className="text-xl font-semibold text-textBase transition-colors duration-300 group-hover:text-accent">
                        {displayStats.activeSubscriptions.toLocaleString()}
                      </p>
                      {displayStats.insights?.activeSubscriptionsChange !== undefined && (
                        <p className={`mt-1 text-xs ${
                          displayStats.insights.activeSubscriptionsChange > 0 
                            ? "text-green-400" 
                            : displayStats.insights.activeSubscriptionsChange < 0 
                            ? "text-red-400" 
                            : "text-accent2"
                        }`}>
                          {displayStats.insights.activeSubscriptionsChange > 0 ? "+" : ""}
                          {displayStats.insights.activeSubscriptionsChange.toFixed(1)}% vs last month
                        </p>
                      )}
                    </div>

                    {/* Stat Card 4 - Orders */}
                    <div className="group cursor-pointer rounded-lg border border-borderSubtle bg-card p-4 transition-all duration-300 hover:border-accent2/50 hover:bg-card/80 hover:shadow-lg hover:shadow-accent2/10">
                      <div className="mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-accent2 transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-xs text-textMuted">New Orders</p>
                      </div>
                      <p className="text-xl font-semibold text-textBase transition-colors duration-300 group-hover:text-accent2">
                        {displayStats.newOrdersToday.toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-accent2">Today</p>
                    </div>
                  </div>

                  {/* Main Chart Area */}
                  <div className="group mb-4 rounded-lg border border-borderSubtle bg-card p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-textBase">Revenue (Last 30 Days)</h3>
                        <p className="text-xs text-textMuted">Daily revenue across paid orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-textMuted">Total</p>
                        <p className="text-sm font-semibold text-textBase">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(displayStats.totalRevenue)}
                        </p>
                      </div>
                    </div>
                    <div className="h-56 w-full rounded">
                      {/* Professional Chart with Labels */}
                      <svg className="h-full w-full" viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
                        {/* Y-axis labels */}
                        <text x="10" y="50" fill="#9CA3AF" fontSize="10" fontFamily="Inter, sans-serif">$8k</text>
                        <text x="10" y="90" fill="#9CA3AF" fontSize="10" fontFamily="Inter, sans-serif">$6k</text>
                        <text x="10" y="130" fill="#9CA3AF" fontSize="10" fontFamily="Inter, sans-serif">$4k</text>
                        <text x="10" y="170" fill="#9CA3AF" fontSize="10" fontFamily="Inter, sans-serif">$2k</text>
                        <text x="10" y="210" fill="#9CA3AF" fontSize="10" fontFamily="Inter, sans-serif">$0</text>
                        
                        {/* Grid lines */}
                        <line x1="40" y1="50" x2="480" y2="50" stroke="#1F2933" strokeWidth="1" opacity="0.2" />
                        <line x1="40" y1="90" x2="480" y2="90" stroke="#1F2933" strokeWidth="1" opacity="0.2" />
                        <line x1="40" y1="130" x2="480" y2="130" stroke="#1F2933" strokeWidth="1" opacity="0.2" />
                        <line x1="40" y1="170" x2="480" y2="170" stroke="#1F2933" strokeWidth="1" opacity="0.2" />
                        <line x1="40" y1="210" x2="480" y2="210" stroke="#1F2933" strokeWidth="1" opacity="0.2" />
                        
                        {/* X-axis labels */}
                        <text x="80" y="235" fill="#9CA3AF" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="middle">Mon</text>
                        <text x="160" y="235" fill="#9CA3AF" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="middle">Wed</text>
                        <text x="240" y="235" fill="#9CA3AF" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="middle">Fri</text>
                        <text x="320" y="235" fill="#9CA3AF" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="middle">Sun</text>
                        <text x="400" y="235" fill="#9CA3AF" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="middle">Tue</text>
                        
                        {/* Chart area gradient fill - smoother curve */}
                        <path
                          d="M 40 200 L 60 195 L 80 185 L 100 175 L 120 165 L 140 155 L 160 145 L 180 135 L 200 125 L 220 115 L 240 105 L 260 95 L 280 85 L 300 80 L 320 75 L 340 70 L 360 65 L 380 60 L 400 55 L 420 50 L 440 48 L 460 45 L 480 42 L 480 220 L 40 220 Z"
                          fill="url(#chartGradient)"
                          opacity={chartAnimated ? "0.4" : "0"}
                          className="transition-opacity duration-1000"
                        />
                        
                        {/* Chart line with smoother curve - more data points */}
                        <path
                          d="M 40 200 L 60 195 L 80 185 L 100 175 L 120 165 L 140 155 L 160 145 L 180 135 L 200 125 L 220 115 L 240 105 L 260 95 L 280 85 L 300 80 L 320 75 L 340 70 L 360 65 L 380 60 L 400 55 L 420 50 L 440 48 L 460 45 L 480 42"
                          stroke="#6366F1"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={chartAnimated ? "0" : "2000"}
                          strokeDashoffset={chartAnimated ? "0" : "2000"}
                          className="transition-all duration-2000 ease-out"
                        />
                        
                        {/* Data points with animation - more points */}
                        {[
                          { x: 80, y: 185, delay: 600 },
                          { x: 160, y: 145, delay: 800 },
                          { x: 240, y: 105, delay: 1000 },
                          { x: 320, y: 75, delay: 1200 },
                          { x: 400, y: 55, delay: 1400 },
                          { x: 480, y: 42, delay: 1600 },
                        ].map((point, i) => (
                          <circle
                            key={i}
                            cx={point.x}
                            cy={point.y}
                            r={chartAnimated ? "5" : "0"}
                            fill="#6366F1"
                            stroke="#0B1120"
                            strokeWidth="2"
                            className="transition-all duration-300"
                            style={{ transitionDelay: `${point.delay}ms` }}
                          />
                        ))}
                        
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Bottom Table/List */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Recent Orders */}
                    <div className="rounded-lg border border-borderSubtle bg-card p-4">
                      <h3 className="mb-3 text-sm font-semibold text-textBase">Recent Orders</h3>
                      <div className="space-y-3">
                        {[
                          { name: "Sarah Johnson", amount: "$2,450", status: "Completed" },
                          { name: "Michael Chen", amount: "$1,890", status: "Completed" },
                          { name: "Emily Davis", amount: "$3,200", status: "Pending" },
                        ].map((order, i) => (
                          <div 
                            key={i} 
                            className="group flex cursor-pointer items-center justify-between rounded-md p-2 transition-all duration-200 hover:bg-accent/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 transition-all duration-200 group-hover:bg-accent/30 group-hover:scale-110">
                                <span className="text-xs font-semibold text-accent">
                                  {order.name.split(" ").map(n => n[0]).join("")}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-textBase transition-colors duration-200 group-hover:text-accent">{order.name}</p>
                                <p className="text-xs text-textMuted">{order.status}</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-textBase transition-colors duration-200 group-hover:text-accent">{order.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="rounded-lg border border-borderSubtle bg-card p-4">
                      <h3 className="mb-3 text-sm font-semibold text-textBase">Recent Activity</h3>
                      <div className="space-y-3">
                        {[
                          { action: "New subscription", user: "Alex Morgan", time: "2m ago" },
                          { action: "Order completed", user: "David Lee", time: "15m ago" },
                          { action: "User registered", user: "Jessica Brown", time: "1h ago" },
                        ].map((activity, i) => (
                          <div 
                            key={i} 
                            className="group flex cursor-pointer items-start gap-3 rounded-md p-2 transition-all duration-200 hover:bg-accent2/5"
                          >
                            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent2/20 transition-all duration-200 group-hover:bg-accent2/30 group-hover:scale-110">
                              <div className="h-2 w-2 rounded-full bg-accent2 transition-all duration-200 group-hover:scale-125" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-textBase transition-colors duration-200 group-hover:text-accent2">{activity.action}</p>
                              <p className="text-xs text-textMuted">
                                {activity.user} • {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-accent2/20 to-accent/20 rounded-3xl blur-2xl -z-10 opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
}

