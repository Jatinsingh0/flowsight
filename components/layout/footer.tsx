import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-borderSubtle bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-space-grotesk font-bold text-textBase">
                FlowSight
              </span>
            </Link>
            <p className="mt-2 text-sm text-textMuted">
              © {new Date().getFullYear()} FlowSight. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-textMuted hover:text-textBase transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/#features"
              className="text-sm text-textMuted hover:text-textBase transition-colors"
            >
              Features
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-textMuted hover:text-textBase transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

