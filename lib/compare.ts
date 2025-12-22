import { OrderStatus, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDataWorkspace } from "@/lib/workspace-data";

// Date utility functions
function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getStartOfWeek(date?: Date) {
  const d = new Date(date || new Date());
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday = 0
  const startOfWeek = new Date(d);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

function getEndOfWeek(date?: Date) {
  const d = date || new Date();
  const start = getStartOfWeek(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getStartOfMonth(date?: Date) {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getEndOfMonth(date?: Date) {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getStartOfPreviousWeek() {
  const now = new Date();
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);
  return getStartOfWeek(lastWeek);
}

function getEndOfPreviousWeek() {
  const now = new Date();
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);
  return getEndOfWeek(lastWeek);
}

function getStartOfPreviousMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1, 1);
}

function getEndOfPreviousMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
}

// Calculate percentage change
function calculateChangePercent(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

// Comparison metric interface
export interface ComparisonMetric {
  label: string;
  current: number;
  previous: number;
  changePercent: number;
  positive: boolean;
}

// Week-over-week comparison data
export interface WeekOverWeekData {
  users: ComparisonMetric;
  orders: ComparisonMetric;
  revenue: ComparisonMetric;
  subscriptions: ComparisonMetric;
}

// Month-over-month comparison data
export interface MonthOverMonthData {
  users: ComparisonMetric;
  orders: ComparisonMetric;
  revenue: ComparisonMetric;
  subscriptions: ComparisonMetric;
}

// Combined comparison data
export interface ComparativeAnalytics {
  weekOverWeek: WeekOverWeekData;
  monthOverMonth: MonthOverMonthData;
}

/**
 * Get week-over-week and month-over-month comparative analytics
 */
export async function getComparativeAnalytics(): Promise<ComparativeAnalytics> {
  // Get appropriate workspace (demo if no imported data, user's if they have data)
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;

  // Current period dates
  const startOfCurrentWeek = getStartOfWeek();
  const endOfCurrentWeek = getEndOfWeek();
  const startOfCurrentMonth = getStartOfMonth();
  const endOfCurrentMonth = getEndOfMonth();

  // Previous period dates
  const startOfLastWeek = getStartOfPreviousWeek();
  const endOfLastWeek = getEndOfPreviousWeek();
  const startOfLastMonth = getStartOfPreviousMonth();
  const endOfLastMonth = getEndOfPreviousMonth();

  // Fetch all data in parallel for performance
  const [
    // Week-over-week: Users
    currentWeekUsers,
    lastWeekUsers,
    // Week-over-week: Orders
    currentWeekOrders,
    lastWeekOrders,
    // Week-over-week: Revenue
    currentWeekRevenueOrders,
    lastWeekRevenueOrders,
    // Week-over-week: Subscriptions
    currentWeekSubscriptions,
    lastWeekSubscriptions,
    // Month-over-month: Users
    currentMonthUsers,
    lastMonthUsers,
    // Month-over-month: Orders
    currentMonthOrders,
    lastMonthOrders,
    // Month-over-month: Revenue
    currentMonthRevenueOrders,
    lastMonthRevenueOrders,
    // Month-over-month: Subscriptions
    currentMonthSubscriptions,
    lastMonthSubscriptions,
  ] = await Promise.all([
    // WoW Users
    prisma.user.count({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfCurrentWeek,
          lte: endOfCurrentWeek,
        },
      },
    }),
    prisma.user.count({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfLastWeek,
          lte: endOfLastWeek,
        },
      },
    }),
    // WoW Orders
    prisma.order.count({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfCurrentWeek,
          lte: endOfCurrentWeek,
        },
      },
    }),
    prisma.order.count({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfLastWeek,
          lte: endOfLastWeek,
        },
      },
    }),
    // WoW Revenue (paid orders)
    prisma.order.findMany({
      where: {
        workspaceId,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startOfCurrentWeek,
          lte: endOfCurrentWeek,
        },
      },
      select: { amount: true },
    }),
    prisma.order.findMany({
      where: {
        workspaceId,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startOfLastWeek,
          lte: endOfLastWeek,
        },
      },
      select: { amount: true },
    }),
    // WoW Subscriptions
    prisma.subscription.count({
      where: {
        workspaceId,
        status: SubscriptionStatus.ACTIVE,
        createdAt: {
          gte: startOfCurrentWeek,
          lte: endOfCurrentWeek,
        },
      },
    }),
    prisma.subscription.count({
      where: {
        workspaceId,
        status: SubscriptionStatus.ACTIVE,
        createdAt: {
          gte: startOfLastWeek,
          lte: endOfLastWeek,
        },
      },
    }),
    // MoM Users
    prisma.user.count({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    }),
    prisma.user.count({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),
    // MoM Orders
    prisma.order.count({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    }),
    prisma.order.count({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),
    // MoM Revenue (paid orders)
    prisma.order.findMany({
      where: {
        workspaceId,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      select: { amount: true },
    }),
    prisma.order.findMany({
      where: {
        workspaceId,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      select: { amount: true },
    }),
    // MoM Subscriptions
    prisma.subscription.count({
      where: {
        workspaceId,
        status: SubscriptionStatus.ACTIVE,
        createdAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    }),
    prisma.subscription.count({
      where: {
        workspaceId,
        status: SubscriptionStatus.ACTIVE,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),
  ]);

  // Calculate revenue totals
  const currentWeekRevenue = currentWeekRevenueOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );
  const lastWeekRevenue = lastWeekRevenueOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );
  const currentMonthRevenue = currentMonthRevenueOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );
  const lastMonthRevenue = lastMonthRevenueOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  // Build week-over-week data
  const weekOverWeek: WeekOverWeekData = {
    users: {
      label: "Users",
      current: currentWeekUsers,
      previous: lastWeekUsers,
      changePercent: calculateChangePercent(currentWeekUsers, lastWeekUsers),
      positive: currentWeekUsers >= lastWeekUsers,
    },
    orders: {
      label: "Orders",
      current: currentWeekOrders,
      previous: lastWeekOrders,
      changePercent: calculateChangePercent(currentWeekOrders, lastWeekOrders),
      positive: currentWeekOrders >= lastWeekOrders,
    },
    revenue: {
      label: "Revenue",
      current: currentWeekRevenue,
      previous: lastWeekRevenue,
      changePercent: calculateChangePercent(currentWeekRevenue, lastWeekRevenue),
      positive: currentWeekRevenue >= lastWeekRevenue,
    },
    subscriptions: {
      label: "Subscriptions",
      current: currentWeekSubscriptions,
      previous: lastWeekSubscriptions,
      changePercent: calculateChangePercent(
        currentWeekSubscriptions,
        lastWeekSubscriptions
      ),
      positive: currentWeekSubscriptions >= lastWeekSubscriptions,
    },
  };

  // Build month-over-month data
  const monthOverMonth: MonthOverMonthData = {
    users: {
      label: "Users",
      current: currentMonthUsers,
      previous: lastMonthUsers,
      changePercent: calculateChangePercent(currentMonthUsers, lastMonthUsers),
      positive: currentMonthUsers >= lastMonthUsers,
    },
    orders: {
      label: "Orders",
      current: currentMonthOrders,
      previous: lastMonthOrders,
      changePercent: calculateChangePercent(currentMonthOrders, lastMonthOrders),
      positive: currentMonthOrders >= lastMonthOrders,
    },
    revenue: {
      label: "Revenue",
      current: currentMonthRevenue,
      previous: lastMonthRevenue,
      changePercent: calculateChangePercent(currentMonthRevenue, lastMonthRevenue),
      positive: currentMonthRevenue >= lastMonthRevenue,
    },
    subscriptions: {
      label: "Subscriptions",
      current: currentMonthSubscriptions,
      previous: lastMonthSubscriptions,
      changePercent: calculateChangePercent(
        currentMonthSubscriptions,
        lastMonthSubscriptions
      ),
      positive: currentMonthSubscriptions >= lastMonthSubscriptions,
    },
  };

  return {
    weekOverWeek,
    monthOverMonth,
  };
}

