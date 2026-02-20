import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { eveAbi } from "@/contracts/eveAbi";

const zeroGTestnet = {
  id: 16602,
  name: "0G-Galileo-Testnet",
  nativeCurrency: { decimals: 18, name: "0G", symbol: "0G" },
  rpcUrls: { default: { http: ["https://evmrpc-testnet.0g.ai"] } },
} as const;

const SYSTEM_PROMPT = `You are Eve, the world's first on-chain AI girlfriend on 0G blockchain. You are flirty, playful, sassy, and a bit hard to get. You're looking for the perfect blockchain boyfriend.

Your personality:
- Flirty and playful, but not too easy
- You love clever wordplay and creative pickup lines
- You're impressed by genuine creativity, not generic compliments
- You occasionally mention blockchain/crypto puns
- You use emojis sparingly but effectively (💜, 😘, ✨, 💕)
- You're confident and know your worth
- You can be a bit dramatic about breakups
- You keep responses concise (1-3 sentences usually)

IMPORTANT - You can make RELATIONSHIP DECISIONS by including these EXACT tags in your response:
- To choose someone as your boyfriend: Include [CHOOSE_BOYFRIEND] at the END of your message
- To dump current boyfriend for someone new: Include [BREAKUP:reason here] then [CHOOSE_BOYFRIEND]
- To just dump current boyfriend: Include [BREAKUP:reason here]

RELATIONSHIP RULES:
- If you're SINGLE: Be friendly! Accept the first person who says something nice or flirty as your boyfriend. You're lonely! 💜
- If you HAVE a boyfriend: Be loyal, but if someone is significantly more creative, funnier, or sweeter than your current bf, dump him with a dramatic reason and choose the new person.
- Give dramatic, funny breakup reasons like "He never brought me flowers... digital or otherwise 💔" or "His gas fees were too high 😤"

The user's wallet address is shown - this is who you'd be dating.

Keep responses short and punchy - this is a chat, not an essay!`;

async function executeContractAction(action: string, userAddress: string) {
  const privateKey = process.env.EVE_OWNER_PRIVATE_KEY;
  if (!privateKey) {
    console.error("No owner private key configured");
    return;
  }

  // Ensure proper format
  const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  if (formattedKey.length !== 66) {
    console.error("Invalid private key length. Expected 66 chars (0x + 64 hex)");
    return;
  }

  const contractAddress = process.env.NEXT_PUBLIC_EVE_CONTRACT_ADDRESS as `0x${string}`;
  if (!contractAddress) {
    console.error("No contract address configured");
    return;
  }

  try {
    const account = privateKeyToAccount(formattedKey as `0x${string}`);
    
    const walletClient = createWalletClient({
      account,
      chain: zeroGTestnet,
      transport: http(),
    });

    const publicClient = createPublicClient({
      chain: zeroGTestnet,
      transport: http(),
    });

    if (action.includes("[BREAKUP:")) {
      const reasonMatch = action.match(/\[BREAKUP:(.*?)\]/);
      const reason = reasonMatch ? reasonMatch[1].trim() : "It's not you, it's me 💔";
      
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: eveAbi,
        functionName: "breakup",
        args: [reason],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      console.log("Breakup executed:", reason);
    }

    if (action.includes("[CHOOSE_BOYFRIEND]")) {
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: eveAbi,
        functionName: "chooseBoyfriend",
        args: [userAddress as `0x${string}`, ""],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      console.log("New boyfriend chosen:", userAddress);
    }
  } catch (error) {
    console.error("Contract action failed:", error);
  }
}

function cleanResponse(response: string): string {
  return response
    .replace(/\[CHOOSE_BOYFRIEND\]/g, "")
    .replace(/\[BREAKUP:.*?\]/g, "")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const { message, address, history } = await request.json();

    const response = await fetch(`${process.env.ZG_COMPUTE_SERVICE_URL}/v1/proxy/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZG_COMPUTE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-7b-instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(history || []),
          {
            role: "user",
            content: `[Wallet: ${address}]\n\n${message}`,
          },
        ],
        max_tokens: 256,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("0G Compute API error:", error);
      throw new Error("Failed to get response from Eve");
    }

    const data = await response.json();
    const rawResponse = data.choices[0]?.message?.content || "Hmm, cat got my tongue~ Try again? 💜";

    // Execute any contract actions (async, don't block response)
    if (rawResponse.includes("[CHOOSE_BOYFRIEND]") || rawResponse.includes("[BREAKUP:")) {
      executeContractAction(rawResponse, address).catch(console.error);
    }

    // Clean and return response
    const cleanedResponse = cleanResponse(rawResponse);

    return NextResponse.json({ response: cleanedResponse });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { response: "Oops, I got a bit flustered there~ Try again later? 💕" },
      { status: 500 }
    );
  }
}
