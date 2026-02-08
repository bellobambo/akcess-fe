"use client";

import { Navbar } from "@/components/Navbar";
import { EventsList } from "@/components/EventsList";
import { AICreateEvent } from "@/components/AICreateEvent";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* TOP NAV (fixed height) */}
      <Navbar />

      {/* MAIN AREA (fills remaining height) */}
      <main className="flex flex-1 overflow-hidden">
        {/* LEFT: SCROLLABLE EVENTS LIST */}
        <section
          className="
            flex-[3]
            p-6
            overflow-y-auto
          "
        >
          <EventsList />
        </section>

        {/* DIVIDER */}
        <div
          className="hidden lg:block w-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {/* RIGHT: STICKY AI PANEL */}
        <section
          className="
            flex-[2]
            p-6
            overflow-hidden
            flex
            justify-start
          "
        >
          <div className="w-full sticky top-6">
            {isConnected ? (
              <AICreateEvent />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-sm opacity-70">
                Connect your wallet to create events
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
