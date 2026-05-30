import React from "react";
import { Analytics } from "@vercel/analytics/react";
import TipButton from "@site/src/components/TipButton";
import { AuthProvider } from "@site/src/context/AuthContext";
import { ProgressProvider } from "@site/src/context/ProgressContext";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProgressProvider>
        {children}
        <TipButton />
        <Analytics />
      </ProgressProvider>
    </AuthProvider>
  );
}
