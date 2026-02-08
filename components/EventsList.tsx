"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import {
  useAllEventIds,
  useGetEvent,
  useBookEvent,
  useCheckIn,
  useAttendeeStatus,
  useCancelEvent,
  useWithdrawFunds,
} from "@/utils/useContractHook";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";

export function EventsList() {
  const { eventIds, isLoading, error } = useAllEventIds();

  if (isLoading) return <p className="text-sm opacity-70">Loading events…</p>;
  if (error)
    return <p className="text-sm text-red-500">Failed to load events</p>;
  if (!eventIds.length)
    return <p className="text-sm opacity-70">No events available</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Events</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {eventIds.map((id) => (
          <EventCard key={id.toString()} eventId={id} />
        ))}
      </div>
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

  const { bookEvent, isPending: isBooking } = useBookEvent();
  const { checkIn, isPending: isCheckingIn } = useCheckIn();
  const { cancelEvent, isPending: isCancelling } = useCancelEvent();
  const { withdrawFunds, isPending: isWithdrawing } = useWithdrawFunds();

  const [showQR, setShowQR] = useState(false);

  if (!data) return null;
  const event = data as any;

  const isOrganizer =
    address && event.organizer.toLowerCase() === address.toLowerCase();

  const isBooked = status?.[0] ?? false;
  const isCheckedIn = status?.[1] ?? false;

  const isFull =
    event.maxAttendees > BigInt(0) && event.totalBooked >= event.maxAttendees;

  const checkInUrl =
    address && typeof window !== "undefined"
      ? `${window.location.origin}/checkin?eventId=${eventId.toString()}&attendee=${address}`
      : "";

  function handleToggleQR() {
    setShowQR((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem("akcess:checkin:eventId", eventId.toString());
      }
      return next;
    });
  }

  function handleBook() {
    if (!isConnected || isBooked || isFull) return;

    bookEvent({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "bookEvent",
      args: [eventId],
      value: event.priceBNB,
    });
  }

  function handleCheckIn() {
    if (!isConnected || !isBooked || isCheckedIn) return;

    checkIn({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "checkIn",
      args: [eventId],
    });
  }

  return (
    <div
      className="
    rounded-xl border p-4 space-y-3
    focus:outline-none
    focus-visible:outline-none
  "
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight">{event.title}</h3>
        {isOrganizer && (
          <div className="flex gap-2">
            {/* Cancel event */}
            <motion.button
              onClick={() =>
                cancelEvent({
                  address: CONTRACT_ADDRESS,
                  abi: CONTRACT_ABI,
                  functionName: "cancelEvent",
                  args: [eventId],
                })
              }
              disabled={isCancelling}
              className="
    px-3 py-1.5
    text-xs font-medium
    rounded-md
    border cursor-pointer
  "
              style={{
                borderColor: "#E35D8F",
                color: "#E35D8F",
                backgroundColor: "transparent",
                opacity: isCancelling ? 0.6 : 1,
              }}
              whileHover={!isCancelling ? { scale: 1.03 } : {}}
              whileTap={!isCancelling ? { scale: 0.97 } : {}}
            >
              {isCancelling ? "Cancelling…" : "Cancel event"}
            </motion.button>

            {/* Withdraw funds */}
            {event.totalBooked > BigInt(0) && (
              <motion.button
                onClick={() =>
                  withdrawFunds({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: "withdrawFunds",
                    args: [eventId],
                  })
                }
                disabled={isWithdrawing}
                className="
          px-3 py-1.5
          text-xs font-medium
          rounded-md
          text-white cursor-pointer
        "
                style={{
                  backgroundColor: "var(--color-primary)",
                  opacity: isWithdrawing ? 0.6 : 1,
                }}
                whileHover={!isWithdrawing ? { scale: 1.03 } : {}}
                whileTap={!isWithdrawing ? { scale: 0.97 } : {}}
              >
                {isWithdrawing ? "Withdrawing…" : "Withdraw funds"}
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm opacity-80">{event.description}</p>

      {/* EVENT DETAILS */}
      <div className="text-xs opacity-70 space-y-1">
        <p>
          <span className="font-medium">Price:</span>{" "}
          {event.priceBNB === BigInt(0)
            ? "Free"
            : `${formatEther(event.priceBNB)} BNB`}
        </p>

        <p>
          <span className="font-medium">Date:</span>{" "}
          {new Date(Number(event.eventTime) * 1000).toLocaleString()}
        </p>

        <p>
          <span className="font-medium">Attendees:</span>{" "}
          {event.maxAttendees === BigInt(0)
            ? "Unlimited"
            : `${event.totalBooked}/${event.maxAttendees}`}
        </p>
      </div>

      {/* BOOK EVENT */}
      {!isBooked && (
        <motion.button
          onClick={handleBook}
          disabled={!isConnected || isFull || isBooking}
          className="w-full rounded-lg px-4 py-2 text-white font-semibold cursor-pointer"
          style={{
            backgroundColor: isFull ? "#ef4444" : "var(--color-primary)",
            opacity: isBooking ? 0.7 : 1,
          }}
        >
          {isBooking ? "Booking…" : isFull ? "Event full" : "Book event"}
        </motion.button>
      )}

      {/* CHECK-IN + QR */}
      {isBooked && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {!isCheckedIn && (
              <motion.button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="flex-1 rounded-lg px-4 py-2 text-white font-semibold cursor-pointer"
                style={{
                  backgroundColor: "var(--color-primary)",
                  opacity: isCheckingIn ? 0.7 : 1,
                }}
              >
                {isCheckingIn ? "Checking in…" : "Check in"}
              </motion.button>
            )}

            <motion.button
              onClick={handleToggleQR}
              className="flex-1 rounded-lg px-4 py-2 font-semibold border cursor-pointer"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              {showQR ? "Hide QR" : "Show QR"}
            </motion.button>
          </div>
          {showQR && address && (
            <div className="rounded-lg border p-3 text-center space-y-2">
              <p className="text-xs opacity-70">Scan to verify booking</p>

              <div className="inline-block bg-white p-2">
                <QRCode
                  value={`${window.location.origin}/checkin?eventId=${eventId.toString()}&attendee=${address}`}
                  size={140}
                />
              </div>
            </div>
          )}

          {showQR && !address && (
            <p className="text-xs text-center opacity-60">
              Waiting for wallet…
            </p>
          )}
        </div>
      )}

      {isCheckedIn && (
        <div className="text-sm font-medium text-green-600 text-center">
          You are checked in
        </div>
      )}
    </div>
  );
}
