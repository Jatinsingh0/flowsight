"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  Activity,
  Settings,
  Upload,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  user: {
    email: string;
  } | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu when window resizes to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="md:hidden relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-textBase hover:bg-accent/10 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className="relative w-5 h-5">
          <span
            className={`absolute top-0 left-0 w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? "rotate-45 top-2" : ""
            }`}
          />
          <span
            className={`absolute top-2 left-0 w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute top-4 left-0 w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? "-rotate-45 top-2" : ""
            }`}
          />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 right-0 bg-card border-b border-borderSubtle shadow-lg z-50 transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 max-h-[75vh] overflow-y-auto"
            : "opacity-0 -translate-y-full max-h-0 overflow-hidden"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="text-xl font-space-grotesk font-bold text-textBase"
            >
              FlowSight
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="space-y-4">
            {user ? (
              // Logged In Menu
              <>
                <nav className="space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/users"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  <Link
                    href="/dashboard/subscriptions"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Subscriptions</span>
                  </Link>
                  <Link
                    href="/dashboard/activity"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <Activity className="h-5 w-5" />
                    <span>Activity</span>
                  </Link>
                  <Link
                    href="/dashboard/data-import"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Data Import</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>

                <div className="pt-4 border-t border-borderSubtle space-y-3">
                  <div className="px-4 py-2">
                    <p className="text-xs text-textMuted mb-1">Logged in as</p>
                    <p className="text-sm font-medium text-textBase truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            ) : (
              // Logged Out Menu
              <>
                <nav className="space-y-1">
                  <button
                    onClick={() => handleScrollTo("features")}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <span>Features</span>
                  </button>
                  <button
                    onClick={() => handleScrollTo("how-it-works")}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <span>How it works</span>
                  </button>
                  <button
                    onClick={() => handleScrollTo("demo")}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:text-textBase hover:bg-accent/10 transition-colors"
                  >
                    <span>Demo</span>
                  </button>
                </nav>

                <div className="pt-4 border-t border-borderSubtle space-y-3">
                  <Link href="/login" onClick={handleLinkClick} className="block">
                    <Button className="w-full bg-accent hover:bg-accent-soft text-white">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={handleLinkClick} className="block">
                    <Button
                      variant="outline"
                      className="w-full border-borderSubtle text-textBase hover:bg-accent/10"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

