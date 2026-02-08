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
  useTxReceipt,
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

  const { bookEvent, data: bookTxHash, isPending: isBooking } = useBookEvent();

  const {
    cancelEvent,
    data: cancelTxHash,
    isPending: isCancelling,
  } = useCancelEvent();

  const {
    withdrawFunds,
    data: withdrawTxHash,
    isPending: isWithdrawing,
  } = useWithdrawFunds();
  const {
    checkIn,
    data: checkInTxHash,
    isPending: isCheckingIn,
  } = useCheckIn();

  useTxReceipt(checkInTxHash, {
    successMessage: "Checked in successfully ",
    errorMessage: "Check-in failed",
  });
  useTxReceipt(bookTxHash, {
    successMessage: "Event booked successfully ",
    errorMessage: "Failed to book event",
  });

  useTxReceipt(cancelTxHash, {
    successMessage: "Event cancelled successfully ",
    errorMessage: "Failed to cancel event",
  });

  useTxReceipt(withdrawTxHash, {
    successMessage: "Funds withdrawn successfully ",
    errorMessage: "Withdrawal failed",
  });

  const [showQR, setShowQR] = useState(false);

  if (!data) return null;
  const event = data as any;

  const isCancelled = event.isActive === false;

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
    if (isCancelled) return;

    setShowQR((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem("akcess:checkin:eventId", eventId.toString());
      }
      return next;
    });
  }

  function handleBook() {
    if (isCancelled) return;

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
    if (isCancelled) return;

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
        <div className="flex items-center gap-2">
          <h3 className="font-semibold leading-tight">{event.title}</h3>

       
        </div>

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
              disabled={isCancelling || isCancelled}
              className="
            px-3 py-1.5
            text-xs font-medium
            rounded-md
            border
          "
              style={{
                borderColor: "#E35D8F",
                color: "#E35D8F",
                backgroundColor: "transparent",
                opacity: isCancelling || isCancelled ? 0.4 : 1,
                cursor: isCancelled ? "not-allowed" : "pointer",
              }}
              whileHover={!isCancelling && !isCancelled ? { scale: 1.03 } : {}}
              whileTap={!isCancelling && !isCancelled ? { scale: 0.97 } : {}}
            >
              {isCancelled
                ? "Event cancelled"
                : isCancelling
                  ? "Cancelling…"
                  : "Cancel event"}
            </motion.button>

            {/* Withdraw funds (ALWAYS allowed) */}
            {event.priceBNB > BigInt(0) && event.totalBooked > BigInt(0) && (
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
                className="px-3 py-1.5 text-xs font-medium rounded-md text-white"
                style={{
                  backgroundColor: "var(--color-primary)",
                  opacity: isWithdrawing ? 0.6 : 1,
                  cursor: isWithdrawing ? "not-allowed" : "pointer",
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
          disabled={!isConnected || isFull || isBooking || isCancelled}
          className="w-full rounded-lg px-4 py-2 text-white font-semibold"
          style={{
            backgroundColor: isCancelled
              ? "#9ca3af"
              : isFull
                ? "#ef4444"
                : "var(--color-primary)",
            opacity: isBooking || isCancelled ? 0.7 : 1,
            cursor: isCancelled ? "not-allowed" : "pointer",
          }}
          whileHover={!isBooking && !isCancelled ? { scale: 1.02 } : {}}
          whileTap={!isBooking && !isCancelled ? { scale: 0.97 } : {}}
        >
          {isCancelled
            ? "Event cancelled"
            : isBooking
              ? "Booking…"
              : isFull
                ? "Event full"
                : "Book event"}
        </motion.button>
      )}

      {/* CHECK-IN + QR */}
      {isBooked && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {!isCheckedIn && (
              <motion.button
                onClick={handleCheckIn}
                disabled={isCheckingIn || isCancelled}
                className="flex-1 rounded-lg px-4 py-2 text-white font-semibold"
                style={{
                  backgroundColor: "var(--color-primary)",
                  opacity: isCheckingIn || isCancelled ? 0.6 : 1,
                  cursor: isCancelled ? "not-allowed" : "pointer",
                }}
                whileHover={
                  !isCheckingIn && !isCancelled ? { scale: 1.02 } : {}
                }
                whileTap={!isCheckingIn && !isCancelled ? { scale: 0.97 } : {}}
              >
                {isCancelled
                  ? "Event cancelled"
                  : isCheckingIn
                    ? "Checking in…"
                    : "Check in"}
              </motion.button>
            )}

            <motion.button
              onClick={handleToggleQR}
              disabled={isCancelled}
              className="flex-1 rounded-lg px-4 py-2 font-semibold border"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
                opacity: isCancelled ? 0.5 : 1,
                cursor: isCancelled ? "not-allowed" : "pointer",
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
