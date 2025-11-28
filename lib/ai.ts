/**
 * AI Helper Functions
 * 
 * Supports both real OpenAI API and mock responses for development.
 * Set OPENAI_API_KEY in .env to use real API, otherwise uses mock data.
 */

interface ChartData {
  date: string;
  amount: number;
}

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

/**
 * Generate AI explanation for revenue chart
 */
export async function explainChart(
  revenueData: ChartData[],
  totalRevenue: number
): Promise<string> {
  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Return mock response for development
    return generateMockChartExplanation(revenueData, totalRevenue);
  }

  try {
    // Calculate some basic stats for context
    const amounts = revenueData.map((d) => d.amount);
    const avgDaily = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const maxDay = Math.max(...amounts);
    const minDay = Math.min(...amounts);
    const recentTrend = amounts.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const earlierTrend = amounts.slice(0, 7).reduce((a, b) => a + b, 0) / 7;

    const prompt = `You are a SaaS analytics assistant. Analyze this 30-day revenue data and provide a concise explanation (2-3 sentences) in plain language.

Key metrics:
- Total revenue (30 days): $${totalRevenue.toFixed(2)}
- Average daily revenue: $${avgDaily.toFixed(2)}
- Highest day: $${maxDay.toFixed(2)}
- Lowest day: $${minDay.toFixed(2)}
- Recent 7-day average: $${recentTrend.toFixed(2)}
- Earlier 7-day average: $${earlierTrend.toFixed(2)}

Explain the trend, highlight any significant spikes or drops, and provide a brief insight.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful SaaS analytics assistant. Provide clear, concise explanations of business metrics.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Unable to generate explanation.";
  } catch (error) {
    console.error("AI API error, falling back to mock:", error);
    return generateMockChartExplanation(revenueData, totalRevenue);
  }
}

/**
 * Generate AI business summary
 */
export async function generateBusinessSummary(
  metrics: BusinessMetrics
): Promise<{
  summary: string;
  trends: string[];
  suggestions: string[];
}> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return generateMockBusinessSummary(metrics);
  }

  try {
    const prompt = `You are a SaaS analytics assistant. Analyze this business data and provide:
1. A short summary (2-3 sentences) of overall business health
2. 2-3 key trends (bullet points)
3. 2-3 actionable suggestions for improvement (bullet points)

Business Metrics:
- Total Revenue (all-time): $${metrics.totalRevenue.toFixed(2)}
- Revenue (last 30 days): $${metrics.revenueLast30Days.toFixed(2)}
- Total Users: ${metrics.totalUsers}
- New Users (this month): ${metrics.newUsersThisMonth}
- Active Subscriptions: ${metrics.activeSubscriptions}
- Canceled Subscriptions: ${metrics.canceledSubscriptions}
- Total Orders: ${metrics.totalOrders}
- Paid Orders: ${metrics.paidOrders}
- Activity Events (last 7 days): ${metrics.activityLast7Days}

Format your response as JSON:
{
  "summary": "string",
  "trends": ["trend1", "trend2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful SaaS analytics assistant. Provide actionable business insights. Always respond with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 400,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    const parsed = JSON.parse(content);

    return {
      summary: parsed.summary || "Business is performing well.",
      trends: parsed.trends || [],
      suggestions: parsed.suggestions || [],
    };
  } catch (error) {
    console.error("AI API error, falling back to mock:", error);
    return generateMockBusinessSummary(metrics);
  }
}

// Mock functions for development
function generateMockChartExplanation(
  revenueData: ChartData[],
  totalRevenue: number
): string {
  const amounts = revenueData.map((d) => d.amount);
  const avgDaily = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const maxDay = Math.max(...amounts);
  const recentAvg = amounts.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const earlierAvg = amounts.slice(0, 7).reduce((a, b) => a + b, 0) / 7;

  let explanation = `Your revenue over the last 30 days shows a total of $${totalRevenue.toFixed(
    2
  )}, with an average daily revenue of $${avgDaily.toFixed(2)}. `;

  if (recentAvg > earlierAvg * 1.1) {
    explanation += `There's a positive trend with recent days showing ${(
      ((recentAvg - earlierAvg) / earlierAvg) *
      100
    ).toFixed(0)}% growth compared to earlier in the period. `;
  } else if (recentAvg < earlierAvg * 0.9) {
    explanation += `There's a slight decline with recent days showing ${(
      ((earlierAvg - recentAvg) / earlierAvg) *
      100
    ).toFixed(0)}% decrease compared to earlier in the period. `;
  } else {
    explanation += `Revenue has remained relatively stable throughout the period. `;
  }

  if (maxDay > avgDaily * 1.5) {
    explanation += `The highest revenue day reached $${maxDay.toFixed(
      2
    )}, indicating strong peak performance.`;
  } else {
    explanation += `Daily revenue has been consistent with no major spikes.`;
  }

  return explanation;
}

function generateMockBusinessSummary(metrics: BusinessMetrics): {
  summary: string;
  trends: string[];
  suggestions: string[];
} {
  const churnRate =
    metrics.activeSubscriptions > 0
      ? (metrics.canceledSubscriptions / metrics.activeSubscriptions) * 100
      : 0;
  const conversionRate =
    metrics.totalOrders > 0
      ? (metrics.paidOrders / metrics.totalOrders) * 100
      : 0;

  let summary = `Your SaaS business is showing solid performance with $${metrics.totalRevenue.toFixed(
    2
  )} in total revenue and ${metrics.totalUsers} users. `;

  if (metrics.activeSubscriptions > 0) {
    summary += `You have ${metrics.activeSubscriptions} active subscriptions generating recurring revenue. `;
  }

  if (metrics.newUsersThisMonth > 0) {
    summary += `Growth is positive with ${metrics.newUsersThisMonth} new users this month.`;
  } else {
    summary += `Consider focusing on user acquisition to drive growth.`;
  }

  const trends: string[] = [];
  if (metrics.revenueLast30Days > 0) {
    trends.push(
      `Revenue generation is active with $${metrics.revenueLast30Days.toFixed(
        2
      )} in the last 30 days`
    );
  }
  if (metrics.newUsersThisMonth > 0) {
    trends.push(
      `User base is growing with ${metrics.newUsersThisMonth} new signups this month`
    );
  }
  if (metrics.activityLast7Days > 0) {
    trends.push(
      `High user engagement with ${metrics.activityLast7Days} activity events in the last week`
    );
  }

  const suggestions: string[] = [];
  if (churnRate > 5) {
    suggestions.push(
      `Focus on reducing churn (currently ${churnRate.toFixed(
        1
      )}%) through better onboarding and customer success`
    );
  }
  if (conversionRate < 80) {
    suggestions.push(
      `Improve order conversion rate (currently ${conversionRate.toFixed(
        1
      )}%) by optimizing checkout flow`
    );
  }
  if (metrics.newUsersThisMonth < 10) {
    suggestions.push(
      `Accelerate user acquisition through marketing campaigns and referral programs`
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Continue monitoring key metrics and maintain current growth trajectory"
    );
    suggestions.push("Consider A/B testing pricing strategies to optimize revenue");
  }

  return { summary, trends, suggestions };
}

