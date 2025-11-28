"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ActivityToolbarProps {
  initialType: string;
  initialRange: number;
  initialSearch: string;
  activityTypes: string[];
}

const RANGE_OPTIONS = [
  { label: "Last 24 hours", value: 1 },
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
];

const TYPE_LABELS: Record<string, string> = {
  login: "Logins",
  order: "Orders",
  subscription: "Subscriptions",
  subscription_update: "Upgrades/Downgrades",
  billing: "Billing",
};

export function ActivityToolbar({
  initialType,
  initialRange,
  initialSearch,
  activityTypes,
}: ActivityToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [type, setType] = useState<string>(initialType);
  const [range, setRange] = useState<number>(initialRange);
  const [search, setSearch] = useState<string>(initialSearch);

  const buildQuery = useMemo(() => {
    return {
      update(updates: { type?: string; range?: number; search?: string }) {
        const params = new URLSearchParams(searchParams?.toString() || "");

        if (updates.type !== undefined) {
          if (updates.type === "ALL") {
            params.delete("type");
          } else {
            params.set("type", updates.type);
          }
        }

        if (updates.range !== undefined) {
          params.set("range", String(updates.range));
        }

        if (updates.search !== undefined) {
          if (updates.search.trim()) {
            params.set("search", updates.search.trim());
          } else {
            params.delete("search");
          }
        }

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        const currentUrl = searchParams?.toString()
          ? `${pathname}?${searchParams.toString()}`
          : pathname;

        if (newUrl !== currentUrl) {
          router.replace(newUrl);
        }
      },
    };
  }, [pathname, router, searchParams]);

  useEffect(() => {
    setType(initialType);
    setRange(initialRange);
    setSearch(initialSearch);
  }, [initialType, initialRange, initialSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      buildQuery.update({ search });
    }, 400);
    return () => clearTimeout(timeout);
  }, [buildQuery, search]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent2/5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="flex gap-2">
          <label className="text-xs uppercase tracking-wide text-textMuted">
            Type
            <select
              className="mt-1 w-full rounded-lg border border-borderSubtle bg-card px-3 py-2 text-sm text-textBase focus:border-accent focus:outline-none"
              value={type}
              onChange={(event) => {
                const nextType = event.target.value;
                setType(nextType);
                buildQuery.update({ type: nextType });
              }}
            >
              <option value="ALL">All</option>
              {activityTypes.map((activityType) => (
                <option key={activityType} value={activityType}>
                  {TYPE_LABELS[activityType] || activityType}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-textMuted">
            Date Range
            <select
              className="mt-1 w-full rounded-lg border border-borderSubtle bg-card px-3 py-2 text-sm text-textBase focus:border-accent focus:outline-none"
              value={range}
              onChange={(event) => {
                const nextRange = Number(event.target.value);
                setRange(nextRange);
                buildQuery.update({ range: nextRange });
              }}
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex flex-1 flex-col text-xs uppercase tracking-wide text-textMuted">
          Search
          <input
            type="text"
            placeholder="Search by user name or email"
            className="mt-1 w-full rounded-lg border border-borderSubtle bg-card px-3 py-2 text-sm text-textBase placeholder:text-textMuted focus:border-accent focus:outline-none"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-lg border border-borderSubtle px-4 py-2 text-sm text-textMuted hover:border-textMuted/60"
          onClick={() => {
            setType("ALL");
            setRange(30);
            setSearch("");
            buildQuery.update({ type: "ALL", range: 30, search: "" });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

