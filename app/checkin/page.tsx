"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  useAttendeeStatus,
  useCheckIn,
  useGetEvent,
} from "@/utils/useContractHook";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CheckInPage() {
  const [eventId, setEventId] = useState<bigint | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  /* ---------------------------------------------------------------------- */
  /* Read eventId from localStorage                                          */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("akcess:checkin:eventId");
    console.log("[CheckInPage] Stored eventId:", stored);

    if (stored !== null) {
      try {
        setEventId(BigInt(stored));
      } catch {
        console.error("[CheckInPage] Invalid eventId in storage");
      }
    }

    setReady(true);
  }, []);

  const { address, isConnected } = useAccount();
  const { data: event } = useGetEvent(eventId);
  const { data: status } = useAttendeeStatus(eventId, address);
  const { checkIn, isPending } = useCheckIn();

  /* ---------------------------------------------------------------------- */
  /* Guards                                                                 */
  /* ---------------------------------------------------------------------- */
  if (!ready) {
    return (
      <PageShell>
        <p className="text-sm opacity-70 text-center">Loading check-in…</p>
      </PageShell>
    );
  }

  if (eventId === undefined) {
    return (
      <PageShell>
        <p className="text-sm opacity-70 text-center">
          No event selected for check-in
        </p>
      </PageShell>
    );
  }

  const isBooked = status?.[0] ?? false;
  const isCheckedIn = status?.[1] ?? false;

  function handleCheckIn() {
    if (!isConnected || !isBooked || isCheckedIn || eventId === undefined) return;

    checkIn({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "checkIn",
      args: [eventId],
    });
  }

  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */
  return (
    <PageShell>
      {/* BACK BUTTON – TOP LEFT */}
      <motion.button
        onClick={() => router.back()}
        aria-label="Go back"
        className="
          absolute top-4 left-4
          text-xl font-semibold
          opacity-70 hover:opacity-100
        "
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        &lt;
      </motion.button>

      {/* MAIN CARD */}
      <div className="rounded-xl border p-6 space-y-4 w-full max-w-sm">
        <h1 className="text-lg font-semibold text-center">Event check-in</h1>

        {event && (
          <div className="text-sm space-y-1 opacity-80 text-center">
            <p className="font-medium">{event.title}</p>
            <p>{event.description}</p>
          </div>
        )}

        {!isConnected && (
          <p className="text-sm text-center opacity-70">
            Connect your wallet to continue
          </p>
        )}

        {isConnected && !isBooked && (
          <p className="text-sm text-center opacity-70">
            This wallet has not booked this event
          </p>
        )}

        {isConnected && isBooked && !isCheckedIn && (
          <div className="text-sm text-center text-blue-600 font-medium">
            You have already booked this event
          </div>
        )}

        {isBooked && !isCheckedIn && (
          <motion.button
            onClick={handleCheckIn}
            disabled={isPending}
            className="w-full rounded-lg px-4 py-2 font-semibold text-white"
            style={{
              backgroundColor: "var(--color-primary)",
              opacity: isPending ? 0.7 : 1,
            }}
            whileHover={!isPending ? { scale: 1.03 } : {}}
            whileTap={!isPending ? { scale: 0.97 } : {}}
          >
            {isPending ? "Checking in…" : "Confirm check-in"}
          </motion.button>
        )}

        {isCheckedIn && (
          <div className="text-sm text-center text-green-600 font-medium">
            Check-in successful
          </div>
        )}

        <p className="text-xs opacity-60 text-center">
          Check-in is recorded on-chain and can only be done once per wallet
        </p>
      </div>
    </PageShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {children}
    </div>
  );
}
