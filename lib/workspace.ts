import { prisma } from "./prisma";

const DEMO_WORKSPACE_ID = "workspace_demo";

/**
 * Get or create workspace for a user
 * If user doesn't have a workspace, create one
 */
export async function getOrCreateUserWorkspace(userId: string, userEmail: string) {
  // Create new workspace for user
  const workspaceId = `workspace_${userId}`;
  const workspace = await prisma.workspace.upsert({
    where: { workspaceId },
    update: {},
    create: {
      workspaceId,
      name: `${userEmail}'s Workspace`,
      realDataEnabled: false,
    },
  });

  // Try to check if user already has this workspace
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { workspaceId: true },
    });

    if (user?.workspaceId === workspace.id) {
      return workspace; // Already assigned
    }
  } catch (error) {
    // If workspaceId is null, continue to assign it
  }

  // Update user with workspace
  await prisma.user.update({
    where: { id: userId },
    data: { workspaceId: workspace.id },
  });

  return workspace;
}

/**
 * Get demo workspace (for seeded data)
 */
export async function getDemoWorkspace() {
  return prisma.workspace.upsert({
    where: { workspaceId: DEMO_WORKSPACE_ID },
    update: {},
    create: {
      workspaceId: DEMO_WORKSPACE_ID,
      name: "Demo Workspace",
      realDataEnabled: false,
    },
  });
}

/**
 * Get workspace for current user
 * REQUIRED: Every user must have a workspace for data isolation
 * Handles existing users with null workspaceId by creating one
 */
export async function getCurrentUserWorkspace(userId: string) {
  try {
    // Try to get user - handle case where workspaceId might be null (existing users)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) return null;

    // Try to get workspaceId directly (might be null for existing users)
    const userWithWorkspace = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        workspaceId: true,
      },
    }).catch(() => null);

    // If user has workspaceId, return the workspace
    if (userWithWorkspace?.workspaceId) {
      const workspace = await prisma.workspace.findUnique({
        where: { id: userWithWorkspace.workspaceId },
      });
      if (workspace) return workspace;
    }

    // User doesn't have workspaceId (existing user) - create one
    return getOrCreateUserWorkspace(userId, user.email);
  } catch (error: any) {
    // If error is about null workspaceId, create workspace
    if (error.message?.includes("workspaceId") || error.message?.includes("null")) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });
      if (user) {
        return getOrCreateUserWorkspace(userId, user.email);
      }
    }
    throw error;
  }
}

/**
 * Enable real data mode for workspace
 */
export async function enableRealDataMode(workspaceId: string) {
  return prisma.workspace.update({
    where: { id: workspaceId },
    data: { realDataEnabled: true },
  });
}

/**
 * Check if workspace has real data enabled
 */
export async function hasRealDataEnabled(workspaceId: string): Promise<boolean> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  return workspace?.realDataEnabled ?? false;
}

/**
 * Get workspace ID string (for filtering)
 */
export async function getWorkspaceIdString(userId: string): Promise<string> {
  const workspace = await getCurrentUserWorkspace(userId);
  return workspace?.workspaceId ?? DEMO_WORKSPACE_ID;
}

