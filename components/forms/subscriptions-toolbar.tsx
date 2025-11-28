"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SubscriptionStatus } from "@prisma/client";

interface SubscriptionsToolbarProps {
  initialStatus: SubscriptionStatus | "ALL";
  initialPlan: string | "ALL";
  initialRange: number;
  initialSearch: string;
  planOptions: string[];
}

const STATUS_OPTIONS: { label: string; value: SubscriptionStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: SubscriptionStatus.ACTIVE },
  { label: "Canceled", value: SubscriptionStatus.CANCELLED },
  { label: "Expired", value: SubscriptionStatus.EXPIRED },
];

const RANGE_OPTIONS = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 60 days", value: 60 },
  { label: "Last 90 days", value: 90 },
];

export function SubscriptionsToolbar({
  initialStatus,
  initialPlan,
  initialRange,
  initialSearch,
  planOptions,
}: SubscriptionsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<SubscriptionStatus | "ALL">(
    initialStatus
  );
  const [plan, setPlan] = useState<string | "ALL">(initialPlan);
  const [range, setRange] = useState<number>(initialRange);
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    setStatus(initialStatus);
    setPlan(initialPlan);
    setRange(initialRange);
    setSearch(initialSearch);
  }, [initialStatus, initialPlan, initialRange, initialSearch]);

  const updateQuery = useCallback(
    (updates: {
      status?: SubscriptionStatus | "ALL";
      plan?: string | "ALL";
      range?: number;
      search?: string;
    }) => {
      const params = new URLSearchParams(searchParams?.toString());
      const before = params.toString();

      if (updates.status !== undefined) {
        if (updates.status === "ALL") {
          params.delete("status");
        } else {
          params.set("status", updates.status);
        }
      }

      if (updates.plan !== undefined) {
        if (!updates.plan || updates.plan === "ALL") {
          params.delete("plan");
        } else {
          params.set("plan", updates.plan);
        }
      }

      if (updates.range !== undefined) {
        params.set("range", String(updates.range));
      }

      if (updates.search !== undefined) {
        const value = updates.search.trim();
        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }
      }

      const after = params.toString();
      if (before === after) {
        return;
      }

      router.replace(after ? `${pathname}?${after}` : pathname);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateQuery({ search });
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, updateQuery]);

  const planOptionsWithAll = useMemo(
    () => ["ALL", ...planOptions.filter(Boolean)],
    [planOptions]
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        <div className="flex gap-2">
          <label className="text-xs uppercase tracking-wide text-textMuted">
            Status
            <select
              className="mt-1 w-full rounded-lg border border-borderSubtle bg-card px-3 py-2 text-sm text-textBase focus:border-accent focus:outline-none"
              value={status}
              onChange={(event) => {
                const nextStatus = event.target.value as SubscriptionStatus | "ALL";
                setStatus(nextStatus);
                updateQuery({ status: nextStatus });
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs uppercase tracking-wide text-textMuted">
            Plan
            <select
              className="mt-1 w-full rounded-lg border border-borderSubtle bg-card px-3 py-2 text-sm text-textBase focus:border-accent focus:outline-none"
              value={plan}
              onChange={(event) => {
                const nextPlan = event.target.value as string | "ALL";
                setPlan(nextPlan);
                updateQuery({ plan: nextPlan });
              }}
            >
              {planOptionsWithAll.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "All plans" : option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex gap-2">
          <label className="text-xs uppercase tracking-wide text-textMuted">
            Date range
            <select
              className="mt-1 w-full rounded-lg border border-borderSubtle bg-card px-3 py-2 text-sm text-textBase focus:border-accent focus:outline-none"
              value={range}
              onChange={(event) => {
                const nextRange = Number(event.target.value);
                setRange(nextRange);
                updateQuery({ range: nextRange });
              }}
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-1 flex-col text-xs uppercase tracking-wide text-textMuted">
            Search
            <input
              type="text"
              placeholder="Search customers"
              className="mt-1 w-full rounded-lg border border-borderSubtle bg-card px-3 py-2 text-sm text-textBase placeholder:text-textMuted focus:border-accent focus:outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-lg border border-borderSubtle px-4 py-2 text-sm text-textMuted hover:border-textMuted/60"
          onClick={() => {
            setStatus("ALL");
            setPlan("ALL");
            setRange(30);
            setSearch("");
            updateQuery({ status: "ALL", plan: "ALL", range: 30, search: "" });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}


