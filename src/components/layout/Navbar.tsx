"use client";

import Link from "next/link";
import {
  Menu, ShoppingBag, X, ChevronDown,
  User, Package, Heart, LogOut, Settings,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { CurrentUser } from "@/lib/current-user";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const dropdownItems = [
  { href: "/dashboard", label: "Dashboard", icon: User },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/orders", label: "My Orders", icon: Package },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

type Props = {
  user: CurrentUser | null;
};

// Animation variants
const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
};

export default function Navbar({ user }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, router]);

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container-page flex h-18 items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="grid size-9 place-items-center rounded-xl bg-green-800 text-white"
          >
            <ShoppingBag size={19} />
          </motion.span>
          Shop<span className="text-green-700">Nest</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-medium text-slate-600 transition-colors hover:text-green-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-700 after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right — auth */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span className="grid size-8 place-items-center rounded-full bg-green-700 text-sm font-bold text-white">
                  {initials}
                </span>
                <span className="max-w-[120px] truncate font-semibold text-slate-800">
                  {user.name.split(" ")[0]}
                </span>
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={15} className="text-slate-400" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60"
                    role="menu"
                  >
                    {/* User info */}
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold capitalize text-green-800">
                        {user.role}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="py-1.5">
                      {dropdownItems.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-800"
                          role="menuitem"
                        >
                          <Icon size={16} className="text-slate-400" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-slate-100 py-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        role="menuitem"
                      >
                        {isLoggingOut ? (
                          <span className="inline-block size-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                        ) : (
                          <LogOut size={16} />
                        )}
                        {isLoggingOut ? "Signing out…" : "Sign out"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-green-700 px-4 py-2 font-semibold text-white transition hover:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 md:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu with AnimatePresence */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="border-t border-slate-200 bg-white md:hidden overflow-hidden"
          >
            <div className="container-page flex flex-col gap-2 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-green-50 hover:text-green-800"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-1 border-t border-slate-100" />

              {user ? (
                <>
                  {/* Mobile user info */}
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-700 font-bold text-white">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{user.name}</p>
                      <p className="truncate text-xs capitalize text-green-700">{user.role}</p>
                    </div>
                  </div>

                  {dropdownItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-green-50 hover:text-green-800"
                    >
                      <Icon size={16} className="text-slate-400" />
                      {label}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {isLoggingOut ? (
                      <span className="inline-block size-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <LogOut size={16} />
                    )}
                    {isLoggingOut ? "Signing out…" : "Sign out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg bg-green-700 px-4 py-3 text-center font-semibold text-white"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}