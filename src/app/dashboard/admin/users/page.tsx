"use client";

import { useEffect, useState } from "react";
import { Shield, Trash2, UserX, UserCheck, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "blocked";
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function fetchUsers() {
    setIsLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleBlock(id: string) {
    setActionId(id);
    try {
      const res = await apiFetch(`/api/users/${id}/block`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "blocked" } : u))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to block user.");
    } finally {
      setActionId(null);
    }
  }

  async function handleUnblock(id: string) {
    setActionId(id);
    try {
      const res = await apiFetch(`/api/users/${id}/unblock`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "active" } : u))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unblock user.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    setActionId(id);
    try {
      const res = await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setActionId(null);
      setConfirmDelete(null);
    }
  }

  const buyers = users.filter((u) => u.role === "buyer");
  const sellers = users.filter((u) => u.role === "seller");
  const admins = users.filter((u) => u.role === "admin");

  if (isLoading) {
    return (
      <section>
        <p className="font-semibold text-green-700">ADMIN</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">All Users</h1>
        <div className="mt-8 grid gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-green-700">ADMIN</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">All Users</h1>
          <p className="mt-1 text-slate-600">{users.length} total users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Buyers", count: buyers.length, color: "bg-blue-100 text-blue-800" },
          { label: "Sellers", count: sellers.length, color: "bg-green-100 text-green-800" },
          { label: "Admins", count: admins.length, color: "bg-purple-100 text-purple-800" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${stat.color}`}
            >
              {stat.label}
            </span>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Users table */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="hidden grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500 md:grid">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <ul className="divide-y divide-slate-100">
          {users.map((user) => (
            <li key={user.id} className="px-5 py-4">
              <div className="grid items-center gap-3 md:grid-cols-[2fr_2fr_1fr_1fr_auto]">
                {/* Name + avatar */}
                <div className="flex items-center gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-green-700 text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-900">
                    {user.name}
                  </span>
                </div>

                {/* Email */}
                <span className="truncate text-sm text-slate-600">
                  {user.email}
                </span>

                {/* Role */}
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "seller"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>

                {/* Status */}
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {user.role !== "admin" && (
                    <>
                      {user.status === "active" ? (
                        <button
                          type="button"
                          onClick={() => handleBlock(user.id)}
                          disabled={actionId === user.id}
                          className="flex items-center gap-1.5 rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
                        >
                          <UserX size={13} />
                          Block
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUnblock(user.id)}
                          disabled={actionId === user.id}
                          className="flex items-center gap-1.5 rounded-lg border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50"
                        >
                          <UserCheck size={13} />
                          Unblock
                        </button>
                      )}

                      {confirmDelete === user.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            disabled={actionId === user.id}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {actionId === user.id ? "Deleting..." : "Confirm"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(user.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      )}
                    </>
                  )}

                  {user.role === "admin" && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Shield size={13} />
                      Protected
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}