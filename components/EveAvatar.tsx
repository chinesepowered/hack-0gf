"use client";

import { motion } from "framer-motion";

export default function EveAvatar() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-32 h-32 mx-auto mb-6"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-eve-pink to-eve-purple rounded-full blur-xl opacity-50" />
      
      {/* Avatar circle */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-eve-pink to-eve-purple p-1">
        <div className="w-full h-full rounded-full bg-eve-dark flex items-center justify-center">
          {/* Simple Eve face */}
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            {/* Face */}
            <circle cx="50" cy="50" r="35" fill="#FFE5D9" />
            
            {/* Hair */}
            <path
              d="M20 45 Q15 20 50 15 Q85 20 80 45 Q80 30 50 25 Q20 30 20 45"
              fill="#4A2C2A"
            />
            <path
              d="M15 50 Q10 35 25 25 L20 55 Z"
              fill="#4A2C2A"
            />
            <path
              d="M85 50 Q90 35 75 25 L80 55 Z"
              fill="#4A2C2A"
            />
            
            {/* Eyes */}
            <ellipse cx="38" cy="48" rx="5" ry="6" fill="#4A2C2A" />
            <ellipse cx="62" cy="48" rx="5" ry="6" fill="#4A2C2A" />
            <circle cx="36" cy="46" r="2" fill="white" />
            <circle cx="60" cy="46" r="2" fill="white" />
            
            {/* Blush */}
            <ellipse cx="30" cy="55" rx="6" ry="3" fill="#FFB6C1" opacity="0.6" />
            <ellipse cx="70" cy="55" rx="6" ry="3" fill="#FFB6C1" opacity="0.6" />
            
            {/* Smile */}
            <path
              d="M40 62 Q50 72 60 62"
              stroke="#E88B8B"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Heart accessory */}
            <path
              d="M75 25 C75 20 80 18 82 22 C84 18 89 20 89 25 C89 30 82 35 82 35 C82 35 75 30 75 25"
              fill="#FF6B9D"
            />
          </svg>
        </div>
      </div>

      {/* Floating hearts */}
      <motion.div
        animate={{ y: [-20, -40], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        className="absolute -right-2 top-0 text-eve-pink"
      >
        💕
      </motion.div>
    </motion.div>
  );
}
