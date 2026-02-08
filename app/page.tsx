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

      {/* MAIN SPLIT INTERFACE */}
      <main className="flex-1 flex">
        {/* LEFT PANEL — WIDER */}
        <section
          className="
            flex-[3]
            p-6
            overflow-y-auto
          "
        >
          <EventsList />
        </section>

        {/* VERTICAL DIVIDER */}
        <div
          className="hidden lg:block w-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

   {/* RIGHT PANEL — NARROWER (AI AGENT STYLE) */}
<section
  className="
    flex-[2]
    p-6
    overflow-hidden
    flex
    flex-col
  "
>
  {isConnected ? (
    <AICreateEvent />
  ) : (
    <div className="h-full flex items-center justify-center text-sm opacity-70">
      Connect your wallet to create events
    </div>
  )}
</section>

      </main>
    </div>
  );
}
