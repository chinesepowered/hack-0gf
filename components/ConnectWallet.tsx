"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Wallet, LogOut, Loader2, AlertTriangle } from "lucide-react";
import { zeroGTestnet } from "@/app/providers";

export default function ConnectWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId && chainId !== zeroGTestnet.id;

  if (isConnected && isWrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: zeroGTestnet.id })}
        disabled={isSwitching}
        className="bg-yellow-500/20 border border-yellow-500/50 rounded-full px-4 py-2 text-yellow-400 font-medium flex items-center gap-2 hover:bg-yellow-500/30 transition-colors"
      >
        {isSwitching ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <AlertTriangle className="w-4 h-4" />
        )}
        Switch to 0G Testnet
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-eve-dark border border-eve-purple/30 rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-eve-dark border border-eve-purple/30 rounded-full p-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className="bg-gradient-to-r from-eve-pink to-eve-purple rounded-full px-4 py-2 text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      {isPending ? "Connecting..." : "Connect MetaMask"}
    </button>
  );
}
