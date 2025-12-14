"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center" // Vị trí hiện: top-center, top-right, bottom-right...
      reverseOrder={false}
    />
  );
};
