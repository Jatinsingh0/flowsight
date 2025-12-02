"use client";

import { useState } from "react";
import { ImportCard } from "./import-card";
import { Users, ShoppingCart, CreditCard } from "lucide-react";

interface DataImportClientProps {
  workspaceId: string;
  isDemoUser?: boolean;
}

export function DataImportClient({ workspaceId, isDemoUser = false }: DataImportClientProps) {
  return (
    <div className="space-y-6">
      <ImportCard
        type="users"
        title="Import Users"
        description="Upload a CSV of your product's users. At minimum, include email and name. You can optionally include role and createdAt."
        icon={Users}
        workspaceId={workspaceId}
        isDemoUser={isDemoUser}
      />

      <ImportCard
        type="orders"
        title="Import Orders"
        description="Upload a CSV of your orders. Required columns: email, amount, status, created_at. We'll create users automatically if they don't exist."
        icon={ShoppingCart}
        workspaceId={workspaceId}
        isDemoUser={isDemoUser}
      />

      <ImportCard
        type="subscriptions"
        title="Import Subscriptions"
        description="Upload a CSV of your subscriptions. Required columns: email, plan, status, start_date. Users must exist before importing subscriptions."
        icon={CreditCard}
        workspaceId={workspaceId}
        isDemoUser={isDemoUser}
      />
    </div>
  );
}

