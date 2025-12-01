import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with FlowSight branding */}
      <header className="border-b border-borderSubtle bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-space-grotesk font-bold bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              FlowSight
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <Suspense fallback={<div className="text-textBase">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

