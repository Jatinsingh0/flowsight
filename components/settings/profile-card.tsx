"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  name: string | null;
  email: string;
  role: string;
}

function getInitials(name?: string | null) {
  if (!name) return "FS";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

export function ProfileCard({ name, email, role }: ProfileCardProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(name || "");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);
    setError(null);

    // Validate name
    const trimmedName = displayName.trim();
    if (trimmedName.length === 0) {
      setError("Name cannot be empty");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/settings/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update profile");
        setIsSaving(false);
        return;
      }

      setStatus("Profile updated successfully");
      setIsSaving(false);
      // Refresh the page to show updated name
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-xl font-semibold text-white">
          {getInitials(displayName || name || null)}
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-textMuted">
            Role
          </p>
          <p className="inline-flex rounded-full border border-borderSubtle/60 bg-card/40 px-3 py-1 text-sm font-medium text-textBase">
            {role}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-textMuted">
            Full name
            <Input
              className="mt-1 bg-card text-textBase"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-textMuted">
            Email address
            <Input
              className="mt-1 cursor-not-allowed bg-card text-textMuted"
              value={email}
              disabled
            />
          </label>
        </div>
        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent-soft text-white"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Update profile"}
        </Button>
        {error && (
          <p className="text-center text-sm text-red-400">{error}</p>
        )}
        {status && (
          <p className="text-center text-sm text-emerald-400">{status}</p>
        )}
      </form>
    </div>
  );
}

