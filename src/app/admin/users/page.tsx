"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchUserProfiles, updateUserRole } from "@/lib/users";
import { UserProfile, UserRole } from "@/types/user";
import { useEffect, useState } from "react";

const roleOptions: UserRole[] = ["customer", "admin"];

export default function ManageUsersPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const nextUsers = await fetchUserProfiles();
        if (!active) {
          return;
        }

        setUsers(nextUsers);
        setError(null);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load users.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  async function handleRoleChange(targetUid: string, nextRole: UserRole) {
    if (!user) {
      return;
    }

    try {
      setSavingUid(targetUid);
      await updateUserRole(targetUid, nextRole, user.uid);
      setUsers((current) => current.map((item) => (item.uid === targetUid ? { ...item, role: nextRole } : item)));
      pushToast({
        title: "User Updated",
        message: "Role has been saved successfully.",
        variant: "success",
      });
    } catch (updateError) {
      pushToast({
        title: "Update Failed",
        message: updateError instanceof Error ? updateError.message : "Unable to update the user role.",
        variant: "error",
      });
    } finally {
      setSavingUid(null);
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <h1 className="text-3xl font-bold text-[#f5e6c2]">Manage Users</h1>
        <p className="mt-2 text-sm text-[#dccba6]">Promote trusted users to admin or keep them as customer-only buyers.</p>

        {error ? <p className="mt-4 rounded-lg border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

        {loading ? (
          <p className="mt-6 rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-[#dccba6]">Loading users...</p>
        ) : (
          <section className="mt-6 overflow-hidden rounded-xl border border-[#d6b36a]/20">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1a120b] text-left text-sm text-[#f5e6c2]">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((profile) => (
                  <tr key={profile.uid} className="border-t border-[#d6b36a]/20 text-sm text-[#dccba6]">
                    <td className="px-4 py-3">{profile.displayName}</td>
                    <td className="px-4 py-3">{profile.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={profile.role}
                        onChange={(event) => handleRoleChange(profile.uid, event.target.value as UserRole)}
                        disabled={savingUid === profile.uid}
                        className="rounded-md border border-[#d6b36a]/30 bg-[#130e0a] px-3 py-2 text-sm text-[#f8ecd0]"
                      >
                        {roleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#bca475]">{savingUid === profile.uid ? "Saving..." : profile.uid}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}