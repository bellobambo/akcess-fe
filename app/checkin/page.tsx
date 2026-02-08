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
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [eventId, setEventId] = useState<bigint | undefined>();
  const [attendee, setAttendee] = useState<`0x${string}` | undefined>();
  const [ready, setReady] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Read QR params (eventId + attendee wallet)                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventIdParam = params.get("eventId");
    const attendeeParam = params.get("attendee");

    if (!eventIdParam || !attendeeParam) {
      setReady(true);
      return;
    }

    try {
      setEventId(BigInt(eventIdParam));
      setAttendee(attendeeParam as `0x${string}`);
    } catch {
      console.error("Invalid QR parameters");
    }

    setReady(true);
  }, []);

  const { data: event } = useGetEvent(eventId);
  const { data: status } = useAttendeeStatus(eventId, attendee);
  const { checkIn, isPending } = useCheckIn();

  const isBooked = status?.[0] ?? false;
  const isCheckedIn = status?.[1] ?? false;

  const isOrganizer =
    isConnected &&
    event &&
    address?.toLowerCase() === event.organizer.toLowerCase();

  /* ------------------------------------------------------------------ */
  /* Organizer-only check-in                                             */
  /* ------------------------------------------------------------------ */
  function handleOrganizerCheckIn() {
    if (
      !isOrganizer ||
      !eventId ||
      !attendee ||
      !isBooked ||
      isCheckedIn
    )
      return;

    checkIn({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "checkIn",
      args: [eventId],
    });
  }

  /* ------------------------------------------------------------------ */
  /* Guards                                                             */
  /* ------------------------------------------------------------------ */
  if (!ready) {
    return (
      <PageShell>
        <p className="text-sm opacity-70 text-center">Loading scan…</p>
      </PageShell>
    );
  }

  if (!eventId || !attendee) {
    return (
      <PageShell>
        <p className="text-sm opacity-70 text-center">
          Invalid or incomplete QR code
        </p>
      </PageShell>
    );
  }

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <PageShell>
      {/* BACK */}
      <motion.button
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-xl opacity-70 hover:opacity-100"
        whileHover={{ x: -3 }}
      >
        &lt;
      </motion.button>

      <div
        className="rounded-xl border p-6 space-y-4 w-full max-w-sm"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <h1 className="text-lg font-semibold text-center">
          Organizer Scan Mode
        </h1>

        {event && (
          <div className="text-sm text-center opacity-80">
            <p className="font-medium">{event.title}</p>
            <p>{event.description}</p>
          </div>
        )}

        {!isConnected && (
          <p className="text-sm text-center opacity-70">
            Connect organizer wallet
          </p>
        )}

        {isConnected && !isOrganizer && (
          <p className="text-sm text-center text-red-500">
            Only the event organizer can scan tickets
          </p>
        )}

        {isOrganizer && (
          <div className="rounded-lg border p-3 text-xs space-y-1 bg-yellow-50">
            <p className="font-semibold text-yellow-700 text-center">
              Scan Details
            </p>

            <p className="break-all">
              <span className="font-medium">Attendee Wallet:</span>
              <br />
              {attendee}
            </p>

            <p>
              <span className="font-medium">Booked:</span>{" "}
              {isBooked ? "Yes" : "No"}
            </p>

            <p>
              <span className="font-medium">Checked In:</span>{" "}
              {isCheckedIn ? "Yes" : "No"}
            </p>
          </div>
        )}

  

        {isCheckedIn && (
          <div className="text-sm text-center text-green-600 font-medium">
            Attendee already checked in
          </div>
        )}

        <p className="text-xs opacity-60 text-center">
          Organizer-only scan · Verified on-chain
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
