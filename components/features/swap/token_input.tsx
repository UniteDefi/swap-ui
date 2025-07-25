"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";

export interface Chain {
  id: number;
  name: string;
  shortName: string;
  logo?: string;
}

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  chain: Chain;
  coingeckoId?: string;
}

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  selectedToken: Token | null;
  onSelectToken: () => void;
  readOnly?: boolean;
  balance?: string;
  usdValue?: string;
}

export function TokenInput({
  label,
  value,
  onChange,
  selectedToken,
  onSelectToken,
  readOnly = false,
  balance,
  usdValue,
}: TokenInputProps) {
  const { address } = useAccount();
  const { data: tokenBalance } = useBalance({
    address,
    token: selectedToken?.address as `0x${string}` | undefined,
    query: {
      enabled: !!selectedToken && !!address,
    },
  });
  const displayBalance = tokenBalance ? parseFloat(tokenBalance.formatted).toFixed(4) : "0";

  return (
    <div className="rounded-xl bg-[#0e0e15] p-4 transition-all hover:bg-[#15151f]">
      <div className="flex justify-between mb-3">
        <span className="text-xs text-gray-500">{label === "From" ? "You pay" : "You receive"}</span>
        {address && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Balance: {displayBalance}</span>
            {label === "From" && (
              <button className="text-xs text-violet-400 hover:text-violet-300 font-medium">MAX</button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            className="border-0 bg-transparent text-3xl font-semibold focus-visible:ring-0 p-0 text-white placeholder:text-gray-600"
          />
          {usdValue && (
            <div className="text-sm text-gray-500 mt-1">~${usdValue}</div>
          )}
        </div>
        
        <Button
          variant="ghost"
          onClick={onSelectToken}
          className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-gray-800 rounded-lg"
        >
          {selectedToken ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                {selectedToken.logoURI ? (
                  <Image
                    src={selectedToken.logoURI}
                    alt={selectedToken.symbol}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-xs font-bold">{selectedToken.symbol.slice(0, 2)}</span>
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{selectedToken.symbol}</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>
                <div className="text-xs text-gray-500">on {selectedToken.chain.name}</div>
              </div>
            </>
          ) : (
            <span className="font-medium text-white">Select token</span>
          )}
        </Button>
      </div>
    </div>
  );
}