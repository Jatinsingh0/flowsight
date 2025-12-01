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
  const minDay = Math.min(...amounts);
  const recentAvg = amounts.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const earlierAvg = amounts.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
  const growthPercent = recentAvg > earlierAvg 
    ? (((recentAvg - earlierAvg) / earlierAvg) * 100).toFixed(0)
    : (((earlierAvg - recentAvg) / earlierAvg) * 100).toFixed(0);

  // 5 different response variations
  const variations = [
    // Variation 1: Growth-focused
    `Your revenue chart shows strong performance with $${totalRevenue.toFixed(2)} generated over the last 30 days. The average daily revenue of $${avgDaily.toFixed(2)} indicates consistent cash flow. ${recentAvg > earlierAvg * 1.1 ? `Recent trends are particularly encouraging, showing ${growthPercent}% growth compared to earlier periods.` : recentAvg < earlierAvg * 0.9 ? `There's been a ${growthPercent}% decline in recent days, which may require attention.` : `Revenue has remained stable throughout the period.`} The peak day of $${maxDay.toFixed(2)} demonstrates your product's revenue potential.`,

    // Variation 2: Analysis-focused
    `Analyzing your 30-day revenue data reveals a total of $${totalRevenue.toFixed(2)} with an average of $${avgDaily.toFixed(2)} per day. ${maxDay > avgDaily * 1.5 ? `Notable spikes reached $${maxDay.toFixed(2)}, suggesting successful marketing campaigns or feature launches.` : `Daily revenue shows consistency, with the highest day at $${maxDay.toFixed(2)}.`} ${recentAvg > earlierAvg * 1.1 ? `The upward trajectory in recent weeks (${growthPercent}% increase) is a positive signal for future growth.` : recentAvg < earlierAvg * 0.9 ? `A ${growthPercent}% decrease in recent performance suggests reviewing your acquisition channels.` : `The stable pattern indicates a mature, predictable revenue stream.`}`,

    // Variation 3: Insight-focused
    `Revenue insights: Your business generated $${totalRevenue.toFixed(2)} in the past month, averaging $${avgDaily.toFixed(2)} daily. ${recentAvg > earlierAvg * 1.1 ? `The ${growthPercent}% improvement in recent weeks shows momentum building.` : recentAvg < earlierAvg * 0.9 ? `A ${growthPercent}% dip in recent days warrants investigation into market conditions or product changes.` : `Steady performance suggests reliable customer retention and predictable revenue.`} ${maxDay > avgDaily * 1.5 ? `Peak days like $${maxDay.toFixed(2)} highlight opportunities to replicate successful strategies.` : `Consistent daily revenue around $${avgDaily.toFixed(2)} indicates stable operations.`}`,

    // Variation 4: Strategic-focused
    `From a strategic perspective, your $${totalRevenue.toFixed(2)} monthly revenue demonstrates solid business fundamentals. ${avgDaily.toFixed(2)} per day provides a strong baseline. ${recentAvg > earlierAvg * 1.1 ? `The ${growthPercent}% acceleration suggests your growth initiatives are working.` : recentAvg < earlierAvg * 0.9 ? `The ${growthPercent}% slowdown may indicate market saturation or competitive pressure.` : `Flat growth suggests it's time to explore new revenue streams or expansion opportunities.`} ${maxDay > avgDaily * 1.5 ? `When you hit $${maxDay.toFixed(2)} on peak days, consider what drove that success and scale those tactics.` : `With consistent daily revenue, focus on incremental improvements to boost the average.`}`,

    // Variation 5: Action-oriented
    `Your revenue performance: $${totalRevenue.toFixed(2)} total with $${avgDaily.toFixed(2)} daily average. ${recentAvg > earlierAvg * 1.1 ? `Great news—recent weeks show ${growthPercent}% growth, indicating your strategies are effective.` : recentAvg < earlierAvg * 0.9 ? `Recent ${growthPercent}% decline needs attention—review customer feedback and market trends.` : `Stable revenue is good, but consider testing new growth channels to accelerate.`} ${maxDay > avgDaily * 1.5 ? `Your best day ($${maxDay.toFixed(2)}) proves higher revenue is achievable—analyze what made it successful.` : `With peak revenue at $${maxDay.toFixed(2)}, there's room to optimize average daily performance.`}`
  ];

  // Randomly select one variation
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex];
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
  const revenueGrowth = metrics.totalRevenue > 0 && metrics.revenueLast30Days > 0
    ? ((metrics.revenueLast30Days / metrics.totalRevenue) * 100).toFixed(1)
    : "0";

  // 5 different summary variations
  const summaryVariations = [
    `Your SaaS business demonstrates strong fundamentals with $${metrics.totalRevenue.toFixed(2)} in total revenue and ${metrics.totalUsers} active users. ${metrics.activeSubscriptions > 0 ? `The ${metrics.activeSubscriptions} active subscriptions provide a solid recurring revenue base.` : `Focus on converting users to subscriptions to build predictable revenue.`} ${metrics.newUsersThisMonth > 0 ? `With ${metrics.newUsersThisMonth} new users this month, your growth trajectory looks promising.` : `User acquisition needs attention—consider ramping up marketing efforts.`}`,

    `Business health overview: $${metrics.totalRevenue.toFixed(2)} total revenue across ${metrics.totalUsers} users shows solid market presence. ${metrics.revenueLast30Days > 0 ? `Recent performance of $${metrics.revenueLast30Days.toFixed(2)} in the last 30 days represents ${revenueGrowth}% of total revenue, indicating active monetization.` : `Revenue generation has slowed—time to re-engage existing users.`} ${metrics.activeSubscriptions > 0 ? `${metrics.activeSubscriptions} active subscriptions create a stable revenue foundation.` : `Building a subscription base should be a priority for sustainable growth.`}`,

    `Performance snapshot: Your platform has generated $${metrics.totalRevenue.toFixed(2)} in revenue with ${metrics.totalUsers} users. ${metrics.newUsersThisMonth > 0 ? `The addition of ${metrics.newUsersThisMonth} new users this month shows healthy growth momentum.` : `User growth is stagnant—explore new acquisition channels.`} ${metrics.activityLast7Days > 0 ? `High engagement (${metrics.activityLast7Days} events last week) suggests strong product-market fit.` : `Low activity indicates users may need better onboarding or feature discovery.`} ${metrics.activeSubscriptions > 0 ? `Your ${metrics.activeSubscriptions} subscriptions provide recurring revenue stability.` : `Consider introducing subscription tiers to increase customer lifetime value.`}`,

    `Analytics reveal: $${metrics.totalRevenue.toFixed(2)} total revenue and ${metrics.totalUsers} users form a solid base. ${metrics.revenueLast30Days > metrics.totalRevenue * 0.3 ? `Strong recent performance ($${metrics.revenueLast30Days.toFixed(2)} in 30 days) suggests accelerating growth.` : `Recent revenue of $${metrics.revenueLast30Days.toFixed(2)} indicates steady but moderate growth.`} ${metrics.paidOrders > 0 ? `With ${metrics.paidOrders} paid orders out of ${metrics.totalOrders} total, your conversion rate is ${conversionRate.toFixed(1)}%.` : `Order conversion needs improvement to maximize revenue potential.`} ${metrics.activeSubscriptions > 0 ? `${metrics.activeSubscriptions} active subscriptions demonstrate customer commitment.` : `Focus on subscription conversion to build predictable revenue streams.`}`,

    `Business insights: $${metrics.totalRevenue.toFixed(2)} in total revenue across ${metrics.totalUsers} users. ${metrics.activeSubscriptions > 0 ? `The ${metrics.activeSubscriptions} active subscriptions show strong customer retention and recurring value.` : `Building a subscription model will create more predictable revenue.`} ${metrics.newUsersThisMonth > 0 ? `${metrics.newUsersThisMonth} new users this month indicates effective acquisition strategies.` : `User acquisition is slow—consider referral programs or partnerships.`} ${metrics.activityLast7Days > 50 ? `High activity (${metrics.activityLast7Days} events) shows engaged users finding value in your platform.` : `Low activity suggests improving user onboarding or adding more compelling features.`}`
  ];

  // 5 different trend variations
  const trendVariations = [
    [
      metrics.revenueLast30Days > 0 ? `Revenue momentum: $${metrics.revenueLast30Days.toFixed(2)} generated in the last 30 days` : `Revenue generation needs acceleration`,
      metrics.newUsersThisMonth > 0 ? `User growth: ${metrics.newUsersThisMonth} new signups this month` : `User acquisition requires focus`,
      metrics.activityLast7Days > 0 ? `Engagement level: ${metrics.activityLast7Days} activity events in the past week` : `User engagement needs improvement`
    ],
    [
      metrics.totalOrders > 0 ? `Order volume: ${metrics.totalOrders} total orders with ${metrics.paidOrders} completed` : `Order generation is low`,
      metrics.activeSubscriptions > 0 ? `Subscription health: ${metrics.activeSubscriptions} active subscriptions` : `Subscription base needs growth`,
      metrics.revenueLast30Days > 0 ? `Recent revenue: $${metrics.revenueLast30Days.toFixed(2)} in the past month` : `Recent revenue generation is slow`
    ],
    [
      metrics.newUsersThisMonth > 0 ? `Growth trajectory: ${metrics.newUsersThisMonth} new users added this month` : `User growth has stalled`,
      metrics.paidOrders > 0 ? `Conversion performance: ${conversionRate.toFixed(1)}% order conversion rate` : `Order conversion needs optimization`,
      metrics.activityLast7Days > 0 ? `User activity: ${metrics.activityLast7Days} events showing platform engagement` : `User activity is below expectations`
    ],
    [
      metrics.revenueLast30Days > 0 ? `Monthly revenue: $${metrics.revenueLast30Days.toFixed(2)} demonstrates active monetization` : `Revenue generation needs attention`,
      metrics.activeSubscriptions > 0 ? `Recurring revenue: ${metrics.activeSubscriptions} subscriptions provide stability` : `Build subscription revenue for predictability`,
      metrics.totalUsers > 0 ? `User base: ${metrics.totalUsers} total users with ${metrics.newUsersThisMonth} new this month` : `User base growth requires strategy`
    ],
    [
      metrics.totalRevenue > 0 ? `Total performance: $${metrics.totalRevenue.toFixed(2)} all-time revenue` : `Revenue generation is critical`,
      metrics.newUsersThisMonth > 0 ? `Acquisition trend: ${metrics.newUsersThisMonth} new users indicates growth` : `User acquisition needs acceleration`,
      metrics.activityLast7Days > 0 ? `Engagement trend: ${metrics.activityLast7Days} events show active usage` : `Improve user engagement through better UX`
    ]
  ];

  // 5 different suggestion variations
  const suggestionVariations = [
    [
      churnRate > 5 ? `Reduce churn (${churnRate.toFixed(1)}%) by improving onboarding and customer success programs` : `Maintain low churn through excellent customer experience`,
      conversionRate < 80 ? `Optimize checkout flow to improve ${conversionRate.toFixed(1)}% conversion rate` : `Your ${conversionRate.toFixed(1)}% conversion is strong—maintain it`,
      metrics.newUsersThisMonth < 10 ? `Launch marketing campaigns to accelerate user acquisition` : `Continue successful acquisition strategies`
    ],
    [
      metrics.activeSubscriptions < metrics.totalUsers * 0.3 ? `Convert more users to subscriptions to increase recurring revenue` : `Subscription conversion is healthy—focus on retention`,
      metrics.revenueLast30Days < metrics.totalRevenue * 0.1 ? `Re-engage existing users to boost recent revenue` : `Recent revenue performance is solid`,
      metrics.activityLast7Days < 20 ? `Improve user onboarding to increase platform engagement` : `User engagement is strong—build on it`
    ],
    [
      churnRate > 5 ? `Address churn (${churnRate.toFixed(1)}%) through proactive customer support` : `Low churn indicates satisfied customers`,
      metrics.newUsersThisMonth < 10 ? `Explore referral programs or partnerships for user growth` : `User growth is on track—scale successful channels`,
      conversionRate < 80 ? `A/B test pricing and checkout to improve ${conversionRate.toFixed(1)}% conversion` : `Conversion rate is optimal—focus on volume`
    ],
    [
      metrics.revenueLast30Days < metrics.totalRevenue * 0.15 ? `Focus on monetization strategies to boost recent revenue` : `Recent revenue trends are positive`,
      metrics.activeSubscriptions < 5 ? `Prioritize subscription features to build recurring revenue` : `Subscription base is growing well`,
      metrics.activityLast7Days < 15 ? `Enhance product features to drive more user activity` : `User activity levels are healthy`
    ],
    [
      metrics.totalUsers < 50 ? `Accelerate user acquisition through content marketing and SEO` : `User base is growing—focus on retention`,
      churnRate > 5 ? `Implement retention campaigns to reduce ${churnRate.toFixed(1)}% churn rate` : `Churn management is effective`,
      metrics.revenueLast30Days > 0 ? `Scale successful revenue channels to maximize growth` : `Diversify revenue streams for stability`
    ]
  ];

  // Randomly select one variation
  const randomIndex = Math.floor(Math.random() * summaryVariations.length);
  
  return {
    summary: summaryVariations[randomIndex],
    trends: trendVariations[randomIndex].filter(t => t), // Filter out empty trends
    suggestions: suggestionVariations[randomIndex].filter(s => s) // Filter out empty suggestions
  };
}

