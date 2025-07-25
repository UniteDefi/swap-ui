"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { Token } from "./token_input";


interface TokenSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectToken: (token: Token) => void;
}

const POPULAR_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    coingeckoId: "ethereum",
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    coingeckoId: "usd-coin",
    logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    coingeckoId: "wrapped-bitcoin",
    logoURI: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    coingeckoId: "uniswap",
    logoURI: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    decimals: 18,
    coingeckoId: "chainlink",
    logoURI: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    decimals: 18,
    coingeckoId: "matic-network",
    logoURI: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  },
];

export function TokenSelectorDialog({
  open,
  onOpenChange,
  onSelectToken,
}: TokenSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = POPULAR_TOKENS.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#1b1b23] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Select a token</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="mt-4 max-h-[400px] overflow-y-auto">
          {filteredTokens.map((token) => (
            <button
              key={token.address}
              onClick={() => {
                onSelectToken(token);
                onOpenChange(false);
              }}
              className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-800 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {token.logoURI ? (
                    <Image
                      src={token.logoURI}
                      alt={token.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-bold">{token.symbol.slice(0, 2)}</span>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">{token.symbol}</div>
                  <div className="text-sm text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                0.00
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}