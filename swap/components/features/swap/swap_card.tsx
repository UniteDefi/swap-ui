"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings, ArrowDown, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenInput, type Token } from "./token_input";
import { TokenSelectorDialog } from "./token_selector_dialog";
import { PriceInfo } from "./price_info";
import { SlippageModal } from "./slippage_modal";
import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useTokenPrices } from "@/lib/hooks/use_token_prices";
import { useRouter, useSearchParams } from "next/navigation";
import { POPULAR_TOKENS } from "@/lib/constants/tokens";
import { generateSecret, generateSecretHash, storeSecret } from "@/lib/utils/htlc";
import { useTokenApproval } from "@/lib/hooks/use_token_approval";
import { useSwapStatus } from "@/lib/hooks/use_swap_status";
import { parseUnits } from "viem";
import type { CreateSwapRequest } from "@/app/api/create-swap/route";

export function SwapCard() {
  const { isConnected, address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
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
  const [escrowAddress, setEscrowAddress] = useState<string | null>(null);
  
  // Swap status management
  const { status, statusData, updateStatus } = useSwapStatus();
  
  // Token approval hook - we'll set the escrow address once we get it
  const {
    approve,
    isSuccess: isApprovalSuccess,
  } = useTokenApproval({
    tokenAddress: fromToken?.address as `0x${string}` | undefined,
    spenderAddress: escrowAddress as `0x${string}` | undefined,
    amount: fromAmount,
    decimals: fromToken?.decimals || 18
  });

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

  // Handle approval success
  useEffect(() => {
    if (isApprovalSuccess && status === "approving_token") {
      updateStatus("waiting_for_relayer");
    }
  }, [isApprovalSuccess, status, updateStatus]);

  // Main swap handler
  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !address) return;

    try {
      // Check if we need to switch chains
      if (chainId !== fromToken.chainId) {
        updateStatus("idle");
        await switchChain({ chainId: fromToken.chainId });
        return;
      }

      // Generate HTLC secret
      updateStatus("generating_secret");
      const secret = generateSecret();
      const secretHash = generateSecretHash(secret);
      
      console.log("[SwapCard] Generated secret:", { secret, secretHash });

      // First, we need to create the order to get the escrow address
      updateStatus("creating_order");
      
      const swapRequest: CreateSwapRequest = {
        sourceChainId: fromToken.chainId,
        destChainId: toToken.chainId,
        sourceToken: fromToken.address,
        destToken: toToken.address,
        sourceAmount: parseUnits(fromAmount, fromToken.decimals).toString(),
        userAddress: address,
        secretHash,
        secret,
        minAcceptablePrice: "0", // TODO: Calculate based on slippage
        orderDuration: 3600, // 1 hour default
        signature: "", // Will be populated by the API
      };

      const response = await fetch("/api/create-swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(swapRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create swap order");
      }

      const data = await response.json();
      console.log("[SwapCard] Swap order created:", data);

      // Store the secret for later use
      storeSecret(data.orderId, secret);

      // Update status with order details
      updateStatus("waiting_for_relayer", {
        orderId: data.orderId,
        escrowAddress: data.escrowAddress,
        relayerAddress: data.relayerAddress,
        expiryTime: data.expiryTime,
      });

      // Set escrow address for approval
      setEscrowAddress(data.escrowAddress);

      // Now approve the token
      updateStatus("approving_token");
      await approve();

    } catch (error) {
      console.error("[SwapCard] Swap error:", error);
      updateStatus("failed", {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };


  // Get button text based on status
  const getButtonText = () => {
    if (!isConnected) return "Connect wallet";
    if (!fromToken || !toToken) return "Select a token";
    if (!fromAmount) return "Enter an amount";
    if (chainId !== fromToken.chainId) return `Switch to ${fromToken.chain.name}`;
    
    switch (status) {
      case "generating_secret":
        return "Generating Secret...";
      case "approving_token":
        return "Approving Token...";
      case "creating_order":
        return "Creating Order...";
      case "waiting_for_relayer":
        return "Waiting for Relayer...";
      case "relayer_deposited":
        return "Claim Tokens";
      case "user_claiming":
        return "Claiming...";
      case "completed":
        return "Swap Completed";
      case "failed":
        return "Swap Failed";
      case "timeout":
        return "Swap Timeout";
      default:
        return "Swap";
    }
  };

  // Get button icon based on status
  const getButtonIcon = () => {
    switch (status) {
      case "generating_secret":
      case "approving_token":
      case "creating_order":
      case "waiting_for_relayer":
      case "user_claiming":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5" />;
      case "failed":
      case "timeout":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const isButtonDisabled = !isConnected || 
    !fromAmount || 
    !fromToken || 
    !toToken || 
    status !== "idle" && status !== "relayer_deposited";

  return (
    <Card className="w-full backdrop-blur-sm bg-[#1b1b23] shadow-2xl border border-gray-800 relative rounded-2xl">
      {!isConnected && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
          <p className="text-lg font-semibold text-white">Connect wallet to start swapping</p>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Swap</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-800"
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
          
          <div className="flex justify-center -my-4 relative z-10">
            <button 
              onClick={() => {
                const tempToken = fromToken;
                const tempAmount = fromAmount;
                setFromToken(toToken);
                setToToken(tempToken);
                setFromAmount(toAmount);
                setToAmount(tempAmount);
              }}
              className="h-10 w-10 rounded-lg bg-[#1b1b23] border border-gray-800 hover:bg-gray-800 transition-all duration-300 flex items-center justify-center group"
            >
              <ArrowDown className="h-5 w-5 text-violet-400 transition-transform duration-300 group-hover:rotate-180" />
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
            isDutchAuction={false}
            auctionEndTime={Date.now() + 180000}
            slippage={slippage}
            toAmount={parseFloat(calculatedToAmount)}
            fromTokenPrice={fromTokenPrice}
            toTokenPrice={toTokenPrice}
            onSlippageClick={() => setSlippageModalOpen(true)}
          />
        )}
        
        <Button 
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold h-14 text-lg rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2" 
          size="lg"
          disabled={isButtonDisabled}
          onClick={handleSwap}
        >
          {getButtonIcon()}
          {getButtonText()}
        </Button>
        
        {/* Show swap status details */}
        {status !== "idle" && statusData.orderId && (
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Order ID:</span>
              <span className="text-white font-mono">{statusData.orderId.slice(0, 8)}...</span>
            </div>
            {statusData.escrowAddress && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Escrow:</span>
                <span className="text-white font-mono">{statusData.escrowAddress.slice(0, 6)}...{statusData.escrowAddress.slice(-4)}</span>
              </div>
            )}
            {status === "waiting_for_relayer" && statusData.expiryTime && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Expires in:</span>
                <span className="text-white">
                  {Math.max(0, Math.floor((statusData.expiryTime - Date.now()) / 1000))}s
                </span>
              </div>
            )}
          </div>
        )}
        
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