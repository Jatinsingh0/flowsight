import { Navbar } from "@/components/layout/navbar";
import { DemoModeBanner } from "@/components/home/demo-mode-banner";
import { shouldShowDemoBanner } from "@/lib/workspace-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showBanner = await shouldShowDemoBanner();

  return (
    <div className="min-h-screen bg-background text-textBase">
      <Navbar />
      {showBanner && <DemoModeBanner />}
      <main className="p-6">{children}</main>
    </div>
  );
}

