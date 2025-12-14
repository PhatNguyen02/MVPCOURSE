// lib/drive.ts
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// Bạn nên lưu các biến này trong .env
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Xử lý lỗi xuống dòng
  },
  scopes: SCOPES,
});

export const drive = google.drive({ version: "v3", auth });
