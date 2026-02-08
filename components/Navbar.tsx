"use client";

import { WalletConnect } from "@/components/WalletConnect";

export function Navbar() {
  return (
    <header
      className="
        w-full
        h-16
        flex items-center justify-between
        px-6
        border-b
        sticky top-0 z-20
      "
      style={{
        backgroundColor: "rgba(255,255,255,0.8)",
        borderColor: "var(--color-border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <h1 className="font-semibold text-lg">
        Event Booking
      </h1>

      <WalletConnect />
    </header>
  );
}
