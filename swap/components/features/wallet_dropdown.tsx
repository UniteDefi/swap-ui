"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMultiWallet } from "@/lib/context/multi_wallet_context";
import { chainLogos } from "@/lib/config/chain_logos";
import Image from "next/image";
import { Copy, LogOut, Check, Plus } from "lucide-react";
import { useDisconnect } from "wagmi";
import { useNonEvmWallet } from "@/lib/context/non_evm_wallet_context";
import { WalletSelector } from "./wallet_selector";

export function WalletDropdown() {
  const { wallets, primaryWallet, totalConnected, setPrimaryWallet } = useMultiWallet();
  const { disconnect: disconnectEvm } = useDisconnect();
  const { disconnect: disconnectNonEvm } = useNonEvmWallet();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [walletSelectorOpen, setWalletSelectorOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleDisconnect = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;

    if (wallet.type === "evm") {
      disconnectEvm();
    } else {
      disconnectNonEvm(wallet.address);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!primaryWallet) {
    return (
      <>
        <Button
          onClick={() => setWalletSelectorOpen(true)}
          variant="default"
          className="min-w-[140px] bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl"
        >
          Connect Wallet
        </Button>
        <WalletSelector open={walletSelectorOpen} onOpenChange={setWalletSelectorOpen} />
      </>
    );
  }

  return (
    <>
      <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="min-w-[140px] bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center gap-2"
          >
            <span>{formatAddress(primaryWallet.address)}</span>
            {totalConnected > 1 && (
              <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                +{totalConnected - 1}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-[#1b1b23] border-gray-800" align="end">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Connected Wallets</h3>
            
            <div className="space-y-2">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer
                    ${wallet.id === primaryWallet.id ? "bg-purple-950/30 border border-purple-800" : "bg-gray-800/50 hover:bg-gray-800"}`}
                  onClick={() => setPrimaryWallet(wallet.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Image
                      src={chainLogos[wallet.chainId] || "/logos/ethereum.png"}
                      alt={wallet.chainName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {formatAddress(wallet.address)}
                        </span>
                        {wallet.id === primaryWallet.id && (
                          <span className="text-xs text-purple-400 font-medium">Primary</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {wallet.chainName} {wallet.walletType ? `• ${wallet.walletType}` : ""}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAddress(wallet.address);
                      }}
                    >
                      {copiedAddress === wallet.address ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-700 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnect(wallet.id);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setDropdownOpen(false);
                setWalletSelectorOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Another Wallet
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      <WalletSelector open={walletSelectorOpen} onOpenChange={setWalletSelectorOpen} />
    </>
  );
}