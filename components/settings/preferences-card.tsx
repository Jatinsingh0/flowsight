"use client";

import { useState } from "react";

interface ToggleOption {
  label: string;
  description: string;
  key: string;
}

const NOTIFICATION_OPTIONS: ToggleOption[] = [
  {
    label: "Email alerts",
    description: "Important account updates and security notices",
    key: "emailAlerts",
  },
  {
    label: "Billing reminders",
    description: "Invoices and payment confirmations",
    key: "billingReminders",
  },
  {
    label: "Product updates",
    description: "New FlowSight features and improvements",
    key: "productUpdates",
  },
];

export function PreferencesCard() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    emailAlerts: true,
    billingReminders: true,
    productUpdates: false,
    darkMode: true,
  });

  const togglePreference = (key: string) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="rounded-2xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-textBase">
          Preferences
        </h3>
        <p className="text-sm text-textMuted">
          Control how FlowSight communicates with you.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {NOTIFICATION_OPTIONS.map((option) => (
          <label
            key={option.key}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-borderSubtle/60 bg-card/40 p-4"
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-borderSubtle bg-card text-accent"
              checked={preferences[option.key]}
              onChange={() => togglePreference(option.key)}
            />
            <div>
              <p className="text-sm font-medium text-textBase">{option.label}</p>
              <p className="text-xs text-textMuted">{option.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-borderSubtle/60 bg-card/40 p-4">
        <p className="text-sm font-medium text-textBase">Theme</p>
        <p className="text-xs text-textMuted">
          FlowSight currently runs in dark mode for a cinematic feel.
        </p>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-borderSubtle px-3 py-1 text-xs text-textMuted"
          onClick={() => togglePreference("darkMode")}
        >
          {preferences.darkMode ? "Dark mode enabled" : "Enable dark mode"}
        </button>
      </div>
    </div>
  );
}

