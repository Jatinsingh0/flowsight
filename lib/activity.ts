import { prisma } from "@/lib/prisma";
import { getDataWorkspace } from "@/lib/workspace-data";

const DEFAULT_RANGE_DAYS = 30;

function getDateNDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export interface ActivityFilters {
  type?: string;
  days?: number;
  search?: string;
}

export interface ActivityWithUser {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
}

export async function getActivityStats() {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = getDateNDaysAgo(7);
  const last30d = getDateNDaysAgo(30);

  const [count24h, count7d, count30d, totalCount] = await Promise.all([
    prisma.activity.count({
      where: {
        workspaceId,
        createdAt: {
          gte: last24h,
        },
      },
    }),
    prisma.activity.count({
      where: {
        workspaceId,
        createdAt: {
          gte: last7d,
        },
      },
    }),
    prisma.activity.count({
      where: {
        workspaceId,
        createdAt: {
          gte: last30d,
        },
      },
    }),
    prisma.activity.count({ where: { workspaceId } }),
  ]);

  return {
    count24h,
    count7d,
    count30d,
    totalCount,
  };
}

export async function getActivity(filters: ActivityFilters = {}): Promise<ActivityWithUser[]> {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  const { type, days = DEFAULT_RANGE_DAYS, search } = filters;
  const startDate = getDateNDaysAgo(days);

  const where: any = {
    workspaceId,
    createdAt: {
      gte: startDate,
    },
  };

  // Filter by activity type
  if (type && type !== "ALL") {
    where.action = type;
  }

  // Search by user name or email
  if (search && search.trim()) {
    where.user = {
      OR: [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ],
    };
  }

  const activities = await prisma.activity.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    take: 200, // Limit to prevent huge lists
  });

  return activities.map((activity) => ({
    id: activity.id,
    action: activity.action,
    description: activity.description,
    createdAt: activity.createdAt,
    user: {
      name: activity.user.name,
      email: activity.user.email,
    },
  }));
}

// Get unique activity types for filter dropdown
export async function getActivityTypes(): Promise<string[]> {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  
  const activities = await prisma.activity.findMany({
    where: { workspaceId },
    select: {
      action: true,
    },
    distinct: ["action"],
    orderBy: {
      action: "asc",
    },
  });

  return activities.map((a) => a.action);
}

