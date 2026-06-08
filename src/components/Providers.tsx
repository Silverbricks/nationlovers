"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#002B5B",
            color: "#fff",
            borderRadius: "8px",
          },
          success: {
            iconTheme: { primary: "#F4C300", secondary: "#002B5B" },
          },
          error: {
            iconTheme: { primary: "#D7263D", secondary: "#fff" },
          },
        }}
      />
    </SessionProvider>
  );
}
