"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAccount, useSwitchChain } from "wagmi";
import { useState } from "react";
import { Lock } from "lucide-react";

// Define all chains with their details
const allChains = [
  // EVM Chains
  { id: 11155111, name: "Ethereum", logo: "/logos/ethereum.png", isEVM: true, enabled: true },
  { id: 80002, name: "Polygon", logo: "/logos/polygon.png", isEVM: true, enabled: true },
  { id: 97, name: "BNB", logo: "/logos/bnb.png", isEVM: true, enabled: true },
  { id: 421614, name: "Arbitrum", logo: "/logos/arbitrum.png", isEVM: true, enabled: true },
  { id: 84532, name: "Base", logo: "/logos/base.png", isEVM: true, enabled: true },
  { id: 128123, name: "Etherlink", logo: "/logos/etherlink.png", isEVM: true, enabled: true },
  { id: 713715, name: "Sei", logo: "/logos/sei.png", isEVM: true, enabled: true },
  { id: 41454, name: "Monad", logo: "/logos/monad.png", isEVM: true, enabled: true },
  
  // Non-EVM Chains (disabled for now)
  { id: 999001, name: "Aptos", logo: "/logos/aptos.png", isEVM: false, enabled: false },
  { id: 999002, name: "Bitcoin", logo: "/logos/bitcoin.png", isEVM: false, enabled: false },
  { id: 999003, name: "Injective", logo: "/logos/injective.png", isEVM: false, enabled: false },
  { id: 999004, name: "Osmosis", logo: "/logos/osmosis.png", isEVM: false, enabled: false },
  { id: 999005, name: "Near", logo: "/logos/near.png", isEVM: false, enabled: false },
  { id: 999006, name: "Sui", logo: "/logos/sui.png", isEVM: false, enabled: false },
  { id: 999007, name: "Tron", logo: "/logos/tron.png", isEVM: false, enabled: false },
  { id: 999008, name: "Stellar", logo: "/logos/stellar.png", isEVM: false, enabled: false },
  { id: 999009, name: "TON", logo: "/logos/ton.png", isEVM: false, enabled: false },
  { id: 999010, name: "Cardano", logo: "/logos/cardano.png", isEVM: false, enabled: false },
  { id: 999011, name: "XRP", logo: "/logos/xrp.png", isEVM: false, enabled: false },
  { id: 999012, name: "ICP", logo: "/logos/icp.png", isEVM: false, enabled: false },
  { id: 999013, name: "Tezos", logo: "/logos/tezos.png", isEVM: false, enabled: false },
  { id: 999014, name: "Polkadot", logo: "/logos/polkadot.png", isEVM: false, enabled: false },
  { id: 999015, name: "EOS", logo: "/logos/eos.png", isEVM: false, enabled: false },
];

export function ChainSelector() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [selectedChainId, setSelectedChainId] = useState(
    chain?.id?.toString() || "11155111" // Default to Ethereum
  );

  const handleChainChange = (chainId: string) => {
    const selectedChain = allChains.find(c => c.id.toString() === chainId);
    if (selectedChain?.enabled) {
      setSelectedChainId(chainId);
      switchChain?.({ chainId: parseInt(chainId) });
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
                  <img 
                    src={chain.logo} 
                    alt={chain.name} 
                    className="w-8 h-8 mb-1 object-contain"
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