import { getCurrentUser } from "./auth";
import { getCurrentUserWorkspace } from "./workspace";
import { prisma } from "./prisma";

export interface WorkspaceInfo {
  name: string;
  mode: "Demo" | "Real";
  realDataSince: Date | null;
  dataSummary: {
    users: number;
    orders: number;
    subscriptions: number;
  };
}

/**
 * Get workspace information including data summary
 */
export async function getWorkspaceInfo(): Promise<WorkspaceInfo | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const workspace = await getCurrentUserWorkspace(user.userId);
  if (!workspace) return null;

  // Get user's name to format workspace name properly
  const userData = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { name: true },
  });

  // Format workspace name: use user's name if available, otherwise use email
  let workspaceName = workspace.name;
  if (userData?.name) {
    // If workspace name is like "email@example.com's Workspace", replace with user's name
    workspaceName = `${userData.name}'s Workspace`;
  }

  // Get data counts
  const [usersCount, ordersCount, subscriptionsCount] = await Promise.all([
    prisma.user.count({ where: { workspaceId: workspace.id } }),
    prisma.order.count({ where: { workspaceId: workspace.id } }),
    prisma.subscription.count({ where: { workspaceId: workspace.id } }),
  ]);

  // Find the earliest import date (first order, user, or subscription)
  let realDataSince: Date | null = null;
  if (workspace.realDataEnabled && (ordersCount > 0 || usersCount > 0 || subscriptionsCount > 0)) {
    const dates: Date[] = [];

    if (ordersCount > 0) {
      const firstOrder = await prisma.order.findFirst({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });
      if (firstOrder) dates.push(firstOrder.createdAt);
    }

    if (usersCount > 0) {
      const firstUser = await prisma.user.findFirst({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });
      if (firstUser) dates.push(firstUser.createdAt);
    }

    if (subscriptionsCount > 0) {
      const firstSubscription = await prisma.subscription.findFirst({
        where: { workspaceId: workspace.id },
        orderBy: { startDate: "asc" },
        select: { startDate: true },
      });
      if (firstSubscription) dates.push(firstSubscription.startDate);
    }

    if (dates.length > 0) {
      realDataSince = new Date(Math.min(...dates.map(d => d.getTime())));
    }
  }

  const mode: "Demo" | "Real" = workspace.realDataEnabled && 
    (ordersCount > 0 || usersCount > 0 || subscriptionsCount > 0) 
    ? "Real" 
    : "Demo";

  return {
    name: workspaceName,
    mode,
    realDataSince,
    dataSummary: {
      users: usersCount,
      orders: ordersCount,
      subscriptions: subscriptionsCount,
    },
  };
}

