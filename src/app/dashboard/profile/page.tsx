"use client";

import { useEffect, useState, FormEvent } from "react";
import { Camera, KeyRound, Save, AlertCircle, CheckCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await apiFetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
          setAvatar(data.user.avatar ?? "");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchMe();
  }, []);

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setProfileMsg("");
    setProfileLoading(true);

    try {
      const res = await apiFetch("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, email, avatar }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setUser((prev) => (prev ? { ...prev, name, email, avatar } : prev));
      setProfileSuccess(true);
      setProfileMsg(data.message);
    } catch (err) {
      setProfileSuccess(false);
      setProfileMsg(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordMsg("");

    if (newPassword !== confirmPassword) {
      setPasswordSuccess(false);
      setPasswordMsg("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await apiFetch("/api/users/change-password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setPasswordSuccess(true);
      setPasswordMsg(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordSuccess(false);
      setPasswordMsg(
        err instanceof Error ? err.message : "Password change failed."
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  if (isLoading) {
    return (
      <section className="max-w-2xl">
        <p className="font-semibold text-green-700">ACCOUNT</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">My Profile</h1>
        <div className="mt-8 grid gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-14 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="max-w-2xl">
      <p className="font-semibold text-green-700">ACCOUNT</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">My Profile</h1>

      {/* Avatar preview */}
      <div className="mt-6 flex items-center gap-4">
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt={user.name}
              className="size-20 rounded-full object-cover ring-2 ring-green-200"
            />
          ) : (
            <div className="grid size-20 place-items-center rounded-full bg-green-700 text-2xl font-bold text-white ring-2 ring-green-200">
              {initials}
            </div>
          )}
          <span className="absolute bottom-0 right-0 grid size-6 place-items-center rounded-full bg-green-700 text-white ring-2 ring-white">
            <Camera size={12} />
          </span>
        </div>
        <div>
          <p className="font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm capitalize text-green-700">{user.role}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* Profile form */}
      <form
        onSubmit={handleProfileSubmit}
        className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <Save size={18} className="text-green-700" />
          Edit Profile
        </h2>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              Full Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              Email Address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              Avatar URL
            </span>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
            <span className="text-xs text-slate-400">
              Paste a direct image URL to use as your profile photo.
            </span>
          </label>

          {profileMsg && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${
                profileSuccess
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {profileSuccess ? (
                <CheckCircle size={15} />
              ) : (
                <AlertCircle size={15} />
              )}
              {profileMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className="rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Password form */}
      <form
        onSubmit={handlePasswordSubmit}
        className="mt-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <KeyRound size={18} className="text-green-700" />
          Change Password
        </h2>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              Current Password
            </span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current password"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              New Password
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Minimum 8 characters"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              Confirm New Password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat new password"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </label>

          {passwordMsg && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${
                passwordSuccess
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {passwordSuccess ? (
                <CheckCircle size={15} />
              ) : (
                <AlertCircle size={15} />
              )}
              {passwordMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>

      {/* Read-only info */}
      <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-900">Account Info</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Role</dt>
            <dd className="mt-1 capitalize font-semibold text-slate-900">
              {user.role}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="mt-1 font-semibold text-green-700 capitalize">
              {user.status}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}