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
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckInPage() {
  const [eventId, setEventId] = useState<bigint | undefined>();
  const [ready, setReady] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------------------------------------------------------------- */
  /* Read eventId from query string                                          */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const param = searchParams.get("eventId");

    if (param) {
      try {
        setEventId(BigInt(param));
      } catch {
        console.error("[CheckInPage] Invalid eventId in query:", param);
      }
    }

    setReady(true);
  }, [searchParams]);

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

  if (!eventId) {
    return (
      <PageShell>
        <p className="text-sm opacity-70 text-center">
          Invalid or missing check-in link
        </p>
      </PageShell>
    );
  }

  const isBooked = status?.[0] ?? false;
  const isCheckedIn = status?.[1] ?? false;

  function handleCheckIn() {
    if (!isConnected || !isBooked || isCheckedIn || !eventId) return;

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
      {/* BACK BUTTON */}
      <motion.button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute top-4 left-4 text-xl font-semibold opacity-70 hover:opacity-100"
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        &lt;
      </motion.button>

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

        {isBooked && !isCheckedIn && (
          <motion.button
            onClick={handleCheckIn}
            disabled={isPending}
            className="w-full rounded-lg px-4 py-2 font-semibold text-white"
            style={{
              backgroundColor: "var(--color-primary)",
              opacity: isPending ? 0.7 : 1,
            }}
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
