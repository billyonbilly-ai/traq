import { NextResponse } from "next/server";
import { getVerificationCode, deleteVerificationCode } from "@/lib/verification-codes";
import { getUserByEmail, hasGoogleAccount } from "@/lib/user-utils";

export async function POST(req) {
  const { email, code } = await req.json();
  const record = await getVerificationCode(email, code);

  if (!record) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  await deleteVerificationCode(email, code);

  const user = await getUserByEmail(email);

  if (user) {
    if (await hasGoogleAccount(user._id)) {
      return NextResponse.json({ status: "google" });
    }
    if (user.password) {
      return NextResponse.json({ status: "signin" });
    }
    return NextResponse.json({ status: "onboarding" });
  } else {
    return NextResponse.json({ status: "onboarding" });
  }
} 