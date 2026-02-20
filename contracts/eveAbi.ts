export const eveAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "exBoyfriend", type: "address" },
      { indexed: false, name: "reason", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "Breakup",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "suitor", type: "address" },
      { indexed: false, name: "messageHash", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "Flirt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "boyfriend", type: "address" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "NewBoyfriend",
    type: "event",
  },
  {
    inputs: [],
    name: "currentBoyfriend",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "messageHash", type: "string" }],
    name: "flirt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "suitor", type: "address" }],
    name: "flirtCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "suitor", type: "address" }],
    name: "getFlirtCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRelationshipCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRelationshipHistory",
    outputs: [
      {
        components: [
          { name: "boyfriend", type: "address" },
          { name: "startedAt", type: "uint256" },
          { name: "endedAt", type: "uint256" },
          { name: "breakupReason", type: "string" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isInRelationship",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "lastFlirtMessage",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "relationshipStartedAt",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const EVE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_EVE_CONTRACT_ADDRESS as `0x${string}`;
