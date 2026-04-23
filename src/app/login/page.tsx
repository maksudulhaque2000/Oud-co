"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.push(next);
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    try {
      setLoading(true);
      await loginWithGoogle();
      router.push(next);
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="w-full rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-7">
        <h1 className="text-3xl font-bold text-[#f5e6c2]">Welcome Back</h1>
        <p className="mt-2 text-sm text-[#dccba6]">Login to manage your products and orders.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
            />
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#c9a84c] px-4 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-3 w-full rounded-lg border border-[#d6b36a]/40 px-4 py-3 font-semibold text-[#f0dca7] transition hover:border-[#d6b36a] disabled:opacity-60"
        >
          Login with Google
        </button>

        <p className="mt-4 text-sm text-[#dccba6]">
          Do not have an account?{" "}
          <Link href="/register" className="text-[#eecf8b] hover:text-[#f8ecd0]">
            Register
          </Link>
        </p>
      </section>
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md px-4 py-16">
      <Suspense fallback={<p className="text-sm text-[#d6b36a]">Loading login form...</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
