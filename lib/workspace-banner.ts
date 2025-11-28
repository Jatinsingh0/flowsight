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

  // If realDataEnabled is false, show banner
  if (!workspace.realDataEnabled) return true;

  // If realDataEnabled is true, check if workspace has actual data
  const [hasOrders, hasUsers, hasSubscriptions] = await Promise.all([
    prisma.order.count({ where: { workspaceId: workspace.id } }),
    prisma.user.count({ where: { workspaceId: workspace.id } }),
    prisma.subscription.count({ where: { workspaceId: workspace.id } }),
  ]);

  // Hide banner if workspace has imported data
  const hasImportedData = hasOrders > 0 || hasUsers > 0 || hasSubscriptions > 0;
  return !hasImportedData;
}

