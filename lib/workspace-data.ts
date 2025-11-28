import { getCurrentUser } from "./auth";
import { getCurrentUserWorkspace, getDemoWorkspace } from "./workspace";
import { prisma } from "./prisma";

/**
 * Get the appropriate workspace ID for data queries
 * Returns demo workspace if user hasn't imported any data
 * Returns user's workspace if they have imported data
 */
export async function getDataWorkspace() {
  const user = await getCurrentUser();
  let workspace;
  let useDemoData = true; // Default to demo data

  if (user) {
    workspace = await getCurrentUserWorkspace(user.userId);
    if (workspace && workspace.realDataEnabled) {
      // Check if workspace has actual imported data
      const [hasOrders, hasUsers, hasSubscriptions] = await Promise.all([
        prisma.order.count({ where: { workspaceId: workspace.id } }),
        prisma.user.count({ where: { workspaceId: workspace.id } }),
        prisma.subscription.count({ where: { workspaceId: workspace.id } }),
      ]);

      // Only use real data if workspace has actual imported data
      useDemoData = hasOrders === 0 && hasUsers === 0 && hasSubscriptions === 0;
    } else {
      // If realDataEnabled is false, definitely use demo
      useDemoData = true;
    }
  }

  // If no workspace or should use demo data, use demo workspace
  if (!workspace || useDemoData) {
    workspace = await getDemoWorkspace();
  }

  return workspace;
}

