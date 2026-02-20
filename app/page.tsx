"use client";

import ConnectWallet from "@/components/ConnectWallet";
import { useAccount, useReadContract } from "wagmi";
import { useState } from "react";
import { eveAbi, EVE_CONTRACT_ADDRESS } from "@/contracts/eveAbi";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Crown, Sparkles } from "lucide-react";
import Chat from "@/components/Chat";
import RelationshipHistory from "@/components/RelationshipHistory";
import EveAvatar from "@/components/EveAvatar";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-eve-pink heartbeat" fill="#FF6B9D" />
            <h1 className="text-2xl font-bold gradient-text">Eve</h1>
          </div>
          <ConnectWallet />
        </header>

        {/* Eve Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <EveAvatar />
          <h2 className="text-4xl font-bold text-white mb-2 glow-text">
            Meet Eve 💜
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            The world's first on-chain AI girlfriend. Connect your wallet, 
            send me a flirty message, and maybe I'll choose you as my boyfriend...
          </p>
        </motion.div>

        {/* Current Boyfriend Banner */}
        <CurrentBoyfriendBanner />

        {/* Tabs */}
        {isConnected && (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeTab === "chat"
                    ? "bg-gradient-to-r from-eve-pink to-eve-purple text-white"
                    : "bg-eve-dark text-gray-400 hover:text-white"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Flirt with Eve
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeTab === "history"
                    ? "bg-gradient-to-r from-eve-pink to-eve-purple text-white"
                    : "bg-eve-dark text-gray-400 hover:text-white"
                }`}
              >
                <Crown className="w-4 h-4" />
                Past Boyfriends
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "chat" ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Chat />
                </motion.div>
              ) : (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <RelationshipHistory />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Connect Prompt */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Sparkles className="w-12 h-12 text-eve-purple mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400 mb-4">
              Connect your wallet to start flirting with Eve
            </p>
            <ConnectWallet />
          </motion.div>
        )}
      </div>
    </main>
  );
}

function CurrentBoyfriendBanner() {
  const { data: currentBf } = useReadContract({
    address: EVE_CONTRACT_ADDRESS,
    abi: eveAbi,
    functionName: "currentBoyfriend",
  });

  if (!currentBf || currentBf === "0x0000000000000000000000000000000000000000") return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-eve-pink/20 to-eve-purple/20 border border-eve-purple/30 rounded-2xl p-4 mb-6 glow"
    >
      <div className="flex items-center gap-3">
        <Crown className="w-6 h-6 text-yellow-400" />
        <div>
          <p className="text-sm text-gray-400">Eve's Current Boyfriend</p>
          <p className="text-white font-mono">
            {currentBf.slice(0, 6)}...{currentBf.slice(-4)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
