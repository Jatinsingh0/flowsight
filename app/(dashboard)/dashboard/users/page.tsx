import { StatCard } from "@/components/cards/stat-card";
import { UsersTable } from "@/components/tables/users-table";
import { getAllUsers, getUserStats } from "@/lib/users";
import { Users, Shield, UserCog, UserPlus } from "lucide-react";

export default async function UsersPage() {
  const [stats, users] = await Promise.all([getUserStats(), getAllUsers()]);

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
          <span>👥</span>
          <span>User Management</span>
        </div>
        <h1 className="text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            Users
          </span>
        </h1>
        <p className="text-base text-textMuted md:text-lg max-w-2xl mx-auto leading-relaxed">
          Manage the people who have access to your product
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="Across your workspace"
          icon={Users}
          iconColor="accent"
        />
        <StatCard
          title="Admins"
          value={stats.adminCount.toString()}
          subtitle="Full access"
          icon={Shield}
          iconColor="accent2"
        />
        <StatCard
          title="Managers"
          value={stats.managerCount.toString()}
          subtitle="Team leads"
          icon={UserCog}
          iconColor="accent"
        />
        <StatCard
          title="New this month"
          value={stats.newThisMonth.toString()}
          subtitle="Joined in last 30 days"
          icon={UserPlus}
          iconColor="accent2"
        />
      </div>

      <UsersTable users={users} />
    </div>
  );
}

