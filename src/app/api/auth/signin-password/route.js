import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/user-utils";
import { compare } from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();
  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
} 