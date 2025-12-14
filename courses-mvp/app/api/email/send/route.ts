import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { to, subject, text } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail", // Hoặc SMTP khác
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password của Gmail, không phải pass thường
      },
    });

    await transporter.sendMail({
      from: '"Course Admin" <no-reply@course.com>',
      to,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Email sending failed" }, { status: 500 });
  }
}
