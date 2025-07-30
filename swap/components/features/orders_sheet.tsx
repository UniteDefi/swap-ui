"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Clock, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Order {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  fromChain: string;
  toChain: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  txHash?: string;
}

interface OrdersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockOrders: Order[] = [
  {
    id: "1",
    fromToken: "ETH",
    toToken: "USDT",
    fromAmount: "1.5",
    toAmount: "2,850.00",
    fromChain: "Ethereum Sepolia",
    toChain: "Polygon Amoy",
    status: "completed",
    timestamp: "2024-01-30 14:32",
    txHash: "0x1234...5678",
  },
  {
    id: "2",
    fromToken: "USDT",
    toToken: "DAI",
    fromAmount: "500.00",
    toAmount: "499.75",
    fromChain: "Base Sepolia",
    toChain: "Arbitrum Sepolia",
    status: "pending",
    timestamp: "2024-01-30 14:28",
  },
  {
    id: "3",
    fromToken: "BNB",
    toToken: "USDT",
    fromAmount: "2.0",
    toAmount: "600.00",
    fromChain: "BNB Testnet",
    toChain: "Ethereum Sepolia",
    status: "failed",
    timestamp: "2024-01-30 14:15",
  },
  {
    id: "4",
    fromToken: "MATIC",
    toToken: "DAI",
    fromAmount: "1,000",
    toAmount: "850.00",
    fromChain: "Polygon Amoy",
    toChain: "Base Sepolia",
    status: "completed",
    timestamp: "2024-01-30 13:45",
    txHash: "0xabcd...efgh",
  },
  {
    id: "5",
    fromToken: "ETH",
    toToken: "USDT",
    fromAmount: "0.5",
    toAmount: "950.00",
    fromChain: "Arbitrum Sepolia",
    toChain: "BNB Testnet",
    status: "completed",
    timestamp: "2024-01-30 12:30",
    txHash: "0x9876...5432",
  },
];

export function OrdersSheet({ open, onOpenChange }: OrdersSheetProps) {
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "failed":
        return <X className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[480px] bg-[#1b1b23] border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-white">Your Orders</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-3 pr-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(order.status)} border-0`}
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </Badge>
                  <span className="text-xs text-gray-400">{order.timestamp}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-white">
                        {order.fromAmount} {order.fromToken}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{order.fromChain}</span>
                  </div>

                  <ArrowRight className="h-5 w-5 text-gray-600 mx-3" />

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-lg font-semibold text-white">
                        {order.toAmount} {order.toToken}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{order.toChain}</span>
                  </div>
                </div>

                {order.txHash && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <a
                      href={`#`}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View Transaction: {order.txHash}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}