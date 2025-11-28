// App-wide constants

export const APP_NAME = "FlowSight";
export const APP_DESCRIPTION = "Modern SaaS Admin Dashboard";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  ORDERS: "/orders",
  SUBSCRIPTIONS: "/subscriptions",
  ACTIVITY: "/activity",
  SETTINGS: "/settings",
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
    USERS: "/api/dashboard/users",
    ORDERS: "/api/dashboard/orders",
    SUBSCRIPTIONS: "/api/dashboard/subscriptions",
    ACTIVITY: "/api/dashboard/activity",
  },
} as const;

