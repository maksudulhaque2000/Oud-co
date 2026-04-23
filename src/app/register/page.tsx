"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Name, email and a password of at least 6 characters are required.");
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password });
      router.push("/");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md px-4 py-16">
      <section className="w-full rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-7">
        <h1 className="text-3xl font-bold text-[#f5e6c2]">Create Account</h1>
        <p className="mt-2 text-sm text-[#dccba6]">Join Oud.co and start your fragrance journey.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Display Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
          />

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#c9a84c] px-4 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-[#dccba6]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#eecf8b] hover:text-[#f8ecd0]">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
