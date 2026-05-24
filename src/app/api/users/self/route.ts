import { NextResponse } from "next/server";
import { upsertSelfProfile } from "@/lib/mongo-users";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { uid?: unknown; email?: unknown; displayName?: unknown; bootstrapAdmin?: unknown }
    | null;

  if (
    !body ||
    typeof body.uid !== "string" ||
    typeof body.email !== "string" ||
    typeof body.displayName !== "string" ||
    typeof body.bootstrapAdmin !== "boolean"
  ) {
    return NextResponse.json({ error: "Invalid user payload." }, { status: 400 });
  }

  const profile = await upsertSelfProfile({
    uid: body.uid,
    email: body.email,
    displayName: body.displayName,
    bootstrapAdmin: body.bootstrapAdmin,
  });

  return NextResponse.json({ profile });
}
