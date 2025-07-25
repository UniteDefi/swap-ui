"use client";

import { TrendingDown } from "lucide-react";
import { DutchAuctionTimer } from "./dutch_auction_timer";

interface PriceInfoProps {
  fromToken?: { symbol: string } | null;
  toToken?: { symbol: string } | null;
  exchangeRate?: number;
  isDutchAuction?: boolean;
  auctionEndTime?: number;
  slippage?: number;
  fromAmount?: number;
  toAmount?: number;
}

export function PriceInfo({
  fromToken,
  toToken,
  exchangeRate = 0,
  isDutchAuction = false,
  auctionEndTime = Date.now() + 300000, // 5 minutes from now
  slippage = 0.5,
  fromAmount = 0,
  toAmount = 0,
}: PriceInfoProps) {
  if (!fromToken || !toToken || exchangeRate === 0) {
    return null;
  }

  const minimumReceived = toAmount * (1 - slippage / 100);
  const priceImpact = 0.2; // Mock price impact - would be calculated from liquidity pool data
  const usdValueFrom = fromAmount * 3723.88; // Mock USD price
  const usdValueTo = toAmount * 1.00; // Mock USD price for USDT

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
        </span>
        <span className="text-gray-400">~${(exchangeRate * 3723.88).toFixed(2)}</span>
      </div>

      {isDutchAuction && (
        <DutchAuctionTimer 
          endTime={auctionEndTime}
          onExpire={() => console.log("Auction expired")}
        />
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Slippage tolerance</span>
          <button className="text-violet-400 hover:text-violet-300 flex items-center gap-1">
            Auto {slippage}%
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Minimum receive</span>
          <div className="text-right">
            <div className="text-white">~${usdValueTo.toFixed(2)}</div>
            <div className="text-gray-500 text-xs">{minimumReceived.toFixed(6)} {toToken.symbol}</div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Network Fee</span>
          <span className="text-cyan-400 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Free
          </span>
        </div>
      </div>
    </div>
  );
}