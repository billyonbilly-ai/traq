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
    from: `Traq <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Sign in to Traq',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; background: #faf9f5; padding: 32px; border-radius: 12px; max-width: 420px; margin: 0 auto; color: #141413;">
        <h2 style="color: #FC5130; margin-bottom: 16px;">Sign in to Traq</h2>
        <p style="font-size: 1.1rem; margin-bottom: 24px;">Your verification code is:</p>
        <div style="font-size: 2rem; font-weight: bold; letter-spacing: 2px; background: #f0eee6; padding: 12px 0; border-radius: 8px; text-align: center; margin-bottom: 24px;">${code}</div> 
        <p style="font-size: 0.95rem; color: #555; margin-top: 32px;">This code will expire in 10 minutes.<br>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
} 