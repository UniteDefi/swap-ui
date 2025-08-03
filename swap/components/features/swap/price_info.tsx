"use client";

// import { TrendingDown } from "lucide-react"; // Unused import
import { DutchAuctionTimer } from "./dutch_auction_timer";
import { CrossChainIcon } from "@/components/ui/cross-chain-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface PriceInfoProps {
  fromToken?: { symbol: string; coingeckoId?: string } | null;
  toToken?: { symbol: string; coingeckoId?: string } | null;
  exchangeRate?: number;
  isDutchAuction?: boolean;
  auctionEndTime?: number;
  slippage?: number;
  toAmount?: number;
  fromTokenPrice?: number;
  toTokenPrice?: number;
  onSlippageClick?: () => void;
}

export function PriceInfo({
  fromToken,
  toToken,
  exchangeRate = 0,
  isDutchAuction = false,
  auctionEndTime = Date.now() + 300000, // 5 minutes from now
  slippage = 0.5,
  toAmount = 0,
  fromTokenPrice = 0,
  toTokenPrice = 0,
  onSlippageClick,
}: PriceInfoProps) {
  if (!fromToken || !toToken || exchangeRate === 0) {
    return null;
  }

  const minimumReceived = toAmount * (1 - slippage / 100);
  // const priceImpact = 0.2; // Would be calculated from liquidity pool data
  // const usdValueFrom = fromAmount * fromTokenPrice;
  // const usdValueTo = toAmount * toTokenPrice;
  const exchangeRateUSD = fromTokenPrice; // USD value of 1 fromToken

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
        </span>
        <span className="text-gray-400">~${exchangeRateUSD.toFixed(2)}</span>
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
          <button
            onClick={onSlippageClick}
            className="text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            Auto {slippage}%
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Minimum receive</span>
          <div className="text-right">
            <div className="text-white">
              ~${(minimumReceived * toTokenPrice).toFixed(2)}
            </div>
            <div className="text-gray-500 text-xs">
              {minimumReceived.toFixed(6)} {toToken.symbol}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Network Fee</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-cyan-400 flex items-center gap-1 cursor-help">
                  <CrossChainIcon className="h-4 w-4" />
                  Free
                </span>
              </TooltipTrigger>
              <TooltipContent 
                side="left" 
                sideOffset={5}
                className="max-w-xs p-4 bg-[#1b1b23] border-gray-700"
              >
                <p className="text-sm text-gray-300">
                  1inch Cross-chain enables seamless Cross-chain swaps, offering
                  self-custodial security, gasless transactions and MEV
                  protection across multiple networks
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-auto p-1 text-xs hover:bg-gray-800 text-violet-400"
                  onClick={() =>
                    window.open(
                      "https://help.1inch.io/en/articles/9842591-what-is-1inch-fusion-and-how-does-it-work",
                      "_blank"
                    )
                  }
                >
                  Learn more
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
