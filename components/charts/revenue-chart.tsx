"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import { ChartInsight } from "@/components/ai/chart-insight";

interface RevenueChartProps {
  data: {
    date: string;
    amount: number;
  }[];
  totalRevenue?: number;
}

export function RevenueChart({ data, totalRevenue }: RevenueChartProps) {
  const calculatedTotal = data.reduce((sum, item) => sum + item.amount, 0);
  const displayTotal = totalRevenue ?? calculatedTotal;

  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-textBase">
            Revenue (last 30 days)
          </h3>
          <p className="text-sm text-textMuted">
            Daily revenue across paid orders
          </p>
        </div>
        <ChartInsight revenueData={data} totalRevenue={displayTotal} />
      </div>
      <div className="h-[260px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-textMuted">
            No revenue data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(value))
                }
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="rounded-md border border-borderSubtle bg-card/90 px-3 py-2 text-xs text-textBase shadow-lg">
                        <p className="font-medium">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(item.payload.date))}
                        </p>
                        <p className="text-textMuted">
                          {formatCurrency(item.payload.amount)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366F1"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}


