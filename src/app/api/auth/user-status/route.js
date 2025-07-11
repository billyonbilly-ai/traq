import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/user-utils";

export async function POST(req) {
  const { email } = await req.json();
  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ status: "new" });
  }
  if (user.password) {
    return NextResponse.json({ status: "password" });
  }
  return NextResponse.json({ status: "code" });
} 