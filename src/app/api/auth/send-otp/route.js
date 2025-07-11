import { NextResponse } from "next/server";
import { createVerificationCode } from "@/lib/verification-codes";
import { Resend } from "resend";

export async function POST(req) {
  const { email } = await req.json();
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

  await createVerificationCode(email, code);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const magicLink = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?email=${encodeURIComponent(email)}&code=${code}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Traq login code",
    html: `
      <h2>Login to Traq</h2>
      <p>Your verification code is: <b>${code}</b></p>
      <p>Or <a href="${magicLink}">click here to sign in with a magic link</a></p>
      <p>This code will expire in 10 minutes.</p>
    `,
  });

  return NextResponse.json({ success: true });
} 