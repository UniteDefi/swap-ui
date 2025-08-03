"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CHAINS } from "@/lib/constants/tokens";
import deployments from "@/lib/constants/deployments.json";
import Image from "next/image";
import { chainLogos } from "@/lib/config/chain_logos";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface MintTokensModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MintableToken {
  symbol: string;
  name: string;
  address: string;
  chainId: string | number;
  chainName: string;
  logo?: string;
}

export function MintTokensModal({ open, onOpenChange }: MintTokensModalProps) {
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("1000");
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<"idle" | "success" | "error">("idle");
  const [mintMessage, setMintMessage] = useState<string>("");

  // Get all chains that have deployments
  const availableChains = Object.entries(deployments)
    .filter(([, deployment]) => 
      deployment.mockUsdtAddress || deployment.mockDaiAddress || deployment.mockWrappedNativeAddress
    )
    .map(([chainId, deployment]) => ({
      id: chainId,
      name: deployment.chainName,
      logo: chainLogos[chainId],
    }));

  // Get mintable tokens for selected chain
  const getMintableTokens = (chainId: string): MintableToken[] => {
    const deployment = deployments[chainId as keyof typeof deployments];
    if (!deployment) return [];

    const tokens: MintableToken[] = [];
    
    if (deployment.mockUsdtAddress) {
      tokens.push({
        symbol: "USDT",
        name: "Tether USD",
        address: deployment.mockUsdtAddress,
        chainId,
        chainName: deployment.chainName,
        logo: "/logos/usdt.png",
      });
    }
    
    if (deployment.mockDaiAddress) {
      tokens.push({
        symbol: "DAI",
        name: "Dai Stablecoin",
        address: deployment.mockDaiAddress,
        chainId,
        chainName: deployment.chainName,
        logo: "/logos/dai.png",
      });
    }
    
    if (deployment.mockWrappedNativeAddress) {
      const chain = CHAINS[chainId];
      const wrappedSymbol = chain ? `W${chain.shortName}` : "W???";
      const wrappedName = `Wrapped ${chain?.shortName || "Native"}`;
      
      tokens.push({
        symbol: wrappedSymbol,
        name: wrappedName,
        address: deployment.mockWrappedNativeAddress,
        chainId,
        chainName: deployment.chainName,
        logo: chain?.logo,
      });
    }

    return tokens;
  };

  const mintableTokens = selectedChain ? getMintableTokens(selectedChain) : [];

  const handleMint = async () => {
    if (!selectedChain || !selectedToken || !amount) return;

    setIsMinting(true);
    setMintStatus("idle");
    
    try {
      // For now, we'll just simulate the minting process
      // In a real implementation, this would call the appropriate mint function
      // based on whether it's an EVM or non-EVM chain
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction time
      
      // Check if it's EVM or non-EVM
      const isEvm = typeof selectedChain === "string" && !isNaN(Number(selectedChain));
      
      if (isEvm) {
        // For EVM chains, you would call the contract mint function
        setMintMessage(`Successfully minted ${amount} ${selectedToken} on ${CHAINS[selectedChain]?.name || selectedChain}`);
      } else {
        // For non-EVM chains, you would use the appropriate wallet manager
        setMintMessage(`Successfully minted ${amount} ${selectedToken} on ${CHAINS[selectedChain]?.name || selectedChain}`);
      }
      
      setMintStatus("success");
    } catch (error) {
      console.error("[MintTokens] Mint error:", error);
      setMintStatus("error");
      setMintMessage("Failed to mint tokens. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  const handleReset = () => {
    setSelectedChain("");
    setSelectedToken("");
    setAmount("1000");
    setMintStatus("idle");
    setMintMessage("");
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-[#1b1b23] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Mint Test Tokens</DialogTitle>
          <DialogDescription className="text-gray-400">
            Mint free test tokens for demo purposes. These are mock tokens with no real value.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mintStatus === "idle" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="chain" className="text-white">Select Chain</Label>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="bg-[#0e0e15] border-gray-800 text-white">
                    <SelectValue placeholder="Choose a chain" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1b1b23] border-gray-800">
                    {availableChains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id} className="text-white hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          {chain.logo && (
                            <Image
                              src={chain.logo}
                              alt={chain.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          )}
                          <span>{chain.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedChain && (
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-white">Select Token</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger className="bg-[#0e0e15] border-gray-800 text-white">
                      <SelectValue placeholder="Choose a token" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1b1b23] border-gray-800">
                      {mintableTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="text-white hover:bg-gray-800">
                          <div className="flex items-center gap-2">
                            {token.logo && (
                              <Image
                                src={token.logo}
                                alt={token.symbol}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            )}
                            <span>{token.symbol} - {token.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedToken && (
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-[#0e0e15] border-gray-800 text-white"
                  />
                </div>
              )}
            </>
          )}

          {mintStatus === "success" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-center text-green-400">{mintMessage}</p>
            </div>
          )}

          {mintStatus === "error" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-center text-red-400">{mintMessage}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {mintStatus === "idle" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-800 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleMint}
                  disabled={!selectedChain || !selectedToken || !amount || isMinting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    "Mint Tokens"
                  )}
                </Button>
              </>
            )}

            {(mintStatus === "success" || mintStatus === "error") && (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-800 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Mint More
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}