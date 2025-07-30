"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supportedChains, chainConfigs } from "@/lib/config/chains";
import { useAccount, useSwitchChain } from "wagmi";
import { useState } from "react";

export function ChainSelector() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [selectedChainId, setSelectedChainId] = useState(
    chain?.id?.toString() || supportedChains[0].id.toString()
  );

  const handleChainChange = (chainId: string) => {
    setSelectedChainId(chainId);
    switchChain?.({ chainId: parseInt(chainId) });
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Select Chain</Label>
      <RadioGroup
        value={selectedChainId}
        onValueChange={handleChainChange}
        className="grid grid-cols-2 gap-3"
      >
        {supportedChains.map((chain) => {
          const config = chainConfigs[chain.id];
          return (
            <div key={chain.id}>
              <RadioGroupItem
                value={chain.id.toString()}
                id={chain.id.toString()}
                className="peer sr-only"
              />
              <Label
                htmlFor={chain.id.toString()}
                className="flex items-center justify-center rounded-md border-2 border-violet-900/30 bg-black/40 p-3 hover:bg-violet-950/30 hover:border-violet-800/50 peer-data-[state=checked]:border-violet-500 peer-data-[state=checked]:bg-violet-950/40 [&:has([data-state=checked])]:border-violet-500 cursor-pointer transition-all duration-200"
              >
                <span className="text-sm font-medium">{config.name}</span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}