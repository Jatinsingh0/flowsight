import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/profile";
import { getWorkspaceInfo } from "@/lib/workspace-info";
import { ProfileCard } from "@/components/settings/profile-card";
import { SecurityCard } from "@/components/settings/security-card";
import { PreferencesCard } from "@/components/settings/preferences-card";
import { WorkspaceCard } from "@/components/settings/workspace-card";

export default async function SettingsPage() {
  const user = await getCurrentUserProfile();
  const workspace = await getWorkspaceInfo();

  if (!user) {
    redirect("/login");
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
          <span>⚙️</span>
          <span>Account Settings</span>
        </div>
        <h1 className="text-4xl font-space-grotesk font-bold leading-tight text-textBase md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-base text-textMuted md:text-lg max-w-2xl mx-auto leading-relaxed">
          Manage your account details and access
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileCard
            name={user.name}
            email={user.email}
            role={user.role}
          />
        </div>
        <SecurityCard email={user.email} />
      </div>

      {workspace && (
        <div className="max-w-2xl">
          <WorkspaceCard workspace={workspace} />
        </div>
      )}

      <PreferencesCard />
    </div>
  );
}

