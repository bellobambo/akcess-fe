"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useWatchContractEvent, // 👈 only used in OPTIONAL section
} from "wagmi";
import { useMemo } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contract";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface Event {
  organizer: `0x${string}`;
  title: string;
  description: string;
  priceBNB: bigint;
  eventTime: bigint;
  maxAttendees: bigint;
  colorCode: string;
  isActive: boolean;
  totalBooked: bigint;
}

export interface AttendeeStatus {
  booked: boolean;
  checkedIn: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   READERS                                  */
/* -------------------------------------------------------------------------- */

/** Total number of events created */
export function useEventCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "eventCount",
  });
}

/** Read raw event struct from mapping */
export function useEvent(eventId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "events",
    args: eventId !== undefined ? [eventId] : undefined,
    query: { enabled: eventId !== undefined },
  });
}

/** Read event using getter (preferred) */
export function useGetEvent(eventId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getEvent",
    args: eventId !== undefined ? [eventId] : undefined,
    query: { enabled: eventId !== undefined },
  });
}

/** Get booking + check-in status for a wallet */
export function useAttendeeStatus(
  eventId: bigint | undefined,
  attendee: `0x${string}` | undefined
) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "attendeeStatus",
    args: eventId !== undefined && attendee ? [eventId, attendee] : undefined,
    query: {
      enabled: eventId !== undefined && !!attendee,
    },
  });
}

/** Convenience hook: get all event IDs */
export function useAllEventIds() {
  const { data: count, isLoading, error } = useEventCount();

  const eventIds = useMemo(() => {
    if (!count) return [];
    return Array.from({ length: Number(count) }, (_, i) => BigInt(i));
  }, [count]);

  return {
    eventIds,
    isLoading,
    error,
  };
}

/* -------------------------------------------------------------------------- */
/*                                   WRITERS                                  */
/* -------------------------------------------------------------------------- */

/** Create event */
export function useCreateEvent() {
  const write = useWriteContract();
  return { ...write, createEvent: write.writeContract };
}

/** Book event (payable) */
export function useBookEvent() {
  const write = useWriteContract();
  return { ...write, bookEvent: write.writeContract };
}

/** Check in to event */
export function useCheckIn() {
  const write = useWriteContract();
  return { ...write, checkIn: write.writeContract };
}

/** Cancel event (organizer only) */
export function useCancelEvent() {
  const write = useWriteContract();
  return { ...write, cancelEvent: write.writeContract };
}

/** Withdraw funds (organizer only) */
export function useWithdrawFunds() {
  const write = useWriteContract();
  return { ...write, withdrawFunds: write.writeContract };
}

/* -------------------------------------------------------------------------- */
/*                              TX STATUS HELPERS                             */
/* -------------------------------------------------------------------------- */

/** Wait for tx confirmation */
export function useTxReceipt(hash?: `0x${string}`) {
  return useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });
}

/* -------------------------------------------------------------------------- */
/*                                USER HELPERS                                */
/* -------------------------------------------------------------------------- */

/** Check if connected user is organizer of an event */
export function useIsOrganizer(event: Event | undefined) {
  const { address } = useAccount();

  return useMemo(() => {
    if (!event || !address) return false;
    return event.organizer.toLowerCase() === address.toLowerCase();
  }, [event, address]);
}

/* ========================================================================== */
/*                              OPTIONAL HOOKS                               */
/*  These hooks are NOT required for core functionality.                      */
/*  They are provided for UX improvements (realtime updates, convenience).    */
/*  You can safely remove this entire section without breaking the app.       */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/*                     OPTIONAL: Direct mapping access                        */
/* -------------------------------------------------------------------------- */

/** OPTIONAL: Direct check if a user booked an event
 * Prefer `useAttendeeStatus` instead.
 */
export function useHasBooked(
  eventId: bigint | undefined,
  attendee: `0x${string}` | undefined
) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasBooked",
    args: eventId !== undefined && attendee ? [eventId, attendee] : undefined,
    query: { enabled: eventId !== undefined && !!attendee },
  });
}

/** OPTIONAL: Direct check if a user checked in
 * Prefer `useAttendeeStatus` instead.
 */
export function useHasCheckedIn(
  eventId: bigint | undefined,
  attendee: `0x${string}` | undefined
) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasCheckedIn",
    args: eventId !== undefined && attendee ? [eventId, attendee] : undefined,
    query: { enabled: eventId !== undefined && !!attendee },
  });
}

/* -------------------------------------------------------------------------- */
/*                     OPTIONAL: Event listeners (realtime UX)                */
/* -------------------------------------------------------------------------- */

/** OPTIONAL: Listen for new event creation */
export function useWatchEventCreated(onEvent?: () => void) {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "EventCreated",
    onLogs() {
      onEvent?.();
    },
  });
}

/** OPTIONAL: Listen for bookings */
export function useWatchEventBooked(onEvent?: () => void) {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "EventBooked",
    onLogs() {
      onEvent?.();
    },
  });
}

/** OPTIONAL: Listen for check-ins */
export function useWatchEventCheckedIn(onEvent?: () => void) {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "EventCheckedIn",
    onLogs() {
      onEvent?.();
    },
  });
}

/** OPTIONAL: Listen for cancellations */
export function useWatchEventCancelled(onEvent?: () => void) {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "EventCancelled",
    onLogs() {
      onEvent?.();
    },
  });
}

/** OPTIONAL: Listen for withdrawals */
export function useWatchFundsWithdrawn(onEvent?: () => void) {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "FundsWithdrawn",
    onLogs() {
      onEvent?.();
    },
  });
}
