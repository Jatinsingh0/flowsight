"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Settings, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  userEmail: string;
}

export function NavLinks({ userEmail }: NavLinksProps) {
  const pathname = usePathname();
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    // Normalize paths (remove trailing slashes for comparison)
    const normalizedCurrent = pathname.replace(/\/$/, "") || "/";
    const normalizedPath = path.replace(/\/$/, "") || "/";
    
    // For homepage, don't highlight Dashboard
    if (normalizedCurrent === "/") {
      return false;
    }
    
    // Dashboard is active only on /dashboard exactly (not on sub-routes)
    if (normalizedPath === "/dashboard") {
      return normalizedCurrent === "/dashboard";
    }
    
    // For other routes, check exact match first
    if (normalizedCurrent === normalizedPath) {
      return true;
    }
    
    // Check if current path starts with the route path followed by /
    return normalizedCurrent.startsWith(normalizedPath + "/");
  };

  return (
    <>
      <Link
        href="/dashboard"
        className={cn(
          "text-sm transition-colors rounded-md px-3 py-1.5",
          isActive("/dashboard")
            ? "text-textBase bg-accent/10 font-medium"
            : "text-textMuted hover:text-textBase hover:bg-accent/5"
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/users"
        className={cn(
          "text-sm transition-colors rounded-md px-3 py-1.5",
          isActive("/dashboard/users")
            ? "text-textBase bg-accent/10 font-medium"
            : "text-textMuted hover:text-textBase hover:bg-accent/5"
        )}
      >
        Users
      </Link>
      <Link
        href="/dashboard/orders"
        className={cn(
          "text-sm transition-colors rounded-md px-3 py-1.5",
          isActive("/dashboard/orders")
            ? "text-textBase bg-accent/10 font-medium"
            : "text-textMuted hover:text-textBase hover:bg-accent/5"
        )}
      >
        Orders
      </Link>
      <Link
        href="/dashboard/subscriptions"
        className={cn(
          "text-sm transition-colors rounded-md px-3 py-1.5",
          isActive("/dashboard/subscriptions")
            ? "text-textBase bg-accent/10 font-medium"
            : "text-textMuted hover:text-textBase hover:bg-accent/5"
        )}
      >
        Subscriptions
      </Link>
      <Link
        href="/dashboard/activity"
        className={cn(
          "text-sm transition-colors rounded-md px-3 py-1.5",
          isActive("/dashboard/activity")
            ? "text-textBase bg-accent/10 font-medium"
            : "text-textMuted hover:text-textBase hover:bg-accent/5"
        )}
      >
        Activity
      </Link>
      <Link
        href="/dashboard/data-import"
        className={cn(
          "text-sm transition-colors rounded-md px-3 py-1.5",
          isActive("/dashboard/data-import")
            ? "text-textBase bg-accent/10 font-medium"
            : "text-textMuted hover:text-textBase hover:bg-accent/5"
        )}
      >
        Data Import
      </Link>
      <Link
        href="/dashboard/settings"
        className={cn(
          "transition-colors rounded-md p-1.5",
          isActive("/dashboard/settings")
            ? "text-textBase bg-accent/10"
            : "text-textMuted hover:text-textBase hover:bg-accent/5"
        )}
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </>
  );
}

