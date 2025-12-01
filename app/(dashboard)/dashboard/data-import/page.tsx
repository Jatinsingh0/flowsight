import { getCurrentUser } from "@/lib/auth";
import { getCurrentUserWorkspace } from "@/lib/workspace";
import { redirect } from "next/navigation";
import { DataImportClient } from "@/components/data-import/data-import-client";
import { prisma } from "@/lib/prisma";

export default async function DataImportPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const workspace = await getCurrentUserWorkspace(user.userId);
  
  // Check if workspace has actual IMPORTED data (not just the logged-in user)
  let hasImportedData = false;
  if (workspace) {
    const [hasOrders, totalUsers, hasSubscriptions] = await Promise.all([
      prisma.order.count({ where: { workspaceId: workspace.id } }),
      prisma.user.count({ where: { workspaceId: workspace.id } }),
      prisma.subscription.count({ where: { workspaceId: workspace.id } }),
    ]);

    // Check if there are imported users (excluding the logged-in user)
    const hasImportedUsers = totalUsers > 1;
    hasImportedData = hasOrders > 0 || hasSubscriptions > 0 || hasImportedUsers;
  }

  return (
    <div className="relative space-y-8 pb-8">
      {/* Background gradient effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-accent2/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Header Section */}
      <div className="relative mx-auto max-w-4xl text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
          <span>📥</span>
          <span>Data Import</span>
        </div>
        <h1 className="text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl">
          Data Import{" "}
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            (CSV)
          </span>
        </h1>
        <p className="text-base text-textMuted md:text-lg max-w-2xl mx-auto leading-relaxed">
          Upload your users, orders, and subscriptions as CSV files to turn FlowSight into a live dashboard for your business.
        </p>

        {/* Mode Banner */}
        {workspace && (
          <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            hasImportedData
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/20 bg-amber-500/10 text-amber-300"
          }`}>
            {hasImportedData ? (
              <span>✅ Real Data — You are viewing analytics built from your imported CSV files.</span>
            ) : (
              <span>ℹ️ Currently viewing demo data. Once you import your CSV files, you'll see only your imported data and demo data will be hidden.</span>
            )}
          </div>
        )}
      </div>

      {/* Import Cards */}
      <DataImportClient workspaceId={workspace?.id || ""} />
    </div>
  );
}

