import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "MANAGER" | "USER";
  createdAt: Date;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const payload = await getCurrentUser();
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

