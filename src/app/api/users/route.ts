import { NextResponse } from "next/server";
import { listUserProfiles } from "@/lib/mongo-users";

export async function GET() {
  const users = await listUserProfiles();
  return NextResponse.json({ users });
}
