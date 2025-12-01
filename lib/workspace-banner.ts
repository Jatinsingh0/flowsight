import { getCurrentUser } from "./auth";
import { getCurrentUserWorkspace } from "./workspace";
import { prisma } from "./prisma";

/**
 * Check if demo mode banner should be shown
 * Returns false if user has imported CSV data
 */
export async function shouldShowDemoBanner(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const workspace = await getCurrentUserWorkspace(user.userId);
  if (!workspace) return true; // Show banner if no workspace

  // Check if workspace has actual IMPORTED data (not just the logged-in user)
  const [hasOrders, totalUsers, hasSubscriptions] = await Promise.all([
    prisma.order.count({ where: { workspaceId: workspace.id } }),
    prisma.user.count({ where: { workspaceId: workspace.id } }),
    prisma.subscription.count({ where: { workspaceId: workspace.id } }),
  ]);

  // Check if there are imported users (excluding the logged-in user)
  const hasImportedUsers = totalUsers > 1;

  // Show banner if there's no imported data (orders, subscriptions, or imported users)
  // New users should see the banner until they upload CSV files
  const hasImportedData = hasOrders > 0 || hasSubscriptions > 0 || hasImportedUsers;
  return !hasImportedData;
}

