import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-borderSubtle bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-space-grotesk font-bold bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              FlowSight
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <NavLinks userEmail={user.email} />
                <UserMenu userEmail={user.email} />
              </>
            ) : (
              <>
                <Link
                  href="/#features"
                  className="text-sm text-textMuted hover:text-textBase transition-colors"
                >
                  Features
                </Link>
                <a
                  href="#demo"
                  className="text-sm text-textMuted hover:text-textBase transition-colors"
                >
                  Demo
                </a>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-textBase hover:bg-accent/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-accent hover:bg-accent-soft text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu user={user ? { email: user.email } : null} />
        </div>
      </div>
    </nav>
  );
}

