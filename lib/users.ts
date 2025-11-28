import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDataWorkspace } from "@/lib/workspace-data";

export async function getUserStats() {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalUsers, adminCount, managerCount, newThisMonth] =
    await Promise.all([
      prisma.user.count({ where: { workspaceId } }),
      prisma.user.count({
        where: { role: Role.ADMIN, workspaceId },
      }),
      prisma.user.count({
        where: { role: Role.MANAGER, workspaceId },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          workspaceId,
        },
      }),
    ]);

  const userCount = totalUsers - adminCount - managerCount;

  return {
    totalUsers,
    adminCount,
    managerCount,
    userCount,
    newThisMonth,
  };
}

export async function getAllUsers() {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  
  const users = await prisma.user.findMany({
    where: { workspaceId },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return users;
}

