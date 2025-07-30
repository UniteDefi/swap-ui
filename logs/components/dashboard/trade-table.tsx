"use client";

import { Trade } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TradeTableProps {
  trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  return (
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
                  <th className="text-left p-2 text-sm font-medium">Amount</th>
                  <th className="text-left p-2 text-sm font-medium">Status</th>
                  <th className="text-left p-2 text-sm font-medium">Resolver</th>
                  <th className="text-left p-2 text-sm font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.tradeId} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-mono text-xs">{trade.tradeId.slice(0, 8)}...</td>
                    <td className="p-2 text-sm">
                      {trade.fromToken} ({trade.fromChain})
                    </td>
                    <td className="p-2 text-sm">
                      {trade.toToken} ({trade.toChain})
                    </td>
                    <td className="p-2 text-sm">{trade.fromAmount}</td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trade.status === "completed" ? "bg-green-500/20 text-green-500" :
                        trade.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                        "bg-gray-500/20 text-gray-500"
                      }`}>
                        {trade.status || "unknown"}
                      </span>
                    </td>
                    <td className="p-2 font-mono text-xs">
                      {trade.resolverAddress ? `${trade.resolverAddress.slice(0, 6)}...` : "-"}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground">
                      {trade.timestamp ? new Date(trade.timestamp).toLocaleTimeString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}