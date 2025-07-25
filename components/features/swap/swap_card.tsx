"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenInput, type Token } from "./token_input";
import { TokenSelectorDialog } from "./token_selector_dialog";
import { PriceInfo } from "./price_info";
import { SlippageModal } from "./slippage_modal";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTokenPrices } from "@/lib/hooks/use_token_prices";
import { useRouter, useSearchParams } from "next/navigation";
import { POPULAR_TOKENS } from "@/lib/constants/tokens";

export function SwapCard() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectingTokenFor, setSelectingTokenFor] = useState<"from" | "to">("from");
  const [slippage, setSlippage] = useState(0.5);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);

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
  
  // Parse URL params on mount
  useEffect(() => {
    const src = searchParams.get("src");
    const dst = searchParams.get("dst");
    const amount = searchParams.get("amount");
    const slippageParam = searchParams.get("slippage");
    
    if (src) {
      const [chainId, symbol] = src.split(":");
      const token = POPULAR_TOKENS.find(
        (t) => t.chainId === parseInt(chainId) && t.symbol === symbol
      );
      if (token) setFromToken(token);
    }
    
    if (dst) {
      const [chainId, symbol] = dst.split(":");
      const token = POPULAR_TOKENS.find(
        (t) => t.chainId === parseInt(chainId) && t.symbol === symbol
      );
      if (token) setToToken(token);
    }
    
    if (amount) setFromAmount(amount);
    if (slippageParam) setSlippage(parseFloat(slippageParam));
  }, [searchParams]);
  
  // Update URL when swap params change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (fromToken) {
      params.set("src", `${fromToken.chainId}:${fromToken.symbol}`);
    }
    if (toToken) {
      params.set("dst", `${toToken.chainId}:${toToken.symbol}`);
    }
    if (fromAmount) {
      params.set("amount", fromAmount);
    }
    if (slippage !== 0.5) {
      params.set("slippage", slippage.toString());
    }
    
    const queryString = params.toString();
    if (queryString) {
      router.replace(`?${queryString}`, { scroll: false });
    }
  }, [fromToken, toToken, fromAmount, slippage, router]);

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
              <TabsTrigger value="swap" className="data-[state=active]:text-violet-400 data-[state=inactive]:text-gray-500 font-semibold text-base pb-2 bg-transparent rounded-none border-b-2 data-[state=active]:border-violet-400 data-[state=inactive]:border-transparent w-full">Swap</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 hover:bg-gray-800"
            onClick={() => setSlippageModalOpen(true)}
          >
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
              <ArrowDown className="h-5 w-5 text-violet-400" />
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
            slippage={slippage}
            fromAmount={parseFloat(fromAmount)}
            toAmount={parseFloat(calculatedToAmount)}
          />
        )}
        
        <Button 
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold h-14 text-lg rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25" 
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
        
        <SlippageModal
          open={slippageModalOpen}
          onOpenChange={setSlippageModalOpen}
          slippage={slippage}
          onSlippageChange={setSlippage}
        />
      </CardContent>
    </Card>
  );
}