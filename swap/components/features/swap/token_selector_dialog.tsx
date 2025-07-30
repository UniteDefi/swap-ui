"use client";

import { useState, useMemo } from "react";
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
import { POPULAR_TOKENS, TOKENS_BY_SYMBOL } from "@/lib/constants/tokens";


interface TokenSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectToken: (token: Token) => void;
}

// Popular token symbols to show as quick select buttons
const QUICK_SELECT_TOKENS = ["ETH", "USDC", "USDT", "WETH", "UNI", "WBTC", "BNB", "1INCH"];

export function TokenSelectorDialog({
  open,
  onOpenChange,
  onSelectToken,
}: TokenSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Group tokens by symbol when searching
  const filteredTokenGroups = useMemo(() => {
    if (searchQuery) {
      const filtered = POPULAR_TOKENS.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered.reduce((acc, token) => {
        if (!acc[token.symbol]) {
          acc[token.symbol] = [];
        }
        acc[token.symbol].push(token);
        return acc;
      }, {} as Record<string, Token[]>);
    }
    return selectedSymbol && TOKENS_BY_SYMBOL[selectedSymbol] ? { [selectedSymbol]: TOKENS_BY_SYMBOL[selectedSymbol] } : {};
  }, [searchQuery, selectedSymbol]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#1b1b23] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Select a token</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or paste address"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedSymbol(null);
              }}
              className="pl-9 bg-[#0e0e15] border-gray-800"
            />
          </div>
          
          {!searchQuery && (
            <div className="flex flex-wrap gap-2">
              {QUICK_SELECT_TOKENS.map((symbol) => {
                const token = TOKENS_BY_SYMBOL[symbol]?.[0];
                if (!token) return null;
                return (
                  <button
                    key={symbol}
                    onClick={() => setSelectedSymbol(symbol)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                      selectedSymbol === symbol
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-gray-800 hover:border-gray-700"
                    } transition-all`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      {token.logoURI && (
                        <Image
                          src={token.logoURI}
                          alt={symbol}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium">{symbol}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="mt-4 max-h-[400px] overflow-y-auto space-y-4">
          {Object.entries(filteredTokenGroups).map(([symbol, tokens]) => (
            <div key={symbol} className="space-y-1">
              {tokens.length > 1 ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 border border-gray-800 rounded-lg bg-[#0e0e15]">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {tokens[0].logoURI ? (
                        <Image
                          src={tokens[0].logoURI}
                          alt={symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-bold">{symbol.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{symbol}</div>
                      <div className="text-sm text-gray-400">
                        {tokens[0].name} · {tokens.length} networks
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 space-y-1">
                    {tokens.map((token) => (
                      <button
                        key={`${token.chainId}-${token.address}`}
                        onClick={() => {
                          onSelectToken(token);
                          onOpenChange(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-gray-800 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium">
                            {token.chain.logo ? (
                              <Image
                                src={token.chain.logo}
                                alt={token.chain.name}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            ) : (
                              token.chain.shortName
                            )}
                          </div>
                          <span className="text-sm">{token.chain.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">$0</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    onSelectToken(tokens[0]);
                    onOpenChange(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-800 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {tokens[0].logoURI ? (
                        <Image
                          src={tokens[0].logoURI}
                          alt={tokens[0].symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-bold">{tokens[0].symbol.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{tokens[0].symbol}</span>
                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                          on {tokens[0].chain.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">{tokens[0].name}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    $0
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}