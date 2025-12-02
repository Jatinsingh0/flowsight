import { getCurrentUser } from "./auth";
import { getCurrentUserWorkspace, isDemoUser, DEMO_WORKSPACE_ID } from "./workspace";
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

  // Check if user is demo user or workspace is demo workspace
  const isDemo = await isDemoUser();
  const isDemoWorkspace = workspace.workspaceId === DEMO_WORKSPACE_ID;

  // Get data counts
  const [usersCount, ordersCount, subscriptionsCount] = await Promise.all([
    prisma.user.count({ where: { workspaceId: workspace.id } }),
    prisma.order.count({ where: { workspaceId: workspace.id } }),
    prisma.subscription.count({ where: { workspaceId: workspace.id } }),
  ]);

  // For mode determination, check if there's actual IMPORTED data
  // (not just the logged-in user themselves or demo workspace data)
  // Users count as imported data only if there are OTHER users besides the logged-in user
  const hasImportedUsers = usersCount > 1;
  const hasImportedData = ordersCount > 0 || subscriptionsCount > 0 || hasImportedUsers;

  // Determine mode: Always Demo for demo users/workspace, otherwise check for imported data
  const mode: "Demo" | "Real" = (isDemo || isDemoWorkspace) 
    ? "Demo" 
    : (workspace.realDataEnabled && hasImportedData)
    ? "Real"
    : "Demo";

  // Find the earliest import date (first order, user, or subscription)
  // Only calculate if in Real Mode
  let realDataSince: Date | null = null;
  if (mode === "Real" && hasImportedData) {
    const dates: Date[] = [];

    if (ordersCount > 0) {
      const firstOrder = await prisma.order.findFirst({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });
      if (firstOrder) dates.push(firstOrder.createdAt);
    }

    if (hasImportedUsers) {
      // Get first imported user (not the logged-in user)
      const allUsers = await prisma.user.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "asc" },
        select: { id: true, createdAt: true },
      });
      const importedUser = allUsers.find(u => u.id !== user.userId);
      if (importedUser) dates.push(importedUser.createdAt);
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

