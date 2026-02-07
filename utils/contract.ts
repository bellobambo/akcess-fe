export const CONTRACT_ADDRESS =
  "0x08758DDAbA20d43C1Ead2c9753939755177D25B0" as `0x${string}`;

export const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "attendee",
        type: "address",
      },
    ],
    name: "EventBooked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "organizer",
        type: "address",
      },
    ],
    name: "EventCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "attendee",
        type: "address",
      },
    ],
    name: "EventCheckedIn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "organizer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eventTime",
        type: "uint256",
      },
    ],
    name: "EventCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "organizer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsWithdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "attendee",
        type: "address",
      },
    ],
    name: "attendeeStatus",
    outputs: [
      {
        internalType: "bool",
        name: "booked",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "checkedIn",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
    ],
    name: "bookEvent",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
    ],
    name: "cancelEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
    ],
    name: "checkIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "priceBNB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "eventTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAttendees",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "colorCode",
        type: "string",
      },
    ],
    name: "createEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "eventCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "events",
    outputs: [
      {
        internalType: "address",
        name: "organizer",
        type: "address",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "priceBNB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "eventTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAttendees",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "colorCode",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "totalBooked",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
    ],
    name: "getEvent",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "organizer",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "priceBNB",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "eventTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxAttendees",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "colorCode",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "totalBooked",
            type: "uint256",
          },
        ],
        internalType: "struct Akcess.Event",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasBooked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasCheckedIn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
