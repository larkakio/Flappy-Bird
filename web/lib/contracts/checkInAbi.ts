export const checkInAbi = [
  {
    type: "function",
    name: "checkIn",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "canCheckIn",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lastDayIndex",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "streak",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CheckedIn",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "dayIndex", type: "uint256", indexed: false },
      { name: "streak", type: "uint256", indexed: false },
    ],
  },
  {
    type: "error",
    name: "AlreadyCheckedInToday",
    inputs: [],
  },
  {
    type: "error",
    name: "EthNotAccepted",
    inputs: [],
  },
] as const;
