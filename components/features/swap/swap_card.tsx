"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenInput, type Token } from "./token_input";
import { ChainSelector } from "./chain_selector";
import { TokenSelectorDialog } from "./token_selector_dialog";
import { PriceInfo } from "./price_info";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTokenPrices } from "@/lib/hooks/use_token_prices";

export function SwapCard() {
  const { isConnected } = useAccount();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectingTokenFor, setSelectingTokenFor] = useState<"from" | "to">("from");

  // Get token prices from CoinGecko
  const tokenIds = [
    fromToken?.coingeckoId,
    toToken?.coingeckoId,
  ].filter(Boolean) as string[];
  
  const { prices } = useTokenPrices(tokenIds);

  // Calculate USD values
  const fromTokenPrice = fromToken?.coingeckoId && prices[fromToken.coingeckoId]?.usd || 0;
  const toTokenPrice = toToken?.coingeckoId && prices[toToken.coingeckoId]?.usd || 0;
  const fromUsdValue = fromAmount ? (parseFloat(fromAmount) * fromTokenPrice).toFixed(2) : "";
  
  // Calculate exchange rate and to amount
  const exchangeRate = fromTokenPrice && toTokenPrice ? fromTokenPrice / toTokenPrice : 0;
  const calculatedToAmount = fromAmount && exchangeRate ? (parseFloat(fromAmount) * exchangeRate).toFixed(6) : "";
  const toUsdValue = calculatedToAmount ? (parseFloat(calculatedToAmount) * toTokenPrice).toFixed(2) : "";

  useEffect(() => {
    if (calculatedToAmount) {
      setToAmount(calculatedToAmount);
    }
  }, [calculatedToAmount]);

  return (
    <Card className="w-full backdrop-blur-sm bg-[#1b1b23] shadow-2xl border border-gray-800 relative overflow-hidden rounded-2xl">
      {!isConnected && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <p className="text-lg font-semibold text-white">Connect wallet to start swapping</p>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="swap" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto">
              <TabsTrigger value="swap" className="data-[state=active]:text-blue-500 data-[state=inactive]:text-gray-500 font-semibold text-base pb-2 bg-transparent rounded-none border-b-2 data-[state=active]:border-blue-500 data-[state=inactive]:border-transparent">Swap</TabsTrigger>
              <TabsTrigger value="limit" className="data-[state=active]:text-blue-500 data-[state=inactive]:text-gray-500 font-semibold text-base pb-2 bg-transparent rounded-none border-b-2 data-[state=active]:border-blue-500 data-[state=inactive]:border-transparent">Limit</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="icon" className="ml-2">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <TokenInput
            label="From"
            value={fromAmount}
            onChange={setFromAmount}
            selectedToken={fromToken}
            onSelectToken={() => {
              setSelectingTokenFor("from");
              setTokenSelectorOpen(true);
            }}
            usdValue={fromUsdValue}
          />
          
          <div className="flex justify-center -my-2 relative z-10">
            <button className="h-10 w-10 rounded-lg bg-[#1b1b23] border border-gray-800 hover:bg-gray-800 transition-colors flex items-center justify-center">
              <ArrowDown className="h-5 w-5 text-blue-500" />
            </button>
          </div>
          
          <TokenInput
            label="To"
            value={toAmount}
            onChange={setToAmount}
            selectedToken={toToken}
            onSelectToken={() => {
              setSelectingTokenFor("to");
              setTokenSelectorOpen(true);
            }}
            readOnly
            usdValue={toUsdValue}
          />
        </div>
        
        {fromToken && toToken && fromAmount && exchangeRate > 0 && (
          <PriceInfo
            fromToken={fromToken}
            toToken={toToken}
            exchangeRate={exchangeRate}
            isDutchAuction={true}
            auctionEndTime={Date.now() + 180000}
          />
        )}
        
        <div className="pt-2">
          <ChainSelector />
        </div>
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 text-lg rounded-xl transition-all duration-200" 
          size="lg"
          disabled={!isConnected || !fromAmount || !fromToken || !toToken}
        >
          {!isConnected 
            ? "Connect wallet" 
            : !fromToken || !toToken
            ? "Select a token"
            : !fromAmount 
            ? "Enter an amount" 
            : "Swap"}
        </Button>
        
        <TokenSelectorDialog
          open={tokenSelectorOpen}
          onOpenChange={setTokenSelectorOpen}
          onSelectToken={(token) => {
            if (selectingTokenFor === "from") {
              setFromToken(token);
            } else {
              setToToken(token);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}