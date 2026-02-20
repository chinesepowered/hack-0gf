# Eve - Your 0G Girlfriend 💜

The world's first on-chain AI girlfriend. Connect your wallet, flirt with Eve, and maybe become her boyfriend!

Built for 0G Blockchain Hackathon.

## Quick Start

```bash
# 1. Install
pnpm install

# 2. Set up env
cp .env.example .env
# Add your CEREBRAS_API_KEY

# 3. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy Contract (2 minutes)

1. **Open Remix:** https://remix.ethereum.org
2. **Create new file:** `Eve.sol` and paste contents from `contracts/Eve.sol`
3. **Compile:** Solidity 0.8.24+
4. **Deploy:**
   - Environment: "Injected Provider - MetaMask"
   - Add 0G Galileo Testnet to MetaMask:
     - Network: `0G-Galileo-Testnet`
     - RPC: `https://evmrpc-testnet.0g.ai`
     - Chain ID: `16602`
     - Symbol: `0G`
     - Explorer: `https://chainscan-galileo.0g.ai`
   - Get testnet 0G from faucet: https://faucet.0g.ai
   - Click Deploy!
5. **Copy contract address** to `.env` as `NEXT_PUBLIC_EVE_CONTRACT_ADDRESS`

## Setup 0G Compute (for Eve's AI)

```bash
# Install CLI
pnpm add @0glabs/0g-serving-broker -g

# Setup and login
0g-compute-cli setup-network    # Choose testnet
0g-compute-cli login            # Connect wallet

# Fund and setup provider
0g-compute-cli deposit --amount 10
0g-compute-cli inference list-providers
0g-compute-cli transfer-fund --provider <PROVIDER_ADDRESS> --amount 5
0g-compute-cli inference acknowledge-provider --provider <PROVIDER_ADDRESS>

# Get your API key
0g-compute-cli inference get-secret --provider <PROVIDER_ADDRESS>
# Copy the secret to .env as ZG_COMPUTE_API_KEY
# Copy the service URL to .env as ZG_COMPUTE_SERVICE_URL
```

## Features

- 🦊 MetaMask wallet connection
- ✍️ Sign messages to prove identity
- 💬 AI-powered flirty conversations
- 💔 On-chain relationship history
- 👑 Current boyfriend display

## Tech Stack

- Next.js 15, React 19, Tailwind CSS
- wagmi + viem (wallet)
- 0G Compute (qwen-2.5-7b-instruct)
- 0G Network (Newton Testnet)
