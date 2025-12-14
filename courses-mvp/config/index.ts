import dotenv from "dotenv";
dotenv.config();
export const config = {
  DATABASE_URL: process.env.DATABASE_URL || "default_secret_key",
  DIRECT_URL: process.env.DIRECT_URL || "default_secret_key",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "default_secret_key",
  //PAYOS
  PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID || "default_secret_key",
  PAYOS_API_KEY: process.env.PAYOS_API_KEY || "default_secret_key",
  PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY || "default_secret_key",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};
