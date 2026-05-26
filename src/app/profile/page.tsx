"use client";

import { FormSkeleton } from "@/components/LoadingSkeletons";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchSelfProfile, isBootstrapAdmin, updateSelfProfile } from "@/lib/users";
import { UserCircle2 } from "lucide-react";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
import { useEffect, useState, type FormEvent } from "react";

export default function ProfilePage() {
  const { user, role } = useAuth();
  const { pushToast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchSelfProfile(user.uid);
        if (!active) {
          return;
        }

        setDisplayName(profile?.displayName || user.displayName || "");
        setPhone(profile?.phone || "");
        setAddress(profile?.address || "");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [user?.uid, user?.displayName]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      setSaving(true);
      if (displayName.trim()) {
        await updateFirebaseProfile(user, { displayName: displayName.trim() });
      }

      await updateSelfProfile({
        uid: user.uid,
        email: user.email || "",
        displayName: displayName.trim() || user.displayName || user.email || "User",
        phone: phone.trim(),
        address: address.trim(),
        bootstrapAdmin: isBootstrapAdmin(user),
      });

      pushToast({
        title: "Profile Saved",
        message: "Your profile information has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      pushToast({
        title: "Unable to save profile",
        message: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      {loading ? (
        <FormSkeleton />
      ) : (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6b36a]/20 bg-[#1a120b] text-[#d6b36a]">
            <UserCircle2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#f5e6c2]">My Profile</h1>
            <p className="text-sm text-[#dccba6]">Manage the contact details used automatically during checkout.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-6 md:p-8">
          <div className="rounded-xl border border-[#d6b36a]/15 bg-[#1a120b] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#a89267]">Account Type</p>
            <p className="mt-1 text-sm font-medium text-[#f5e6c2]">{role === "admin" ? "Admin" : "Customer"}</p>
            <p className="mt-1 text-xs text-[#bca475]">This is managed by the system and cannot be changed here.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#f0dca7]">Email</label>
            <input value={user?.email || ""} readOnly className="w-full rounded-lg border border-[#d6b36a]/20 bg-[#1a120b] px-4 py-3 text-[#cdb890] outline-none" />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#f0dca7]">Name</label>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2" placeholder="Your full name" />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#f0dca7]">Mobile Number</label>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2" placeholder="01xxxxxxxxx" inputMode="tel" />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#f0dca7]">Address</label>
            <textarea value={address} onChange={(event) => setAddress(event.target.value)} rows={4} className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2" placeholder="Your delivery address" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="submit" disabled={saving || loading} className="rounded-lg bg-[#c9a84c] px-5 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760] disabled:opacity-60">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </main>
      )}
    </ProtectedRoute>
  );
}