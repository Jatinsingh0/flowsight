"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoutButton } from "@/components/layout/logout-button";
import { Eye, EyeOff } from "lucide-react";

interface SecurityCardProps {
  email: string;
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="w-full text-xs uppercase tracking-wide text-textMuted">
      {label}
      <div className="relative mt-1">
        <Input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pr-10 bg-card text-textBase"
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-textMuted hover:text-textBase"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

export function SecurityCard({ email }: SecurityCardProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/settings/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to update password");
      } else {
        setStatus("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent2/5">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-textMuted">
            Session
          </p>
          <p className="text-lg font-semibold text-textBase">Logged in as</p>
          <p className="text-sm text-textMuted">{email}</p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>

        <div className="border-t border-borderSubtle/50 pt-4">
          <p className="text-sm font-semibold text-textBase">
            Change password
          </p>
          <p className="text-xs text-textMuted">
            Keep your account secure with a strong password.
          </p>
          <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
            <PasswordField
              label="Current password"
              placeholder="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <PasswordField
              label="New password"
              placeholder="New password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <PasswordField
              label="Confirm new password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent-soft text-white"
              disabled={isSaving}
            >
              {isSaving ? "Updating..." : "Update password"}
            </Button>
          </form>
          {error && (
            <p className="mt-2 text-center text-sm text-red-400">{error}</p>
          )}
          {status && (
            <p className="mt-2 text-center text-sm text-emerald-400">
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

