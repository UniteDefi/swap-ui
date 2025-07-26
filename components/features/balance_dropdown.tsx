"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { TokenBalance } from "@/lib/hooks/use_multi_chain_balances";
import { ShimmerLoader } from "@/components/ui/shimmer";

interface BalanceDropdownProps {
  balances: TokenBalance[];
  totalUsdValue: number;
  isLoading: boolean;
}

export function BalanceDropdown({ balances, totalUsdValue, isLoading }: BalanceDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBalances = useMemo(() => {
    if (!searchQuery) return balances;
    
    const query = searchQuery.toLowerCase();
    return balances.filter(
      (balance) =>
        balance.token.symbol.toLowerCase().includes(query) ||
        balance.token.name.toLowerCase().includes(query) ||
        balance.chain.name.toLowerCase().includes(query)
    );
  }, [balances, searchQuery]);

  const formatUsdValue = (value: number) => {
    if (value < 0.01) return "<$0.01";
    return `$${value.toFixed(2)}`;
  };

  const formatBalance = (balance: string, decimals: number = 4) => {
    const num = parseFloat(balance);
    if (num === 0) return "0";
    if (num < 0.0001) return "<0.0001";
    return num.toFixed(decimals);
  };

  return (
    <div className="w-[380px]">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Your Assets</h3>
          <div className="text-right">
            {isLoading ? (
              <ShimmerLoader className="h-6 w-24 rounded bg-gray-800" />
            ) : (
              <p className="text-xl font-bold text-white">{formatUsdValue(totalUsdValue)}</p>
            )}
            <p className="text-xs text-gray-500">Total Balance</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search token or chain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#0e0e15] border-gray-800 text-white placeholder:text-gray-600"
          />
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-2">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-[#0e0e15]">
                  <ShimmerLoader className="h-12 w-full rounded bg-gray-800" />
                </div>
              ))}
            </div>
          ) : filteredBalances.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {searchQuery ? "No assets found" : "No assets in your wallet"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredBalances.map((balance, index) => (
                <div
                  key={`${balance.token.address}-${balance.chain.id}-${index}`}
                  className="p-3 rounded-lg hover:bg-[#0e0e15] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          {balance.token.logoURI ? (
                            <Image
                              src={balance.token.logoURI}
                              alt={balance.token.symbol}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-bold text-white">
                              {balance.token.symbol.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1b1b23] p-0.5">
                          {balance.chain.logo ? (
                            <Image
                              src={balance.chain.logo}
                              alt={balance.chain.name}
                              width={16}
                              height={16}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-600" />
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{balance.token.symbol}</span>
                          <span className="text-xs text-gray-500">on {balance.chain.name}</span>
                        </div>
                        <p className="text-sm text-gray-400">{balance.token.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-white">{formatBalance(balance.balanceFormatted)}</p>
                      <p className="text-sm text-gray-500">{formatUsdValue(balance.usdValue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}