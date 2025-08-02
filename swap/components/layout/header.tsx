"use client";

import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useMultiChainBalances } from "@/lib/hooks/use_multi_chain_balances";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BalanceDropdown } from "@/components/features/balance_dropdown";
import { ShimmerLoader } from "@/components/ui/shimmer";
import { useState } from "react";
import { OrdersSheet } from "@/components/features/orders_sheet";
import { Receipt } from "lucide-react";
import { WalletSelector } from "@/components/features/wallet_selector";

export function Header() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { balances, totalUsdValue, isLoading } = useMultiChainBalances();
  const [balanceDropdownOpen, setBalanceDropdownOpen] = useState(false);
  const [ordersSheetOpen, setOrdersSheetOpen] = useState(false);
  const [walletSelectorOpen, setWalletSelectorOpen] = useState(false);
  
  const formatUsdValue = (value: number) => {
    if (value < 0.01) return "<$0.01";
    if (value > 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value > 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/30 bg-[#0e0e15]/40 backdrop-blur-xl backdrop-saturate-150">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="UniteDefi Logo"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <h1 className="text-xl font-bold text-white font-orbitron">
              UniteDefi
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected && address && (
              <>
                <Button
                  onClick={() => setOrdersSheetOpen(true)}
                  variant="ghost"
                  className="h-10 px-3 hover:bg-gray-800 rounded-xl flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-white">Your Orders</span>
                </Button>

                <Popover open={balanceDropdownOpen} onOpenChange={setBalanceDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 px-3 hover:bg-gray-800 rounded-xl"
                    >
                      {isLoading ? (
                        <ShimmerLoader className="h-5 w-16 rounded bg-gray-800" />
                      ) : (
                        <span className="font-semibold text-white">
                          {formatUsdValue(totalUsdValue)}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-[380px] p-0 bg-[#1b1b23] border-gray-800" 
                    align="end"
                  >
                    <BalanceDropdown 
                      balances={balances}
                      totalUsdValue={totalUsdValue}
                      isLoading={isLoading}
                    />
                  </PopoverContent>
                </Popover>
              </>
            )}
            
            <Button
              onClick={() => isConnected ? open() : setWalletSelectorOpen(true)}
              variant="default"
              className={`min-w-[140px] ${isConnected ? "bg-gray-800 hover:bg-gray-700" : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"} rounded-xl`}
            >
              {isConnected && address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
      
      <OrdersSheet open={ordersSheetOpen} onOpenChange={setOrdersSheetOpen} />
      <WalletSelector open={walletSelectorOpen} onOpenChange={setWalletSelectorOpen} />
    </header>
  );
}