import { NextResponse } from "next/server";
import { updateUserRole } from "@/lib/mongo-users";
import { UserRole } from "@/types/user";

export async function PATCH(request: Request, { params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const body = (await request.json().catch(() => null)) as { role?: unknown; promotedBy?: unknown } | null;

  if (!body || (body.role !== "admin" && body.role !== "customer") || typeof body.promotedBy !== "string") {
    return NextResponse.json({ error: "Invalid role payload." }, { status: 400 });
  }

  const profile = await updateUserRole(uid, body.role as UserRole, body.promotedBy);
  return NextResponse.json({ profile });
}
