import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";

export const DEMO_WORKSPACE_ID = "workspace_demo";
export const DEMO_USER_EMAIL = "admin@flowsight.dev";

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

/**
 * Check if current user is a demo user
 * Demo users are identified by:
 * 1. Email is admin@flowsight.dev
 * 2. Their workspace is the demo workspace
 */
export async function isDemoUser(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // Check by email
  const userRecord = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { email: true, workspaceId: true },
  });

  if (!userRecord) return false;

  // Check if email is demo email
  if (userRecord.email === DEMO_USER_EMAIL) {
    return true;
  }

  // Check if workspace is demo workspace
  if (userRecord.workspaceId) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: userRecord.workspaceId },
      select: { workspaceId: true },
    });
    if (workspace?.workspaceId === DEMO_WORKSPACE_ID) {
      return true;
    }
  }

  return false;
}

