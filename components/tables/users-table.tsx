"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format";

interface UserTableRow {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "MANAGER" | "USER";
  createdAt: Date;
}

interface UsersTableProps {
  users: UserTableRow[];
}

const roleStyles: Record<
  "ADMIN" | "MANAGER" | "USER",
  { label: string; className: string; dot: string }
> = {
  ADMIN: {
    label: "Admin",
    className: "text-rose-300 bg-rose-500/10 border border-rose-500/30",
    dot: "bg-rose-300",
  },
  MANAGER: {
    label: "Manager",
    className: "text-sky-300 bg-sky-500/10 border border-sky-500/30",
    dot: "bg-sky-300",
  },
  USER: {
    label: "User",
    className: "text-emerald-300 bg-emerald-500/10 border border-emerald-500/30",
    dot: "bg-emerald-300",
  },
};

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = users.filter((user) => {
      if (!term) return true;
      const matchesName = user.name?.toLowerCase().includes(term);
      const matchesEmail = user.email.toLowerCase().includes(term);
      const matchesRole =
        term === "admin" || term === "manager" || term === "user"
          ? user.role.toLowerCase() === term
          : false;
      return Boolean(matchesName || matchesEmail || matchesRole);
    });

    return filtered.sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortDirection === "desc" ? diff : -diff;
    });
  }, [users, search, sortDirection]);

  const handleSortToggle = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-medium text-textBase">Users</h3>
          <p className="text-sm text-textMuted">
            All people who have access to FlowSight
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search name, email, role..."
            className="rounded-lg border border-borderSubtle bg-card/50 px-3 py-2 text-sm text-textBase placeholder:text-textMuted focus:border-accent focus:outline-none"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="rounded-lg border border-borderSubtle px-3 py-2 text-sm text-textMuted hover:border-textMuted/60"
            onClick={handleSortToggle}
            type="button"
          >
            Sort: {sortDirection === "desc" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-textMuted">
            <tr>
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3">Role</th>
              <th className="py-3 text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle/40 text-textBase">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-sm text-textMuted"
                >
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const role = roleStyles[user.role];
                return (
                  <tr key={user.id} className="text-sm">
                    <td className="py-3">
                      <div className="font-medium text-textBase">
                        {user.name ?? "Unnamed"}
                      </div>
                      <div className="text-xs text-textMuted">
                        {user.email}
                      </div>
                    </td>
                    <td className="py-3 text-textMuted">{user.email}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${role.className}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${role.dot}`}
                        />
                        {role.label}
                      </span>
                    </td>
                    <td className="py-3 text-right text-textMuted">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


