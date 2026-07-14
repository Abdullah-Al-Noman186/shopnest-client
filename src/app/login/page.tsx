"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState(
    searchParams.get("registered") ? "Account created. Please log in." : ""
  );
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setMessage("");
  setIsLoading(true);
  setIsError(false);

  const formData = new FormData(e.currentTarget);

  try {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setIsError(true);
      setMessage(data.message || "Login failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  } catch (error) {
    console.error(error);
    setIsError(true);
    setMessage("Cannot connect to the server. Please make sure the backend is running.");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="font-semibold text-green-700">WELCOME BACK</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Sign in to ShopNest
        </h1>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
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
            placeholder="Password"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
          />

          {message && (
            <p
              className={`rounded-lg p-3 text-sm font-medium ${
                isError
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-800"
              }`}
            >
              {message}
            </p>
          )}

          <button
            disabled={isLoading}
            className="rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          New to ShopNest?{" "}
          <Link
            href="/register"
            className="font-semibold text-green-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}