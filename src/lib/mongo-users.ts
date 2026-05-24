import { Collection } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { UserProfile, UserRole } from "@/types/user";

const COLLECTION_NAME = "users";

type UserDocument = UserProfile & { _id: string };

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

export function isBootstrapAdmin(user: { uid: string; email?: string | null } | null) {
  if (!user) {
    return false;
  }

  const email = user.email?.trim().toLowerCase();
  return Boolean((email && bootstrapAdminEmails.has(email)) || bootstrapAdminUids.has(user.uid.toLowerCase()));
}

function toProfile(document: UserDocument): UserProfile {
  const { _id, ...rest } = document;
  return {
    ...rest,
    uid: rest.uid || _id,
  };
}

async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await getMongoDb();
  return db.collection<UserDocument>(COLLECTION_NAME);
}

export async function upsertSelfProfile(input: {
  uid: string;
  email: string;
  displayName: string;
  bootstrapAdmin: boolean;
}) {
  const collection = await getUsersCollection();
  const existing = await collection.findOne({ _id: input.uid });
  const now = new Date().toISOString();
  const nextRole: UserRole = input.bootstrapAdmin ? "admin" : existing?.role ?? "customer";

  const profile: UserDocument = {
    _id: input.uid,
    uid: input.uid,
    email: input.email,
    displayName: input.displayName,
    role: nextRole,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    promotedBy: existing?.promotedBy ?? null,
  };

  await collection.updateOne({ _id: input.uid }, { $set: profile }, { upsert: true });
  return toProfile(profile);
}

export async function listUserProfiles() {
  const collection = await getUsersCollection();
  const users = await collection.find().sort({ updatedAt: -1 }).toArray();
  return users.map(toProfile);
}

export async function updateUserRole(targetUid: string, role: UserRole, promotedBy: string) {
  const collection = await getUsersCollection();
  const existing = await collection.findOne({ _id: targetUid });
  const now = new Date().toISOString();

  const profile: UserDocument = {
    _id: targetUid,
    uid: targetUid,
    email: existing?.email || "",
    displayName: existing?.displayName || "",
    role,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    promotedBy,
  };

  await collection.updateOne({ _id: targetUid }, { $set: profile }, { upsert: true });
  return toProfile(profile);
}
