"use client";

import { useReadContract } from "wagmi";
import { motion } from "framer-motion";
import { Heart, HeartCrack, Crown, Clock, Loader2 } from "lucide-react";
import { eveAbi, EVE_CONTRACT_ADDRESS } from "@/contracts/eveAbi";

interface Relationship {
  boyfriend: string;
  startedAt: bigint;
  endedAt: bigint;
  breakupReason: string;
}

export default function RelationshipHistory() {
  const { data: history, isLoading } = useReadContract({
    address: EVE_CONTRACT_ADDRESS,
    abi: eveAbi,
    functionName: "getRelationshipHistory",
  });

  const { data: currentBf } = useReadContract({
    address: EVE_CONTRACT_ADDRESS,
    abi: eveAbi,
    functionName: "currentBoyfriend",
  });

  const hasCurrentBf = currentBf && currentBf !== "0x0000000000000000000000000000000000000000";

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getDuration = (start: bigint, end: bigint) => {
    const seconds = Number(end - start);
    const hours = Math.floor(seconds / 3600);
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""}`;
  };

  return (
    <div className="bg-eve-dark/50 backdrop-blur-sm rounded-2xl border border-eve-purple/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <HeartCrack className="w-6 h-6 text-eve-pink" />
        <h2 className="text-xl font-bold text-white">Eve's Ex Boyfriends</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-eve-purple mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading relationship history...</p>
        </div>
      ) : !history || history.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-eve-purple mx-auto mb-4 opacity-50" />
          <p className="text-gray-400">
            {hasCurrentBf 
              ? "No ex-boyfriends yet... Eve's current relationship is going strong! 💕"
              : "Eve hasn't had any boyfriends yet... Could you be the first? 💜"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(history as Relationship[]).map((rel, index) => (
            <motion.div
              key={rel.boyfriend + rel.startedAt.toString()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-eve-darker rounded-xl p-4 border border-eve-purple/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500/50" />
                  <span className="font-mono text-white">
                    {formatAddress(rel.boyfriend)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{getDuration(rel.startedAt, rel.endedAt)}</span>
                </div>
              </div>

              <div className="text-sm text-gray-400 mb-2">
                <span>{formatDate(rel.startedAt)}</span>
                <span className="mx-2">→</span>
                <span>{formatDate(rel.endedAt)}</span>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <HeartCrack className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 italic">"{rel.breakupReason}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-eve-purple/20">
        <p className="text-xs text-gray-500 text-center">
          All relationships are stored on-chain on 0G Network 💜
        </p>
      </div>
    </div>
  );
}
