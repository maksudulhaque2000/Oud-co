import { NextResponse } from "next/server";
import { getSelfProfile, upsertSelfProfile } from "@/lib/mongo-users";

function isString(value: unknown) {
  return typeof value === "string";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required." }, { status: 400 });
  }

  const profile = await getSelfProfile(uid);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { uid?: unknown; email?: unknown; displayName?: unknown; phone?: unknown; address?: unknown; bootstrapAdmin?: unknown }
    | null;

  if (
    !body ||
    !isString(body.uid) ||
    !isString(body.email) ||
    !isString(body.displayName) ||
    typeof body.bootstrapAdmin !== "boolean"
  ) {
    return NextResponse.json({ error: "Invalid user payload." }, { status: 400 });
  }

  const profile = await upsertSelfProfile({
    uid: body.uid,
    email: body.email,
    displayName: body.displayName,
    phone: isString(body.phone) ? body.phone : "",
    address: isString(body.address) ? body.address : "",
    bootstrapAdmin: body.bootstrapAdmin,
  });

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { uid?: unknown; email?: unknown; displayName?: unknown; phone?: unknown; address?: unknown; bootstrapAdmin?: unknown }
    | null;

  if (
    !body ||
    !isString(body.uid) ||
    !isString(body.email) ||
    !isString(body.displayName) ||
    !isString(body.phone) ||
    !isString(body.address) ||
    typeof body.bootstrapAdmin !== "boolean"
  ) {
    return NextResponse.json({ error: "Invalid user payload." }, { status: 400 });
  }

  const profile = await upsertSelfProfile({
    uid: body.uid,
    email: body.email,
    displayName: body.displayName,
    phone: body.phone,
    address: body.address,
    bootstrapAdmin: body.bootstrapAdmin,
  });

  return NextResponse.json({ profile });
}
