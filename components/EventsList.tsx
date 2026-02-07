"use client";

import { useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  useAllEventIds,
  useGetEvent,
  useBookEvent,
  useAttendeeStatus,
} from "@/utils/useContractHook";
import { motion } from "framer-motion";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";

export function EventsList() {
  const { eventIds, isLoading, error } = useAllEventIds();

  if (isLoading) {
    return <p className="text-sm opacity-70">Loading events…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">Failed to load events</p>;
  }

  if (!eventIds.length) {
    return <p className="text-sm opacity-70">No events yet</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Events</h2>

      {eventIds.map((id) => (
        <EventCard key={id.toString()} eventId={id} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   CARD                                     */
/* -------------------------------------------------------------------------- */

function EventCard({ eventId }: { eventId: bigint }) {
  const { address, isConnected } = useAccount();
  const { data } = useGetEvent(eventId);
  const { data: status } = useAttendeeStatus(eventId, address);
  const { bookEvent, isPending } = useBookEvent();

  if (!data) return null;

  const event = data as any;

  const isBooked = status?.[0];
  const isFull =
    event.maxAttendees > BigInt(0) &&
    event.totalBooked >= event.maxAttendees;

  function handleBook() {
    if (!isConnected || isBooked || isFull) return;

    bookEvent({
      address: CONTRACT_ADDRESS, // overridden by wagmi internally
      abi: CONTRACT_ABI , // already bound in hook
      functionName: "bookEvent",
      args: [eventId],
      value: event.priceBNB, // 👈 PAYABLE VALUE
    });
  }

  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      style={{
        borderColor: event.colorCode,
        backgroundColor: "var(--color-bg)",
      }}
    >
      <h3 className="font-semibold">{event.title}</h3>
      <p className="text-sm opacity-80">{event.description}</p>

      <div className="text-xs opacity-70 space-y-1">
        <p>💰 {formatEther(event.priceBNB)} BNB</p>
        <p>
          📅{" "}
          {new Date(Number(event.eventTime) * 1000).toLocaleString()}
        </p>
        <p>
          👥{" "}
          {event.maxAttendees === BigInt(0)
            ? "Unlimited"
            : `${event.totalBooked}/${event.maxAttendees}`}
        </p>
      </div>

      {/* BOOK BUTTON */}
      <motion.button
        onClick={handleBook}
        disabled={!isConnected || isBooked || isFull || isPending}
        className="w-full rounded-lg px-4 py-2 text-white font-semibold"
        style={{
          backgroundColor: isBooked
            ? "#9ca3af"
            : isFull
            ? "#ef4444"
            : "var(--color-primary)",
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {isBooked
          ? "Already Booked"
          : isFull
          ? "Event Full"
          : isPending
          ? "Booking…"
          : "Book Event"}
      </motion.button>
    </div>
  );
}
