"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X, AlertTriangle, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order, OrderStatus } from "@/lib/types/order";


interface OrdersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders?: Order[];
  onOrderClick?: (order: Order) => void;
}


export function OrdersSheet({ open, onOpenChange, orders = [], onOrderClick }: OrdersSheetProps) {
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />;
      case "committed":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "in_auction":
        return <Clock className="h-4 w-4" />;
      case "rescue_available":
        return <AlertTriangle className="h-4 w-4" />;
      case "failed":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "committed":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "in_auction":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "rescue_available":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "--";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateHash = (hash?: string) => {
    if (!hash) return "--";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[480px] bg-[#1b1b23] border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-white">Your Orders</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {orders.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              No orders found
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Trade ID</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">From</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">To</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Resolver</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Maker</th>
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.tradeId}
                      className="border-b border-gray-800/50 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onOrderClick?.(order)}
                    >
                      <td className="py-3 px-2">
                        <span className="text-purple-400 font-mono text-xs">
                          {truncateHash(order.tradeId)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {order.srcAmount || "--"} {order.fromToken || "--"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {order.fromChain || "--"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {order.toAmount || "--"} {order.toToken || "--"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {order.toChain || "--"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(order.status || "in_auction")} border-0`}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status || "in_auction")}
                            {order.status?.replace("_", " ") || "In Auction"}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-gray-300 font-mono text-xs">
                          {truncateHash(order.resolver)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-gray-300 font-mono text-xs">
                          {truncateHash(order.maker)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-gray-400 text-xs">
                          {formatTimestamp(order.initiateTimestamp)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}