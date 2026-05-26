"use client";

import { AuthGateSkeleton } from "@/components/LoadingSkeletons";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { user, loading, canManageProducts } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdminBlocked = requireAdmin && Boolean(user) && !canManageProducts;

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return <AuthGateSkeleton />;
  }

  if (isAdminBlocked) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center px-4 py-16 md:px-6">
        <section className="w-full rounded-2xl border border-rose-400/20 bg-[#130e0a] p-6">
          <h1 className="text-2xl font-bold text-[#f5e6c2]">Access Restricted</h1>
          <p className="mt-2 text-sm text-[#dccba6]">
            You are signed in, but your account is not allowed to manage products.
          </p>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
