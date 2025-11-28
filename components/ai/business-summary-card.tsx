"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, TrendingUp, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessMetrics {
  totalRevenue: number;
  revenueLast30Days: number;
  totalUsers: number;
  newUsersThisMonth: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  totalOrders: number;
  paidOrders: number;
  activityLast7Days: number;
}

interface BusinessSummaryCardProps {
  metrics: BusinessMetrics;
}

interface SummaryData {
  summary: string;
  trends: string[];
  suggestions: string[];
}

export function BusinessSummaryCard({ metrics }: BusinessSummaryCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);

    // Minimum loading time of 4-5 seconds for realistic AI feel
    const minLoadingTime = 4000 + Math.random() * 1000; // 4-5 seconds
    const startTime = Date.now();

    try {
      const response = await fetch("/api/ai/business-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metrics),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      
      // Ensure minimum loading time has passed
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      setSummaryData(data);
      setHasGenerated(true);
    } catch (err) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      setError("Unable to generate summary. Please try again.");
      console.error("Business summary error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate on mount
  useEffect(() => {
    if (!hasGenerated) {
      generateSummary();
    }
  }, []);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-borderSubtle shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <div className="absolute inset-0 h-5 w-5 animate-pulse rounded-full bg-purple-500/20"></div>
            </div>
            <CardTitle className="text-base font-medium text-textBase">
              AI Business Summary
            </CardTitle>
          </div>
          {!isLoading && summaryData && (
            <button
              onClick={generateSummary}
              className="group inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-2.5 py-1 text-xs font-medium text-purple-400 border border-purple-500/30 hover:from-purple-600/30 hover:to-indigo-600/30 hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300"
            >
              <Sparkles className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
              Refresh
            </button>
          )}
        </div>
        <p className="text-xs text-textMuted">Based on last 30 days of data</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="relative">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
              <div className="absolute inset-0 h-6 w-6 animate-ping rounded-full border-2 border-purple-500 opacity-20"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-textBase">Analyzing business metrics...</span>
              <span className="text-xs text-textMuted">AI is processing your data</span>
            </div>
          </div>
        ) : error ? (
          <div className="py-4">
            <p className="mb-3 text-sm text-red-400">{error}</p>
            <button
              onClick={generateSummary}
              className="text-xs text-accent hover:text-accent-soft underline"
            >
              Try again
            </button>
          </div>
        ) : summaryData ? (
          <>
            <div>
              <p className="text-sm leading-relaxed text-textMuted">
                {summaryData.summary}
              </p>
            </div>

            {summaryData.trends.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <h5 className="text-xs font-semibold uppercase tracking-wide text-textMuted">
                    Key Trends
                  </h5>
                </div>
                <ul className="space-y-1.5">
                  {summaryData.trends.map((trend, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-textMuted"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summaryData.suggestions.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <h5 className="text-xs font-semibold uppercase tracking-wide text-textMuted">
                    Suggestions
                  </h5>
                </div>
                <ul className="space-y-1.5">
                  {summaryData.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-textMuted"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

