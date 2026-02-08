"use client";

import { Navbar } from "@/components/Navbar";
import { EventsList } from "@/components/EventsList";
import { AICreateEvent } from "@/components/AICreateEvent";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* TOP NAV */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1
          flex
          flex-col
          lg:flex-row
          overflow-hidden
        "
      >
        {/* EVENTS LIST */}
        <section
          className="
            w-full
            lg:flex-[3]
            p-4
            lg:p-6
            overflow-y-auto
          "
        >
          <EventsList />
        </section>

        {/* DIVIDER (desktop only) */}
        <div
          className="hidden lg:block w-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {/* AI PANEL */}
        <section
          className="
            w-full
            lg:flex-[2]
            p-4
            lg:p-6
            border-t
            lg:border-t-0
          "
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="w-full lg:sticky lg:top-6">
            {isConnected ? (
              <AICreateEvent />
            ) : (
              <div className="h-[240px] flex items-center justify-center text-sm opacity-70">
                Connect your wallet to create events
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
