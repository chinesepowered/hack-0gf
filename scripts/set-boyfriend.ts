import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";

config();

const zeroGTestnet = {
  id: 16602,
  name: "0G-Galileo-Testnet",
  nativeCurrency: { decimals: 18, name: "0G", symbol: "0G" },
  rpcUrls: { default: { http: ["https://evmrpc-testnet.0g.ai"] } },
} as const;

const eveAbi = [
  {
    inputs: [
      { name: "newBoyfriend", type: "address" },
      { name: "breakupReason", type: "string" },
    ],
    name: "chooseBoyfriend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

async function main() {
  const privateKey = process.env.EVE_OWNER_PRIVATE_KEY;
  const contractAddress = process.env.NEXT_PUBLIC_EVE_CONTRACT_ADDRESS;
  const newBoyfriend = process.argv[2] || "0xe3B24b93C18eD1B7eEa9e07b3B03D03259f3942e";

  if (!privateKey || !contractAddress) {
    console.error("Missing EVE_OWNER_PRIVATE_KEY or NEXT_PUBLIC_EVE_CONTRACT_ADDRESS in .env");
    process.exit(1);
  }

  const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  const account = privateKeyToAccount(formattedKey as `0x${string}`);

  console.log("Owner wallet:", account.address);
  console.log("Contract:", contractAddress);
  console.log("New boyfriend:", newBoyfriend);

  const walletClient = createWalletClient({
    account,
    chain: zeroGTestnet,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: zeroGTestnet,
    transport: http(),
  });

  console.log("\nSending transaction...");
  const hash = await walletClient.writeContract({
    address: contractAddress as `0x${string}`,
    abi: eveAbi,
    functionName: "chooseBoyfriend",
    args: [newBoyfriend as `0x${string}`, ""],
  });

  console.log("Tx hash:", hash);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("✅ Done! Block:", receipt.blockNumber);
}

main().catch(console.error);
