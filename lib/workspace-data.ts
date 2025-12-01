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
    if (workspace) {
      // Check if workspace has actual IMPORTED data (not just the logged-in user themselves)
      // Orders and subscriptions are always imported, so they count as real data
      // Users count as imported data only if there are OTHER users besides the logged-in user
      const [hasOrders, totalUsers, hasSubscriptions] = await Promise.all([
        prisma.order.count({ where: { workspaceId: workspace.id } }),
        prisma.user.count({ where: { workspaceId: workspace.id } }),
        prisma.subscription.count({ where: { workspaceId: workspace.id } }),
      ]);

      // Check if there are imported users (excluding the logged-in user)
      // If totalUsers > 1, it means there are imported users
      const hasImportedUsers = totalUsers > 1;

      // Use real data ONLY if there are orders, subscriptions, or imported users
      // New users should see demo data until they upload CSV files
      const hasImportedData = hasOrders > 0 || hasSubscriptions > 0 || hasImportedUsers;
      useDemoData = !hasImportedData;
      
      // If we have imported data but flag isn't set, enable it (fixes edge cases)
      if (!useDemoData && !workspace.realDataEnabled) {
        await prisma.workspace.update({
          where: { id: workspace.id },
          data: { realDataEnabled: true },
        });
      }
    }
  }

  // If no workspace or should use demo data, use demo workspace
  if (!workspace || useDemoData) {
    workspace = await getDemoWorkspace();
  }

  return workspace;
}

