"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { nonEvmWalletTypes, nonEvmChains } from "@/lib/config/non_evm_chains";
import { useAppKit } from "@reown/appkit/react";
import { chainLogos } from "@/lib/config/chain_logos";
import Image from "next/image";

interface WalletSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletSelector({ open, onOpenChange }: WalletSelectorProps) {
  const [selectedWalletType, setSelectedWalletType] = useState<"evm" | "non-evm" | null>(null);
  const { open: openAppKit } = useAppKit();

  const handleEvmWalletConnect = () => {
    onOpenChange(false);
    openAppKit();
  };

  const handleNonEvmWalletSelect = (walletType: string) => {
    console.log("[WalletSelector] Selected non-EVM wallet type:", walletType);
    // Show a toast with implementation instructions
    const walletNames: Record<string, string> = {
      aptos: "Aptos (Petra, Martian)",
      sui: "Sui (Sui Wallet, Ethos)",
      cardano: "Cardano (Nami, Eternl)",
      stellar: "Stellar (Freighter)",
      cosmos: "Cosmos (Keplr)",
      xrpl: "XRPL (Xumm)",
      ton: "TON (Tonkeeper)",
      near: "NEAR (NEAR Wallet)",
      polkadot: "Polkadot (Polkadot.js)",
      starknet: "Starknet (Argent X)",
    };
    
    alert(`${walletNames[walletType]} wallet integration coming soon! Check WALLET_INTEGRATION.md for implementation details.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose your wallet type to connect to UniteDefi
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="selection" value={selectedWalletType ? "wallets" : "selection"}>
          <TabsList className="hidden">
            <TabsTrigger value="selection">Selection</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="selection" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => setSelectedWalletType("evm")}
              >
                <CardHeader>
                  <CardTitle className="text-lg">EVM Wallets</CardTitle>
                  <CardDescription>
                    MetaMask, WalletConnect, Coinbase, and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect to Ethereum, Polygon, Arbitrum, Base, and other EVM chains
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => setSelectedWalletType("non-evm")}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Non-EVM Wallets</CardTitle>
                  <CardDescription>
                    Aptos, Sui, Cardano, Stellar, and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect to non-EVM blockchains
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="wallets" className="space-y-4">
            {selectedWalletType === "evm" && (
              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleEvmWalletConnect}
                >
                  Connect EVM Wallet
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedWalletType(null)}
                >
                  Back
                </Button>
              </div>
            )}
            
            {selectedWalletType === "non-evm" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  {nonEvmWalletTypes.map((walletType) => {
                    const chains = walletType.chains.map(chainId => 
                      nonEvmChains.find(c => c.id === chainId)
                    ).filter(Boolean);
                    
                    return (
                      <Button
                        key={walletType.id}
                        variant="outline"
                        className="justify-start h-auto py-3"
                        onClick={() => handleNonEvmWalletSelect(walletType.id)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex -space-x-2">
                            {chains.slice(0, 3).map((chain, idx) => chain && (
                              <div key={chain.id} className="relative w-8 h-8">
                                <Image
                                  src={chainLogos[chain.id] || "/logos/ethereum.png"}
                                  alt={chain.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full border-2 border-background"
                                  style={{ zIndex: 3 - idx }}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{walletType.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {chains.map(c => c?.name).join(", ")}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedWalletType(null)}
                >
                  Back
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}