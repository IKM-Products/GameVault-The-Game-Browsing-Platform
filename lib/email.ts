// lib/email.ts

import { Resend } from "resend";
import style from "styled-jsx/style";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "GameVault <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email.");
  }
}

export function passwordResetEmail(resetLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h1 style="color: #7c3aed;">GameVault Password Reset</h1>
      <div>
      <p>
      You requested to reset your GameVault password.
      </p>
      </div>
      <p>Click the button below to reset your password:</p>

      <a 
        href="${resetLink}"
        style="
          display: inline-block;
          padding: 12px 18px;
          background-color: #7c3aed;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
        ">
        Reset Password
      </a>

      <p style="margin-top: 24px; color: #666666;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
   `;
}