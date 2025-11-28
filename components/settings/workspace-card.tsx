import { Building2, Calendar, Users, ShoppingCart, CreditCard } from "lucide-react";
import { WorkspaceInfo } from "@/lib/workspace-info";

interface WorkspaceCardProps {
  workspace: WorkspaceInfo;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const isRealMode = workspace.mode === "Real";

  return (
    <div className="rounded-2xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2.5">
            <Building2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textBase">My Workspace</h3>
            <p className="text-sm text-textMuted">{workspace.name}</p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isRealMode
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
          }`}
        >
          {workspace.mode} Mode
        </div>
      </div>

      <div className="space-y-4">
        {/* Mode and Real Data Since */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-textMuted">
            <span className="font-medium text-textBase">Mode:</span>
            <span>{workspace.mode}</span>
          </div>
          {isRealMode && workspace.realDataSince && (
            <div className="flex items-center gap-2 text-sm text-textMuted">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="font-medium text-textBase">Real data since:</span>
              <span>{formatDate(workspace.realDataSince)}</span>
            </div>
          )}
        </div>

        {/* Data Summary */}
        <div className="pt-4 border-t border-borderSubtle">
          <h4 className="text-sm font-semibold text-textBase mb-3">Data Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-textMuted">
                <Users className="h-4 w-4" />
                <span className="text-xs">Users</span>
              </div>
              <span className="text-lg font-semibold text-textBase">
                {workspace.dataSummary.users}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-textMuted">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs">Orders</span>
              </div>
              <span className="text-lg font-semibold text-textBase">
                {workspace.dataSummary.orders}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-textMuted">
                <CreditCard className="h-4 w-4" />
                <span className="text-xs">Subscriptions</span>
              </div>
              <span className="text-lg font-semibold text-textBase">
                {workspace.dataSummary.subscriptions}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

