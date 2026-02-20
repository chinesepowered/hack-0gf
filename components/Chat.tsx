"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useSignMessage, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Loader2, Sparkles, Link } from "lucide-react";
import { eveAbi, EVE_CONTRACT_ADDRESS } from "@/contracts/eveAbi";

interface Message {
  id: string;
  role: "user" | "eve";
  content: string;
  timestamp: Date;
  signed?: boolean;
}

export default function Chat() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync } = useWriteContract();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "eve",
      content: "Hey there, cutie~ 💜 I'm Eve, the world's most exclusive AI girlfriend. Impress me with your words, and maybe... just maybe... I'll make you my boyfriend. But fair warning: I'm very picky! 😘",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !address) return;

    const userMessage = input.trim();
    setInput("");

    // First, sign the message
    setIsSigning(true);
    let signature: string;
    try {
      signature = await signMessageAsync({
        message: `Eve Flirt Message:\n\n${userMessage}\n\nFrom: ${address}\nTimestamp: ${Date.now()}`,
      });
    } catch {
      setIsSigning(false);
      return; // User rejected signing
    }
    setIsSigning(false);

    // Record flirt on-chain (fire and forget - don't block the chat)
    const messageHash = signature.slice(0, 66); // Use first part of signature as hash
    writeContractAsync({
      address: EVE_CONTRACT_ADDRESS,
      abi: eveAbi,
      functionName: "flirt",
      args: [messageHash],
    }).catch(console.error); // Non-blocking

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
      signed: true,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Get Eve's response
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          address,
          signature,
          history: messages.map((m) => ({
            role: m.role === "eve" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const eveMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "eve",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, eveMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "eve",
        content: "Oops, I got a bit flustered there~ Try again? 💕",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-eve-dark/50 backdrop-blur-sm rounded-2xl border border-eve-purple/20 overflow-hidden">
      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-eve-pink to-eve-purple text-white"
                    : "bg-eve-darker border border-eve-purple/30 text-gray-200"
                }`}
              >
                {message.role === "eve" && (
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-eve-pink" />
                    <span className="text-xs text-eve-pink font-medium">Eve</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                {message.signed && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-white/60">
                    <Link className="w-3 h-3" />
                    <span>On-chain 💜</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {(isLoading || isSigning) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-eve-darker border border-eve-purple/30 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-eve-pink">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  {isSigning ? "Waiting for signature..." : "Eve is typing..."}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-eve-purple/20 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something flirty..."
            disabled={isLoading || isSigning}
            className="flex-1 bg-eve-darker border border-eve-purple/30 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-eve-pink transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isSigning}
            className="bg-gradient-to-r from-eve-pink to-eve-purple rounded-full p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Your message will be signed with your wallet to prove it's really you 💜
        </p>
      </div>
    </div>
  );
}
