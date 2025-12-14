"use server";

import { signIn } from "@/auth/auth";

export async function handleGoogleLogin() {
  await signIn("google", { redirectTo: "/" });
}
