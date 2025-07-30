"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface DutchAuctionTimerProps {
  endTime: number; // Unix timestamp
  onExpire?: () => void;
}

export function DutchAuctionTimer({ endTime, onExpire }: DutchAuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeLeft(remaining);
      
      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (timeLeft === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-800/30 px-3 py-2 text-sm">
      <Timer className="h-4 w-4 text-violet-400" />
      <span className="font-medium text-violet-300">
        Dutch Auction: {formatTime(timeLeft)}
      </span>
    </div>
  );
}