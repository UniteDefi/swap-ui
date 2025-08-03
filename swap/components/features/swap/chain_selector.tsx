"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAccount, useSwitchChain } from "wagmi";
import { useState } from "react";
import { Lock } from "lucide-react";
import Image from "next/image";
import { supportedChains } from "@/lib/config/chains";
import { nonEvmChains } from "@/lib/config/non_evm_chains";
import { chainLogos, chainNames } from "@/lib/config/chain_logos";
import { useNonEvmWallet } from "@/lib/context/non_evm_wallet_context";
import { useUnifiedWallet } from "@/lib/hooks/use_unified_wallet";

// Combine EVM and non-EVM chains
const allChains = [
  // EVM Chains
  ...supportedChains.map(chain => ({
    id: chain.id,
    name: chainNames[chain.id] || chain.name,
    logo: chainLogos[chain.id] || "/logos/ethereum.png",
    isEVM: true,
    enabled: true,
  })),
  
  // Non-EVM Chains
  ...nonEvmChains.map(chain => ({
    id: chain.id,
    name: chain.name,
    logo: chainLogos[chain.id] || "/logos/ethereum.png",
    isEVM: false,
    enabled: true,
  })),
];

export function ChainSelector() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { wallets: nonEvmWallets } = useNonEvmWallet();
  const { walletType } = useUnifiedWallet();
  
  const [selectedChainId, setSelectedChainId] = useState(() => {
    if (walletType === "evm" && chain?.id) {
      return chain.id.toString();
    } else if (walletType === "non-evm" && nonEvmWallets[0]?.chain.id) {
      return nonEvmWallets[0].chain.id;
    }
    return "11155111"; // Default to Ethereum
  });

  const handleChainChange = (chainId: string) => {
    const selectedChain = allChains.find(c => c.id.toString() === chainId);
    if (selectedChain?.enabled) {
      setSelectedChainId(chainId);
      
      if (selectedChain.isEVM && walletType === "evm") {
        // Switch EVM chain
        switchChain?.({ chainId: parseInt(chainId) });
      } else if (!selectedChain.isEVM) {
        // For non-EVM chains, show a message
        console.log("[ChainSelector] Non-EVM chain selected:", selectedChain.name);
        alert(`Please connect a ${selectedChain.name} wallet to use this chain.`);
      }
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Select Chain</Label>
      <RadioGroup
        value={selectedChainId}
        onValueChange={handleChainChange}
        className="grid grid-cols-3 gap-3"
      >
        {allChains.map((chain) => {
          const isDisabled = !chain.enabled;
          return (
            <div key={chain.id} className="relative">
              <RadioGroupItem
                value={chain.id.toString()}
                id={chain.id.toString()}
                className="peer sr-only"
                disabled={isDisabled}
              />
              <Label
                htmlFor={chain.id.toString()}
                className={`flex flex-col items-center justify-center rounded-md border-2 p-3 transition-all duration-200 ${
                  isDisabled
                    ? "border-gray-800/50 bg-gray-900/20 cursor-not-allowed opacity-50"
                    : "border-violet-900/30 bg-black/40 hover:bg-violet-950/30 hover:border-violet-800/50 peer-data-[state=checked]:border-violet-500 peer-data-[state=checked]:bg-violet-950/40 [&:has([data-state=checked])]:border-violet-500 cursor-pointer"
                }`}
              >
                <div className="relative">
                  <Image 
                    src={chain.logo} 
                    alt={chain.name} 
                    width={32}
                    height={32}
                    className="mb-1 object-contain"
                  />
                  {isDisabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium">{chain.name}</span>
                {isDisabled && (
                  <span className="text-[10px] text-gray-500 mt-0.5">Coming Soon</span>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}