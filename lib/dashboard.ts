import { OrderStatus, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDataWorkspace } from "@/lib/workspace-data";

const REVENUE_CHART_DAYS = 30;

function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getPastDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getStartOfMonth(date?: Date) {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getEndOfMonth(date?: Date) {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getStartOfPreviousMonth() {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return prevMonth;
}

function getEndOfPreviousMonth() {
  const now = new Date();
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return prevMonthEnd;
}

export async function getDashboardStats() {
  // Get appropriate workspace (demo if no imported data, user's if they have data)
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;

  const startOfToday = getStartOfToday();
  const startOfRange = getPastDate(REVENUE_CHART_DAYS - 1);
  const startOfMonth = getStartOfMonth();
  const startOfPreviousMonth = getStartOfPreviousMonth();
  const endOfPreviousMonth = getEndOfPreviousMonth();
  const sevenDaysAgo = getPastDate(7);

  const [
    paidOrders,
    totalUsers,
    activeSubscriptions,
    newOrdersToday,
    activeSubscriptionsLastMonth,
    ordersLast7Days,
    activitiesLast7Days,
  ] = await Promise.all([
    prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        workspaceId,
      },
      select: {
        amount: true,
        createdAt: true,
      },
    }),
    prisma.user.count({
      where: { workspaceId },
    }),
    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
        workspaceId,
      },
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
        workspaceId,
      },
    }),
    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
        updatedAt: {
          gte: startOfPreviousMonth,
          lte: endOfPreviousMonth,
        },
        workspaceId,
      },
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        workspaceId,
      },
    }),
    prisma.activity.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        workspaceId,
      },
      select: {
        createdAt: true,
      },
    }),
  ]);

  const totalRevenue = paidOrders.length > 0
    ? paidOrders.reduce(
        (sum: number, order: { amount: number }) => sum + order.amount,
        0
      )
    : 0;

  const revenueByDay = Array.from({ length: REVENUE_CHART_DAYS }).map(
    (_, index) => {
      const date = new Date(startOfRange);
      date.setDate(startOfRange.getDate() + index);
      const label = date.toISOString().split("T")[0];
      const ordersForDay = paidOrders.filter(
        (order: { createdAt: Date }) =>
          order.createdAt.getFullYear() === date.getFullYear() &&
          order.createdAt.getMonth() === date.getMonth() &&
          order.createdAt.getDate() === date.getDate()
      );
      const amount = ordersForDay.length > 0
        ? ordersForDay.reduce((sum: number, order: { amount: number }) => sum + order.amount, 0)
        : 0;

      return { date: label, amount };
    }
  );

  // Calculate insights
  const subscriptionChange = activeSubscriptions - activeSubscriptionsLastMonth;
  const subscriptionChangePercent = activeSubscriptionsLastMonth > 0
    ? ((subscriptionChange / activeSubscriptionsLastMonth) * 100)
    : (activeSubscriptions > 0 ? 100 : 0);
  
  // Get users from last month for percentage calculation
  const usersLastMonth = await prisma.user.count({
    where: {
      createdAt: {
        lt: startOfMonth,
      },
      workspaceId,
    },
  });
  const usersChange = totalUsers - usersLastMonth;
  const usersChangePercent = usersLastMonth > 0
    ? ((usersChange / usersLastMonth) * 100)
    : (totalUsers > 0 ? 100 : 0);
  
  const avgOrdersLast7Days = ordersLast7Days / 7;
  const ordersTodayVsAvg = newOrdersToday - avgOrdersLast7Days;
  const ordersTodayVsAvgPercent = avgOrdersLast7Days > 0
    ? ((ordersTodayVsAvg / avgOrdersLast7Days) * 100)
    : (newOrdersToday > 0 ? 100 : 0);

  // Find most active day of week
  const dayCounts: Record<number, number> = {};
  activitiesLast7Days.forEach((activity: { createdAt: Date }) => {
    const day = activity.createdAt.getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  // Safely get most active day (handle empty array case)
  const dayEntries = Object.entries(dayCounts);
  const mostActiveDay = dayEntries.length > 0
    ? dayEntries.reduce((a, b) => a[1] > b[1] ? a : b)?.[0]
    : null;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return {
    totalRevenue,
    totalUsers,
    activeSubscriptions,
    newOrdersToday,
    revenueByDay,
    insights: {
      activeSubscriptionsChange: subscriptionChangePercent,
      usersChangePercent: usersChangePercent,
      ordersTodayVsAvg: ordersTodayVsAvgPercent,
      avgOrdersLast7Days: avgOrdersLast7Days,
      mostActiveDay: mostActiveDay !== null && mostActiveDay !== undefined 
        ? dayNames[parseInt(mostActiveDay)] 
        : null,
    },
  };
}

export async function getRecentOrders(limit = 8) {
  // Get appropriate workspace (demo if no imported data, user's if they have data)
  const workspace = await getDataWorkspace();

  const orders = await prisma.order.findMany({
    where: {
      workspaceId: workspace.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return orders;
}

export async function getRecentActivity(limit = 8) {
  // Get appropriate workspace (demo if no imported data, user's if they have data)
  const workspace = await getDataWorkspace();

  const activities = await prisma.activity.findMany({
    where: {
      workspaceId: workspace.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return activities;
}

export async function getBusinessMetrics() {
  // Get appropriate workspace (demo if no imported data, user's if they have data)
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  const startOfToday = getStartOfToday();
  const thirtyDaysAgo = getPastDate(30);
  const sevenDaysAgo = getPastDate(7);
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const [
    allOrders,
    paidOrders,
    totalUsers,
    newUsersThisMonth,
    activeSubscriptions,
    canceledSubscriptions,
    activityLast7Days,
    revenueLast30Days,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { workspaceId },
      select: { amount: true, createdAt: true, status: true },
    }),
    prisma.order.findMany({
      where: { status: OrderStatus.COMPLETED, workspaceId },
      select: { amount: true, createdAt: true },
    }),
    prisma.user.count({
      where: { workspaceId },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
        workspaceId,
      },
    }),
    prisma.subscription.count({
      where: { status: SubscriptionStatus.ACTIVE, workspaceId },
    }),
    prisma.subscription.count({
      where: { status: SubscriptionStatus.CANCELLED, workspaceId },
    }),
    prisma.activity.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        workspaceId,
      },
    }),
    prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: thirtyDaysAgo,
        },
        workspaceId,
      },
      select: { amount: true },
    }),
  ]);

  const totalRevenue = paidOrders.length > 0
    ? paidOrders.reduce((sum: number, order: { amount: number }) => sum + order.amount, 0)
    : 0;
  const revenueLast30DaysAmount = revenueLast30Days.length > 0
    ? revenueLast30Days.reduce(
        (sum: number, order: { amount: number }) => sum + order.amount,
        0
      )
    : 0;

  return {
    totalRevenue,
    revenueLast30Days: revenueLast30DaysAmount,
    totalUsers,
    newUsersThisMonth,
    activeSubscriptions,
    canceledSubscriptions,
    totalOrders: allOrders.length,
    paidOrders: paidOrders.length,
    activityLast7Days,
  };
}

