import { User } from "firebase/auth";
import { UserProfile, UserRole } from "@/types/user";

function parseAccessList(value: string | undefined) {
  return new Set(
    (value || "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

const bootstrapAdminEmails = parseAccessList(process.env.NEXT_PUBLIC_ADMIN_EMAILS);
const bootstrapAdminUids = parseAccessList(process.env.NEXT_PUBLIC_ADMIN_UIDS);

export function isBootstrapAdmin(user: Pick<User, "uid" | "email"> | null) {
  if (!user) {
    return false;
  }

  const email = user.email?.trim().toLowerCase();
  return Boolean((email && bootstrapAdminEmails.has(email)) || bootstrapAdminUids.has(user.uid.toLowerCase()));
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as { error?: string } | T | null;

  if (!response.ok) {
    throw new Error(((payload as { error?: string } | null)?.error) || "Request failed.");
  }

  return payload as T;
}

export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const payload = await requestJson<{ profile: UserProfile }>("/api/users/self", {
    method: "POST",
    body: JSON.stringify({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || user.email || "User",
      phone: "",
      address: "",
      bootstrapAdmin: isBootstrapAdmin(user),
    }),
  });

  return payload.profile;
}

export async function fetchSelfProfile(uid: string): Promise<UserProfile | null> {
  try {
    const payload = await requestJson<{ profile: UserProfile }>(`/api/users/self?uid=${encodeURIComponent(uid)}`);
    return payload.profile;
  } catch {
    return null;
  }
}

export async function updateSelfProfile(input: {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  address: string;
  bootstrapAdmin: boolean;
}) {
  const payload = await requestJson<{ profile: UserProfile }>("/api/users/self", {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return payload.profile;
}

export async function fetchUserProfiles(): Promise<UserProfile[]> {
  const payload = await requestJson<{ users: UserProfile[] }>("/api/users");
  return payload.users;
}

export async function updateUserRole(targetUid: string, role: UserRole, promotedBy: string) {
  await requestJson<{ profile: UserProfile }>(`/api/users/${targetUid}`, {
    method: "PATCH",
    body: JSON.stringify({ role, promotedBy }),
  });
}