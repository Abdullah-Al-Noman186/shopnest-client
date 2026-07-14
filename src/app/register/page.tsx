"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password,
        role: formData.get("role"),
      }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="font-semibold text-green-700">JOIN SHOPNEST</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
          <input
            name="name"
            required
            placeholder="Full name"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
          />
          <input
            name="email"
            required
            type="email"
            placeholder="Email address"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
          />
          <input
            name="password"
            required
            type="password"
            placeholder="Password (minimum 8 characters)"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
          />
          <input
            name="confirmPassword"
            required
            type="password"
            placeholder="Confirm password"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
          />

          <select
            name="role"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
          >
            <option value="buyer">Join as a Buyer</option>
            <option value="seller">Join as a Seller</option>
          </select>

          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            disabled={isLoading}
            className="rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-green-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}