"use client";

import { useState } from "react";
import { useWalletState } from "@/hooks/use-wallet-state";
import { SUPPORTED_CHAINS } from "@/lib/wallet-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Copy,
  Eye,
  EyeOff,
  Settings,
  LogOut,
  Download,
  Send,
  ArrowDownUp,
  Plus,
} from "lucide-react";

export function WalletDashboard() {
  const { walletState, lockWallet, exportWallets } = useWalletState();
  const [showBalances, setShowBalances] = useState(true);
  const [copied, setCopied] = useState("");

  const handleCopyAddress = async (address: string, chainId: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(chainId);
      setTimeout(() => setCopied(""), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleExportWallets = () => {
    const password = prompt("Enter your password to export wallets:");
    if (password) {
      try {
        const exportData = exportWallets(password);
        const blob = new Blob([exportData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `unite-wallets-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        alert("Failed to export wallets. Check your password.");
      }
    }
  };

  const getCurrentWallet = () => walletState.currentWallet;
  const wallet = getCurrentWallet();

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No wallet found</div>
      </div>
    );
  }

  // Group accounts by chain type
  const evmChains = wallet.accounts.filter((account) => {
    const chain = SUPPORTED_CHAINS.find((c) => c.id === account.chainId);
    return chain?.addressFormat === "ethereum";
  });

  const nonEvmChains = wallet.accounts.filter((account) => {
    const chain = SUPPORTED_CHAINS.find((c) => c.id === account.chainId);
    return chain?.addressFormat !== "ethereum";
  });

  const getChainInfo = (chainId: string) => {
    return SUPPORTED_CHAINS.find((c) => c.id === chainId);
  };

  // return (
  //   <div className="min-h-screen bg-transparent">
  //     {/* Header */}
  //     <div className="border-b border-violet-800 bg-black/40 backdrop-blur-md">
  //       <div className="container mx-auto px-4 py-4">
  //         <div className="flex items-center justify-between">
  //           <div className="flex items-center space-x-3">
  //             <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
  //               <Wallet className="w-6 h-6 text-white" />
  //             </div>
  //             <div>
  //               <h1 className="text-xl font-bold text-white">{wallet.name}</h1>
  //               <p className="text-sm text-violet-200">Multi-Chain Wallet</p>
  //             </div>
  //           </div>
  //           <div className="flex items-center space-x-2">
  //             <Button
  //               onClick={() => setShowBalances(!showBalances)}
  //               variant="ghost"
  //               size="sm"
  //               className="text-violet-200 hover:text-white"
  //             >
  //               {showBalances ? (
  //                 <EyeOff className="w-4 h-4" />
  //               ) : (
  //                 <Eye className="w-4 h-4" />
  //               )}
  //             </Button>
  //             <Button
  //               onClick={handleExportWallets}
  //               variant="ghost"
  //               size="sm"
  //               className="text-violet-200 hover:text-white"
  //             >
  //               <Download className="w-4 h-4" />
  //             </Button>
  //             <Button
  //               onClick={lockWallet}
  //               variant="ghost"
  //               size="sm"
  //               className="text-violet-200 hover:text-white"
  //             >
  //               <LogOut className="w-4 h-4" />
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="container mx-auto px-4 py-6">
  //       {/* Balance Overview */}
  //       <div className="mb-8">
  //         <Card className="border-violet-800 bg-black/40 backdrop-blur-md">
  //           <CardHeader>
  //             <div className="flex items-center justify-between">
  //               <CardTitle className="text-white">Portfolio Overview</CardTitle>
  //               <div className="flex space-x-2">
  //                 <Button
  //                   size="sm"
  //                   className="bg-violet-600 hover:bg-violet-700"
  //                 >
  //                   <Send className="w-4 h-4 mr-2" />
  //                   Send
  //                 </Button>
  //                 <Button
  //                   size="sm"
  //                   variant="outline"
  //                   className="border-violet-600 text-violet-200"
  //                 >
  //                   <Plus className="w-4 h-4 mr-2" />
  //                   Receive
  //                 </Button>
  //                 <Button
  //                   size="sm"
  //                   variant="outline"
  //                   className="border-violet-600 text-violet-200"
  //                 >
  //                   <ArrowDownUp className="w-4 h-4 mr-2" />
  //                   Swap
  //                 </Button>
  //               </div>
  //             </div>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="text-center py-8">
  //               <div className="text-4xl font-bold text-white mb-2">
  //                 {showBalances ? "$0.00" : "••••••"}
  //               </div>
  //               <p className="text-violet-200">Total Balance (USD)</p>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>

  //       {/* Chain Accounts */}
  //       <Tabs defaultValue="evm" className="space-y-6">
  //         <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-violet-800">
  //           <TabsTrigger
  //             value="evm"
  //             className="text-violet-200 data-[state=active]:text-white"
  //           >
  //             EVM Chains ({evmChains.length})
  //           </TabsTrigger>
  //           <TabsTrigger
  //             value="non-evm"
  //             className="text-violet-200 data-[state=active]:text-white"
  //           >
  //             Other Chains ({nonEvmChains.length})
  //           </TabsTrigger>
  //         </TabsList>

  //         <TabsContent value="evm" className="space-y-4">
  //           {evmChains.length > 0 ? (
  //             <div className="grid gap-4">
  //               {/* EVM chains share the same address */}
  //               <Card className="border-violet-800 bg-black/40 backdrop-blur-md">
  //                 <CardHeader>
  //                   <CardTitle className="text-white flex items-center space-x-2">
  //                     <span>EVM Address</span>
  //                     <Badge
  //                       variant="secondary"
  //                       className="bg-violet-900/50 text-violet-200"
  //                     >
  //                       {evmChains.length} chains
  //                     </Badge>
  //                   </CardTitle>
  //                 </CardHeader>
  //                 <CardContent>
  //                   <div className="flex items-center justify-between p-3 bg-violet-900/30 rounded-lg border border-violet-700">
  //                     <div className="flex-1">
  //                       <p className="font-mono text-sm text-white break-all">
  //                         {evmChains[0]?.address}
  //                       </p>
  //                     </div>
  //                     <Button
  //                       onClick={() =>
  //                         handleCopyAddress(evmChains[0]?.address || "", "evm")
  //                       }
  //                       variant="ghost"
  //                       size="sm"
  //                       className="text-violet-400 hover:text-white ml-2"
  //                     >
  //                       {copied === "evm" ? "✓" : <Copy className="w-4 h-4" />}
  //                     </Button>
  //                   </div>
  //                   <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
  //                     {evmChains.map((account) => {
  //                       const chain = getChainInfo(account.chainId);
  //                       return (
  //                         <div
  //                           key={account.chainId}
  //                           className="flex items-center space-x-2 p-2 bg-violet-900/20 rounded border border-violet-700"
  //                         >
  //                           <img
  //                             src={chain?.logo}
  //                             alt={chain?.name}
  //                             className="w-6 h-6 rounded-full"
  //                             onError={(e) => {
  //                               (e.target as HTMLImageElement).src =
  //                                 "/logos/ethereum.png";
  //                             }}
  //                           />
  //                           <span className="text-sm text-white">
  //                             {chain?.name}
  //                           </span>
  //                         </div>
  //                       );
  //                     })}
  //                   </div>
  //                 </CardContent>
  //               </Card>
  //             </div>
  //           ) : (
  //             <div className="text-center py-8 text-violet-200">
  //               No EVM chains found
  //             </div>
  //           )}
  //         </TabsContent>

  //         <TabsContent value="non-evm" className="space-y-4">
  //           {nonEvmChains.length > 0 ? (
  //             <div className="grid gap-4">
  //               {nonEvmChains.map((account) => {
  //                 const chain = getChainInfo(account.chainId);
  //                 return (
  //                   <Card
  //                     key={account.chainId}
  //                     className="border-violet-800 bg-black/40 backdrop-blur-md"
  //                   >
  //                     <CardHeader>
  //                       <CardTitle className="text-white flex items-center space-x-3">
  //                         <img
  //                           src={chain?.logo}
  //                           alt={chain?.name}
  //                           className="w-8 h-8 rounded-full"
  //                           onError={(e) => {
  //                             (e.target as HTMLImageElement).src =
  //                               "/logos/ethereum.png";
  //                           }}
  //                         />
  //                         <span>{chain?.name}</span>
  //                         <Badge
  //                           variant="secondary"
  //                           className="bg-violet-900/50 text-violet-200"
  //                         >
  //                           {chain?.symbol}
  //                         </Badge>
  //                       </CardTitle>
  //                     </CardHeader>
  //                     <CardContent>
  //                       <div className="flex items-center justify-between p-3 bg-violet-900/30 rounded-lg border border-violet-700">
  //                         <div className="flex-1">
  //                           <p className="font-mono text-sm text-white break-all">
  //                             {account.address}
  //                           </p>
  //                         </div>
  //                         <Button
  //                           onClick={() =>
  //                             handleCopyAddress(
  //                               account.address,
  //                               account.chainId
  //                             )
  //                           }
  //                           variant="ghost"
  //                           size="sm"
  //                           className="text-violet-400 hover:text-white ml-2"
  //                         >
  //                           {copied === account.chainId ? (
  //                             "✓"
  //                           ) : (
  //                             <Copy className="w-4 h-4" />
  //                           )}
  //                         </Button>
  //                       </div>
  //                       <div className="mt-3 flex items-center justify-between text-sm">
  //                         <span className="text-violet-200">Balance</span>
  //                         <span className="text-white">
  //                           {showBalances ? "0.00 " + chain?.symbol : "••••••"}
  //                         </span>
  //                       </div>
  //                     </CardContent>
  //                   </Card>
  //                 );
  //               })}
  //             </div>
  //           ) : (
  //             <div className="text-center py-8 text-violet-200">
  //               No non-EVM chains found
  //             </div>
  //           )}
  //         </TabsContent>
  //       </Tabs>
  //     </div>
  //   </div>
  // );

  return <div></div>;
}
