"use client";

import { TrendingDown } from "lucide-react";
import { DutchAuctionTimer } from "./dutch_auction_timer";

interface PriceInfoProps {
  fromToken?: { symbol: string } | null;
  toToken?: { symbol: string } | null;
  exchangeRate?: number;
  isDutchAuction?: boolean;
  auctionEndTime?: number;
}

export function PriceInfo({
  fromToken,
  toToken,
  exchangeRate = 0,
  isDutchAuction = false,
  auctionEndTime = Date.now() + 300000, // 5 minutes from now
}: PriceInfoProps) {
  if (!fromToken || !toToken || exchangeRate === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          1 {fromToken.symbol} = {exchangeRate.toFixed(3)} {toToken.symbol}
        </span>
        <span className="text-gray-400">~${(exchangeRate * 10.35).toFixed(2)}</span>
      </div>

      {isDutchAuction && (
        <DutchAuctionTimer 
          endTime={auctionEndTime}
          onExpire={() => console.log("Auction expired")}
        />
      )}

      <details className="cursor-pointer">
        <summary className="flex items-center justify-between text-sm text-gray-400 hover:text-gray-300">
          <span>More details</span>
        </summary>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Slippage tolerance</span>
            <span className="text-blue-500">Auto 0.5%</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Minimum receive</span>
            <span className="text-white">{(exchangeRate * 0.995).toFixed(6)} {toToken.symbol}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Network Fee</span>
            <span className="text-cyan-400">Free</span>
          </div>
        </div>
      </details>
    </div>
  );
}