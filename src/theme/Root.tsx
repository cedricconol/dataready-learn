import React from "react";
import { Analytics } from "@vercel/analytics/react";
import TipButton from "@site/src/components/TipButton";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <TipButton />
      <Analytics />
    </>
  );
}
