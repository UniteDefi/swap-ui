"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { nonEvmChains } from "@/lib/config/non_evm_chains";
import { useAppKit } from "@reown/appkit/react";
import { chainLogos } from "@/lib/config/chain_logos";
import Image from "next/image";
import { useNonEvmWallet } from "@/lib/context/non_evm_wallet_context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WalletSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletSelector({ open, onOpenChange }: WalletSelectorProps) {
  const [selectedWalletType, setSelectedWalletType] = useState<"evm" | "non-evm" | null>(null);
  const [selectedNonEvmWallet, setSelectedNonEvmWallet] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const { open: openAppKit } = useAppKit();
  const { connect: connectNonEvmWallet, isConnecting, wallets: nonEvmWallets } = useNonEvmWallet();
  
  // Reset states when dialog opens
  const resetStates = () => {
    setSelectedWalletType(null);
    setSelectedNonEvmWallet(null);
    setSelectedChainId(null);
    setSearchQuery("");
    setConnectionSuccess(false);
  };
  
  // Reset when dialog opens
  useEffect(() => {
    if (open && !connectionSuccess) {
      resetStates();
    }
  }, [open, connectionSuccess]);

  const handleEvmWalletConnect = () => {
    openAppKit();
    // Keep dialog open to show connection status
  };

  const handleNonEvmChainSelect = (chainId: string) => {
    console.log("[WalletSelector] Selected non-EVM chain:", chainId);
    const chain = nonEvmChains.find(c => c.id === chainId);
    if (chain) {
      setSelectedChainId(chainId);
      setSelectedNonEvmWallet(chain.walletType);
    }
  };
  
  const handleNonEvmConnect = async () => {
    if (!selectedNonEvmWallet || !selectedChainId) {
      alert("Please select a chain to connect to");
      return;
    }
    
    try {
      await connectNonEvmWallet(selectedNonEvmWallet, selectedChainId);
      setConnectionSuccess(true);
      // Keep dialog open to allow connecting more wallets
    } catch (error) {
      console.error("[WalletSelector] Error connecting wallet:", error);
    }
  };
  
  const filteredChains = nonEvmChains.filter(chain => 
    chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chain.nativeCurrency.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleBack = () => {
    resetStates();
  };
  
  const handleForceReset = () => {
    resetStates();
  };

  // Check if a non-EVM chain is already connected
  const isChainConnected = (chainId: string) => {
    return nonEvmWallets.some(w => w.chain.id === chainId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            {connectionSuccess 
              ? "Successfully connected! You can connect more wallets or close this dialog."
              : "Choose your wallet type to connect to UniteDefi"
            }
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search chains..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <ScrollArea className="h-[400px] pr-4">
                  <RadioGroup
                    value={selectedChainId || ""}
                    onValueChange={handleNonEvmChainSelect}
                    className="grid gap-2"
                  >
                    {filteredChains.map((chain) => (
                      <div key={chain.id} className="relative">
                        <RadioGroupItem
                          value={chain.id}
                          id={chain.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={chain.id}
                          className={`flex items-center gap-3 rounded-md border-2 p-3 cursor-pointer transition-all
                            ${isChainConnected(chain.id) 
                              ? "border-green-800 bg-green-950/20" 
                              : "border-gray-800 hover:border-purple-800 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-950/20"
                            }`}
                        >
                          <Image
                            src={chainLogos[chain.id] || "/logos/ethereum.png"}
                            alt={chain.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{chain.name}</span>
                              {isChainConnected(chain.id) && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {chain.nativeCurrency.symbol} • {chain.walletType}
                              {isChainConnected(chain.id) && " • Connected"}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollArea>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleNonEvmConnect}
                    disabled={!selectedChainId || isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                  {connectionSuccess && (
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Done
                    </Button>
                  )}
                </div>
                
                {connectionSuccess && (
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={handleForceReset}
                    >
                      Connect Another Wallet
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}