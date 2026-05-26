"use client";

import Link from "next/link";
import { ClipboardList, Menu, ShoppingCart, UserCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading, canManageProducts, canManageUsers, role } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-950/20 bg-[#0f0a06]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-2xl font-bold tracking-wide text-[#d6b36a]">
          Oud.co
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  active ? "text-[#f4dfad]" : "text-[#eadfc3] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-[#d6b36a]/20 bg-[#1a120b]/80 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
            <Link
              href="/cart"
              title="Cart"
              aria-label="Open cart"
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
                pathname === "/cart"
                  ? "bg-[#c9a84c] text-[#1f1300]"
                  : "text-[#f0dca7] hover:bg-[#2a1d12] hover:text-white"
              }`}
            >
              <ShoppingCart size={18} />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d6b36a] px-1 text-[10px] font-bold text-[#1f1300]">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              ) : null}
            </Link>
            <Link
              href="/orders"
              title="Orders"
              aria-label="Open orders"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                pathname === "/orders"
                  ? "bg-[#c9a84c] text-[#1f1300]"
                  : "text-[#f0dca7] hover:bg-[#2a1d12] hover:text-white"
              }`}
            >
              <ClipboardList size={18} />
            </Link>
          </div>

          {!loading && !user ? (
            <>
              <Link
                href="/login"
                className="rounded-md border border-[#d6b36a]/40 px-4 py-2 text-sm font-semibold text-[#f0dca7] transition hover:border-[#d6b36a] hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-[#1f1300] transition hover:bg-[#d6b35e]"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md border border-[#d6b36a]/40 px-3 py-2 text-[#f0dca7] hover:border-[#d6b36a]"
              >
                <UserCircle2 size={18} />
                <span className="max-w-40 truncate text-sm">
                  {user?.displayName || user?.email}
                </span>
              </button>

              {profileOpen ? (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] p-3 shadow-2xl">
                  <p className="truncate text-sm text-[#f7efdb]">{user?.displayName || "User"}</p>
                  <p className="mb-3 truncate text-xs text-[#e7d2a0]">{user?.email}</p>
                  <div className="space-y-2 text-sm">
                    {canManageProducts ? (
                      <>
                        <Link
                          href="/products/add"
                          className="block rounded-md px-3 py-2 text-[#f0dca7] hover:bg-[#2a1d12]"
                          onClick={() => setProfileOpen(false)}
                        >
                          Add Product
                        </Link>
                        <Link
                          href="/products/manage"
                          className="block rounded-md px-3 py-2 text-[#f0dca7] hover:bg-[#2a1d12]"
                          onClick={() => setProfileOpen(false)}
                        >
                          Manage Products
                        </Link>
                        {canManageUsers ? (
                          <Link
                            href="/admin/users"
                            className="block rounded-md px-3 py-2 text-[#f0dca7] hover:bg-[#2a1d12]"
                            onClick={() => setProfileOpen(false)}
                          >
                            Manage Users
                          </Link>
                        ) : null}
                      </>
                    ) : null}
                    <p className="px-3 pt-2 text-xs uppercase tracking-[0.2em] text-[#a89267]">Role: {role}</p>
                    <button
                      type="button"
                      onClick={async () => {
                        await logout();
                        setProfileOpen(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-rose-300 hover:bg-[#2a1d12]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <button
          type="button"
          className="rounded-md border border-[#d6b36a]/40 p-2 text-[#f0dca7] md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#d6b36a]/20 bg-[#120d08] px-4 py-4 md:hidden">
          <div className="mb-4 flex items-center gap-2">
            <Link
              href="/cart"
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
                pathname === "/cart"
                  ? "border-[#d6b36a] bg-[#2a1d12] text-[#f8ecd0]"
                  : "border-[#d6b36a]/20 text-[#eadfc3] hover:bg-[#2a1d12]"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <ShoppingCart size={16} />
              Cart{itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
            <Link
              href="/orders"
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
                pathname === "/orders"
                  ? "border-[#d6b36a] bg-[#2a1d12] text-[#f8ecd0]"
                  : "border-[#d6b36a]/20 text-[#eadfc3] hover:bg-[#2a1d12]"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <ClipboardList size={16} />
              Orders
            </Link>
          </div>

          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm text-[#eadfc3] hover:bg-[#2a1d12]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-[#d6b36a]/20 pt-4">
            {!loading && !user ? (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="w-full rounded-md border border-[#d6b36a]/40 px-4 py-2 text-center text-sm font-semibold text-[#f0dca7]"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full rounded-md bg-[#c9a84c] px-4 py-2 text-center text-sm font-semibold text-[#1f1300]"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="truncate text-sm text-[#f7efdb]">{user?.displayName || user?.email}</p>
                {canManageProducts ? (
                  <>
                    <Link
                      href="/products/add"
                      className="block rounded-md px-3 py-2 text-sm text-[#eadfc3] hover:bg-[#2a1d12]"
                      onClick={() => setMobileOpen(false)}
                    >
                      Add Product
                    </Link>
                    <Link
                      href="/products/manage"
                      className="block rounded-md px-3 py-2 text-sm text-[#eadfc3] hover:bg-[#2a1d12]"
                      onClick={() => setMobileOpen(false)}
                    >
                      Manage Products
                    </Link>
                    {canManageUsers ? (
                      <Link
                        href="/admin/users"
                        className="block rounded-md px-3 py-2 text-sm text-[#eadfc3] hover:bg-[#2a1d12]"
                        onClick={() => setMobileOpen(false)}
                      >
                        Manage Users
                      </Link>
                    ) : null}
                  </>
                ) : null}
                <p className="px-3 pt-2 text-xs uppercase tracking-[0.2em] text-[#a89267]">Role: {role}</p>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-rose-300 hover:bg-[#2a1d12]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
