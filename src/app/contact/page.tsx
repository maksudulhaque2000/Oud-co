"use client";

import { FormEvent, useState } from "react";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/context/ToastContext";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const profileLinks = [
  { href: "https://maksudul-haque.vercel.app/", label: "Portfolio" },
  { href: "https://github.com/maksudulhaque2000", label: "GitHub" },
  { href: "https://www.linkedin.com/in/maksudulhaque2000/", label: "LinkedIn" },
  { href: "https://www.facebook.com/maksudulhaque2000", label: "Facebook" },
  { href: "https://www.instagram.com/maksudulhaque2000/", label: "Instagram" },
  { href: "https://www.youtube.com/@maksudulhaque2000", label: "YouTube" },
  { href: "https://www.threads.com/@maksudulhaque2000", label: "Threads" },
  { href: "https://x.com/smmaksudulhaque", label: "X (Twitter)" },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const { pushToast } = useToast();

  function validate() {
    const nextErrors: Partial<FormState> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email is required to contact you back.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please provide a valid email address.";
    }
    if (!form.subject.trim()) {
      nextErrors.subject = "Please write a subject for your message.";
    }
    if (!form.message.trim()) {
      nextErrors.message = "Message cannot be empty.";
    } else if (form.message.trim().length < 12) {
      nextErrors.message = "Please write at least 12 characters in your message.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      pushToast({
        title: "Message Not Sent",
        message: "Please fix the highlighted fields and try again.",
        variant: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((resolve) => {
        window.setTimeout(resolve, 700);
      });

      setForm(initialState);
      setErrors({});
      pushToast({
        title: "Message Sent",
        message: "Thank you. We received your message and will reply shortly.",
        variant: "success",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
      <section className="mb-8 rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-8 md:p-10">
        <h1 className="text-4xl font-bold text-[#f5e6c2]">Contact Us</h1>
        <p className="mt-3 max-w-2xl text-[#dccba6]">
          Have a question about attars, wholesale, or support? Send us a message and our team will
          get back to you quickly.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-[#f5e6c2]">Send a Message</h2>
          <p className="mt-2 text-sm text-[#dccba6]">All fields are required.</p>

          <div className="mt-6 grid gap-4">
            <div>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Full Name"
                className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
              />
              {errors.name ? <p className="mt-1 text-xs text-rose-300">{errors.name}</p> : null}
            </div>

            <div>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email Address"
                className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
              />
              {errors.email ? <p className="mt-1 text-xs text-rose-300">{errors.email}</p> : null}
            </div>

            <div>
              <input
                value={form.subject}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                placeholder="Subject"
                className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
              />
              {errors.subject ? <p className="mt-1 text-xs text-rose-300">{errors.subject}</p> : null}
            </div>

            <div>
              <textarea
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                placeholder="Write your message"
                rows={5}
                className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
              />
              {errors.message ? <p className="mt-1 text-xs text-rose-300">{errors.message}</p> : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-fit rounded-lg bg-[#c9a84c] px-5 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760] disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        <aside className="space-y-4 rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#f5e6c2]">Contact Information</h2>
          <p className="text-sm text-[#dccba6]">
            Our support desk is available every day for product guidance and order support.
          </p>

          <div className="space-y-3 pt-2 text-sm text-[#e4d4b2]">
            <div className="flex items-start gap-3 rounded-lg border border-[#d6b36a]/20 bg-[#1c140f] p-3">
              <Mail size={18} className="mt-0.5 text-[#eecf8b]" />
              <div>
                <p className="font-semibold text-[#f5e6c2]">Email</p>
                <p>support@oud.co</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#d6b36a]/20 bg-[#1c140f] p-3">
              <Phone size={18} className="mt-0.5 text-[#eecf8b]" />
              <div>
                <p className="font-semibold text-[#f5e6c2]">Phone</p>
                <p>+880 1700-000000</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#d6b36a]/20 bg-[#1c140f] p-3">
              <MapPin size={18} className="mt-0.5 text-[#eecf8b]" />
              <div>
                <p className="font-semibold text-[#f5e6c2]">Address</p>
                <p>Banani, Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#d6b36a]/20 bg-[#1c140f] p-3">
              <Clock3 size={18} className="mt-0.5 text-[#eecf8b]" />
              <div>
                <p className="font-semibold text-[#f5e6c2]">Working Hours</p>
                <p>Saturday - Thursday, 10:00 AM - 8:00 PM</p>
              </div>
            </div>

            <div className="rounded-lg border border-[#d6b36a]/20 bg-[#1c140f] p-3">
              <p className="mb-3 font-semibold text-[#f5e6c2]">Connect Online</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {profileLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-[#d6b36a]/25 px-2.5 py-1.5 text-[#e0cfa9] transition hover:border-[#d6b36a] hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
