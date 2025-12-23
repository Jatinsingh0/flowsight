import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DemoModeBanner } from "@/components/home/demo-mode-banner";
import { shouldShowDemoBanner } from "@/lib/workspace-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showBanner = await shouldShowDemoBanner();

  return (
    <div className="min-h-screen bg-background text-textBase flex flex-col">
      <Navbar />
      {showBanner && <DemoModeBanner />}
      <main className="flex-1 p-6">{children}</main>
      <Footer />
    </div>
  );
}

