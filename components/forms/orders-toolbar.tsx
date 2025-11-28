"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OrderStatus } from "@prisma/client";

interface OrdersToolbarProps {
  initialStatus: OrderStatus | "ALL";
  initialRange: number;
  initialSearch: string;
}

const STATUS_OPTIONS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Paid", value: OrderStatus.COMPLETED },
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];

const RANGE_OPTIONS = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
];

export function OrdersToolbar({
  initialStatus,
  initialRange,
  initialSearch,
}: OrdersToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<OrderStatus | "ALL">(initialStatus);
  const [range, setRange] = useState<number>(initialRange);
  const [search, setSearch] = useState<string>(initialSearch);

  const updateQuery = useCallback(
    (updates: {
      status?: OrderStatus | "ALL";
      range?: number;
      search?: string;
    }) => {
      const params = new URLSearchParams(searchParams?.toString());
      const currentQuery = params.toString();

      if (updates.status !== undefined) {
        if (updates.status === "ALL") {
          params.delete("status");
        } else {
          params.set("status", updates.status);
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

      const nextQuery = params.toString();
      if (nextQuery === currentQuery) {
        return;
      }

      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    setStatus(initialStatus);
    setRange(initialRange);
    setSearch(initialSearch);
  }, [initialStatus, initialRange, initialSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateQuery({ search });
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, updateQuery]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="flex gap-2">
          <label className="text-xs uppercase tracking-wide text-textMuted">
            Status
            <select
              className="mt-1 w-full rounded-lg border border-borderSubtle bg-card px-3 py-2 text-sm text-textBase focus:border-accent focus:outline-none"
              value={status}
              onChange={(event) => {
                const nextStatus = event.target.value as OrderStatus | "ALL";
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
            Date Range
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
        </div>
        <label className="flex flex-1 flex-col text-xs uppercase tracking-wide text-textMuted">
          Search
          <input
            type="text"
            placeholder="Search by customer name or email"
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
              setStatus("ALL");
              setRange(30);
              setSearch("");
              updateQuery({ status: "ALL", range: 30, search: "" });
            }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}


