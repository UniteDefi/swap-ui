"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  createdAt: string;
  className?: string;
  onProgressChange?: (progress: number) => void;
}

export function CountdownTimer({ createdAt, className = "", onProgressChange }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("--:--");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const created = new Date(createdAt).getTime();
      const expiry = created + 5 * 60 * 1000; // 5 minutes from creation
      const now = Date.now();
      const diff = expiry - now;
      const totalDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (diff <= 0) {
        setTimeLeft("0:00");
        setIsExpired(true);
        if (onProgressChange) onProgressChange(100);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      setIsExpired(false);
      
      // Calculate progress (0-100)
      const elapsed = totalDuration - diff;
      const progress = (elapsed / totalDuration) * 100;
      if (onProgressChange) onProgressChange(progress);
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [createdAt, onProgressChange]);

  return (
    <span className={`font-mono ${isExpired ? "text-red-500" : ""} ${className}`}>
      {timeLeft}
    </span>
  );
}

// Utility function to get progress percentage
export function getTimeProgress(createdAt: string): number {
  const created = new Date(createdAt).getTime();
  const expiry = created + 5 * 60 * 1000; // 5 minutes from creation
  const now = Date.now();
  const diff = expiry - now;
  const totalDuration = 5 * 60 * 1000;
  
  if (diff <= 0) return 100;
  
  const elapsed = totalDuration - diff;
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}