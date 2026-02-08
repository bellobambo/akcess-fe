"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useWatchContractEvent,
} from "wagmi";
import { useMemo, useEffect, useRef } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contract";
import toast from "react-hot-toast";

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

export function useEventCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "eventCount",
  });
}

export function useEvent(eventId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "events",
    args: eventId !== undefined ? [eventId] : undefined,
    query: { enabled: eventId !== undefined },
  });
}

export function useGetEvent(eventId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getEvent",
    args: eventId !== undefined ? [eventId] : undefined,
    query: { enabled: eventId !== undefined },
  });
}

export function useAttendeeStatus(
  eventId: bigint | undefined,
  attendee: `0x${string}` | undefined,
) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "attendeeStatus",
    args: eventId !== undefined && attendee ? [eventId, attendee] : undefined,
    query: { enabled: eventId !== undefined && !!attendee },
  });
}

export function useAllEventIds() {
  const { data: count, isLoading, error } = useEventCount();

  const eventIds = useMemo(() => {
    if (!count) return [];
    return Array.from({ length: Number(count) }, (_, i) => BigInt(i));
  }, [count]);

  return { eventIds, isLoading, error };
}

/* -------------------------------------------------------------------------- */
/*                                   WRITERS                                  */
/* -------------------------------------------------------------------------- */

export function useCreateEvent() {
  const write = useWriteContract();
  return { ...write, createEvent: write.writeContract };
}

export function useBookEvent() {
  const write = useWriteContract();
  return { ...write, bookEvent: write.writeContract };
}

export function useCheckIn() {
  const write = useWriteContract();
  return { ...write, checkIn: write.writeContract };
}

export function useCancelEvent() {
  const write = useWriteContract();
  return { ...write, cancelEvent: write.writeContract };
}

export function useWithdrawFunds() {
  const write = useWriteContract();
  return { ...write, withdrawFunds: write.writeContract };
}


export function useTxReceipt(
  hash?: `0x${string}`,
  options?: {
    reload?: boolean;
    successMessage?: string;
    errorMessage?: string;
  },
) {
  const {
    reload = true,
    successMessage = "Transaction successful",
    errorMessage = "Transaction failed",
  } = options || {};

  const result = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  // prevent duplicate toasts on re-render
  const hasNotified = useRef(false);

  useEffect(() => {
    if (hasNotified.current) return;

    /** ✅ SUCCESS */
    if (result.isSuccess) {
      hasNotified.current = true;

      toast.success(successMessage);

      if (reload) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }

    /** ❌ ERROR */
    if (result.isError) {
      hasNotified.current = true;

      const message =
        result.error?.message ||
        errorMessage;

      toast.error(message);
    }
  }, [
    result.isSuccess,
    result.isError,
    reload,
    successMessage,
    errorMessage,
    result.error,
  ]);

  return result;
}


export function useIsOrganizer(event: Event | undefined) {
  const { address } = useAccount();

  return useMemo(() => {
    if (!event || !address) return false;
    return event.organizer.toLowerCase() === address.toLowerCase();
  }, [event, address]);
}

/* -------------------------------------------------------------------------- */
/*                     OPTIONAL: Direct mapping access                        */
/* -------------------------------------------------------------------------- */

export function useHasBooked(
  eventId: bigint | undefined,
  attendee: `0x${string}` | undefined,
) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasBooked",
    args: eventId !== undefined && attendee ? [eventId, attendee] : undefined,
    query: { enabled: eventId !== undefined && !!attendee },
  });
}

export function useHasCheckedIn(
  eventId: bigint | undefined,
  attendee: `0x${string}` | undefined,
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
/*                     OPTIONAL: Event listeners                               */
/* -------------------------------------------------------------------------- */

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
