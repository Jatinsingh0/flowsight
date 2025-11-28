"use client";

import { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ChartInsightProps {
  revenueData: { date: string; amount: number }[];
  totalRevenue: number;
}

export function ChartInsight({ revenueData, totalRevenue }: ChartInsightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    setIsLoading(true);
    setError(null);
    setIsOpen(true);

    // Minimum loading time of 4-5 seconds for realistic AI feel
    const minLoadingTime = 4000 + Math.random() * 1000; // 4-5 seconds
    const startTime = Date.now();

    try {
      const response = await fetch("/api/ai/explain-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          revenueData,
          totalRevenue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate explanation");
      }

      const data = await response.json();
      
      // Ensure minimum loading time has passed
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      setExplanation(data.explanation);
    } catch (err) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      setError("Unable to generate explanation. Please try again.");
      console.error("Chart insight error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleExplain}
        className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 transition-all duration-300"
      >
        <Sparkles className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
        Ask AI
      </button>
    );
  }

  return (
    <Card className="mt-4 border-borderSubtle bg-card/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <div className="absolute inset-0 h-4 w-4 animate-pulse rounded-full bg-purple-500/20"></div>
              </div>
              <h4 className="text-sm font-semibold text-textBase">AI Insight</h4>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-3 text-sm">
                <div className="relative">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                  <div className="absolute inset-0 h-5 w-5 animate-ping rounded-full border-2 border-purple-500 opacity-20"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-textBase font-medium">Analyzing revenue trends...</span>
                  <span className="text-xs text-textMuted">AI is processing your data</span>
                </div>
              </div>
            ) : error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : explanation ? (
              <p className="text-sm leading-relaxed text-textMuted">{explanation}</p>
            ) : null}
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setExplanation(null);
              setError(null);
            }}
            className="text-textMuted hover:text-textBase transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

