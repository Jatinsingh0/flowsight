"use client";

import { Info, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DemoModeBanner() {
  return (
    <div className="border-b border-borderSubtle bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-2.5">
          <div className="flex items-center gap-3 flex-1">
            <Info className="h-4 w-4 shrink-0 text-yellow-400" />
            <p className="text-sm text-textBase">
              <span className="font-semibold text-yellow-400">Demo Mode</span> – Data shown is sample/demo data from the database. In a real setup, Import your own data via CSV to see your real analytics.
            </p>
          </div>
          <Link href="/dashboard/data-import">
            <Button
              size="sm"
              className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 group"
            >
              <Upload className="mr-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
              Import CSV Data
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

