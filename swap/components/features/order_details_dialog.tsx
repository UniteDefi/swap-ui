"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Check, Clock, X, AlertTriangle, Loader2, ExternalLink, Copy } from "lucide-react";
import { Order, OrderStatus, OrderLog } from "@/lib/types/order";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const [logs, setLogs] = useState<OrderLog[]>([]);
  const [isLoadingLogs] = useState(false);

  useEffect(() => {
    if (order?.tradeId && open) {
      // TODO: Fetch logs for this order
      // For now, we'll use empty array
      setLogs([]);
    }
  }, [order?.tradeId, open]);

  if (!order) return null;

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5" />;
      case "committed":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case "in_auction":
        return <Clock className="h-5 w-5" />;
      case "rescue_available":
        return <AlertTriangle className="h-5 w-5" />;
      case "failed":
        return <X className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "committed":
        return "bg-blue-500/10 text-blue-500";
      case "in_auction":
        return "bg-yellow-500/10 text-yellow-500";
      case "rescue_available":
        return "bg-orange-500/10 text-orange-500";
      case "failed":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "--";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getExplorerUrl = () => {
    // TODO: Add proper explorer URLs based on chain
    return "#";
  };

  const HashDisplay = ({ hash, label, chain }: { hash?: string; label: string; chain?: string }) => {
    if (!hash) return null;
    
    return (
      <div className="flex items-center justify-between py-2 px-3 bg-gray-900/50 rounded-lg">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="text-xs text-gray-400 font-mono">{hash}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(hash)}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(getExplorerUrl(), "_blank")}
            className="h-8 w-8 p-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-[#1b1b23] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            Order Details
            <Badge className={`${getStatusColor(order.status || "in_auction")} border-0`}>
              <span className="flex items-center gap-1">
                {getStatusIcon(order.status || "in_auction")}
                {order.status?.replace("_", " ") || "In Auction"}
              </span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-100px)]">
          <div className="space-y-6">
            {/* Asset Flow Visualization */}
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Asset Flow</h3>
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">
                      {order.srcAmount || "--"} {order.fromToken || "--"}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {order.fromChain || "--"}
                    </div>
                  </div>
                </div>
                
                <div className="mx-6">
                  <ArrowRight className="h-8 w-8 text-purple-400" />
                </div>
                
                <div className="flex-1 text-center">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">
                      {order.toAmount || "--"} {order.toToken || "--"}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {order.toChain || "--"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Details */}
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Trade Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Trade ID</label>
                  <div className="text-white font-mono text-sm mt-1">{order.tradeId}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Maker</label>
                  <div className="text-white font-mono text-sm mt-1">{order.maker || "--"}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Resolver</label>
                  <div className="text-white font-mono text-sm mt-1">{order.resolver || "--"}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Secret Hash</label>
                  <div className="text-white font-mono text-sm mt-1">{order.secretHash || "--"}</div>
                </div>
                {order.secretReveal && (
                  <div>
                    <label className="text-sm text-gray-400">Secret Reveal</label>
                    <div className="text-white font-mono text-sm mt-1">{order.secretReveal}</div>
                  </div>
                )}
                {order.timeLeft && order.timeLeft > 0 && (
                  <div>
                    <label className="text-sm text-gray-400">Time Left</label>
                    <div className="text-white font-mono text-sm mt-1">{Math.floor(order.timeLeft / 60)} minutes</div>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Tracking */}
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Transaction Tracking</h3>
              <div className="space-y-3">
                <HashDisplay 
                  hash={order.initiateTxHash} 
                  label="Initiate Transaction" 
                  chain={order.fromChain}
                />
                <HashDisplay 
                  hash={order.commitTxHash} 
                  label="Commit Transaction" 
                  chain={order.toChain}
                />
                <HashDisplay 
                  hash={order.revealTxHash} 
                  label="Reveal Transaction" 
                  chain={order.fromChain}
                />
                <HashDisplay 
                  hash={order.completeTxHash} 
                  label="Complete Transaction" 
                  chain={order.toChain}
                />
                {order.rescueTxHash && (
                  <HashDisplay 
                    hash={order.rescueTxHash} 
                    label="Rescue Transaction" 
                    chain={order.fromChain}
                  />
                )}
                {order.cancelTxHash && (
                  <HashDisplay 
                    hash={order.cancelTxHash} 
                    label="Cancel Transaction" 
                    chain={order.fromChain}
                  />
                )}
                {order.auctionBidTxHash && (
                  <HashDisplay 
                    hash={order.auctionBidTxHash} 
                    label="Auction Bid Transaction" 
                    chain={order.toChain}
                  />
                )}
              </div>
            </div>

            {/* Logs Timeline */}
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
              {isLoadingLogs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                  <span className="ml-2 text-gray-400">Loading timeline...</span>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No activity logs available
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{log.message}</span>
                          <span className="text-xs text-gray-400">{formatTimestamp(log.timestamp)}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Source: {log.source} • Type: {log.type.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}