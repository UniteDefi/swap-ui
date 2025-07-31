"use client";

import { useState } from "react";
import { Trade } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TokenLogo } from "@/components/ui/token-logo";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { ChevronRight } from "lucide-react";
import { TradeDetailsDialog } from "./trade-details-dialog";

interface TradeTableProps {
  trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Trades</h2>
        <p className="text-sm text-muted-foreground">Recent trades broadcasted by the relayer</p>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Trade ID</th>
                  <th className="text-left p-2 text-sm font-medium">From</th>
                  <th className="text-left p-2 text-sm font-medium">To</th>
                  <th className="text-left p-2 text-sm font-medium">Src Amount</th>
                  <th className="text-left p-2 text-sm font-medium">To Amount</th>
                  <th className="text-left p-2 text-sm font-medium">Status</th>
                  <th className="text-left p-2 text-sm font-medium">Resolver</th>
                  <th className="text-left p-2 text-sm font-medium">Maker</th>
                  <th className="text-left p-2 text-sm font-medium">Time Left</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr 
                    key={trade.tradeId} 
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleTradeClick(trade)}
                  >
                    <td className="p-2 font-mono text-xs">{trade.tradeId.slice(0, 8)}...</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <TokenLogo 
                          token={trade.fromToken || "ETH"} 
                          chain={trade.fromChain || "Ethereum"}
                          chainId={trade.fromChainId}
                          size="sm"
                        />
                        <span className="text-sm">{trade.fromToken}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <TokenLogo 
                          token={trade.toToken || "ETH"} 
                          chain={trade.toChain || "Ethereum"}
                          chainId={trade.toChainId}
                          size="sm"
                        />
                        <span className="text-sm">{trade.toToken}</span>
                      </div>
                    </td>
                    <td className="p-2 text-sm">{trade.srcAmount || "-"}</td>
                    <td className="p-2 text-sm">
                      {trade.status === "in_auction" ? 
                        <span className="text-muted-foreground">Pending</span> : 
                        (trade.toAmount || "-")
                      }
                    </td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trade.status === "completed" ? "bg-green-500/20 text-green-500" :
                        trade.status === "committed" ? "bg-blue-500/20 text-blue-500" :
                        trade.status === "in_auction" ? "bg-yellow-500/20 text-yellow-500" :
                        trade.status === "rescue_available" ? "bg-orange-500/20 text-orange-500" :
                        trade.status === "failed" ? "bg-red-500/20 text-red-500" :
                        "bg-gray-500/20 text-gray-500"
                      }`}>
                        {trade.status === "in_auction" ? "In Auction" :
                         trade.status === "committed" ? "Committed" :
                         trade.status === "completed" ? "Completed" :
                         trade.status === "rescue_available" ? "Rescue Available" :
                         trade.status === "failed" ? "Failed" :
                         "Unknown"}
                      </span>
                    </td>
                    <td className="p-2 font-mono text-xs">
                      {trade.resolverAddress ? `${trade.resolverAddress.slice(0, 6)}...` : "-"}
                    </td>
                    <td className="p-2 font-mono text-xs">
                      {trade.makerAddress ? `${trade.makerAddress.slice(0, 6)}...${trade.makerAddress.slice(-4)}` : "-"}
                    </td>
                    <td className="p-2 text-xs">
                      {trade.orderCreatedAt ? (
                        <CountdownTimer createdAt={trade.orderCreatedAt} />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>
    </div>
    
    <TradeDetailsDialog 
      trade={selectedTrade}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    />
    </>
  );
}