// Global types for FlowSight

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  startDate: Date;
  endDate: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  activeSubscriptions: number;
}

