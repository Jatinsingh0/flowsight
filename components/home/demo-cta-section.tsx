"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";

function CredentialField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-borderSubtle bg-card/50 p-3">
      <div className="flex-1 text-left">
        <p className="text-xs text-textMuted mb-1">{label}</p>
        <p className="text-sm font-mono text-textBase font-medium">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-borderSubtle bg-card hover:bg-card/80 transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-accent" />
        ) : (
          <Copy className="h-4 w-4 text-textMuted" />
        )}
      </button>
    </div>
  );
}

export function DemoCTASection() {
  return (
    <section id="demo" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-borderSubtle bg-gradient-to-br from-card via-card/80 to-card p-8 md:p-12 text-center shadow-xl">
          <h2 className="mb-4 text-3xl font-space-grotesk font-bold text-textBase md:text-4xl">
            Try the Live Demo
          </h2>
          <p className="mb-8 text-lg text-textMuted">
            Log in with demo credentials and explore a full SaaS analytics dashboard.
          </p>

          {/* Demo Credentials */}
          <div className="mb-8 space-y-3 text-left">
            <p className="text-sm font-medium text-textBase mb-3">Demo Credentials:</p>
            <CredentialField label="Email" value="admin@flowsight.dev" />
            <CredentialField label="Password" value="Admin123" />
          </div>

          <Link href="/login">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent-soft text-white px-8 py-6 text-base font-medium group mb-4"
            >
              Open Demo
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <p className="text-xs text-textMuted">
            No credit card required • Instant access • Full feature demo
          </p>
        </div>
      </div>
    </section>
  );
}

