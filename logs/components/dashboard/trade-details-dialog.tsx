"use client";

import { useEffect, useState } from "react";
import { Trade } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TokenLogo } from "@/components/ui/token-logo";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Hash,
  Key,
  Shield,
  User,
  Check,
  AlertTriangle,
} from "lucide-react";
import { ExplorerLink } from "@/components/ui/explorer-link";
import { getTimeProgress } from "@/components/ui/countdown-timer";
import { getRelativeTime } from "@/lib/time-utils";
import { chainConfigs } from "@/lib/chains";
import Image from "next/image";

interface TradeDetailsDialogProps {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeDetailsDialog({
  trade,
  open,
  onOpenChange,
}: TradeDetailsDialogProps) {
  if (!trade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">Trade Details</DialogTitle>
        {/* Top right corner status and timer */}
        <div className="absolute top-4 right-12 flex items-center gap-2">
          {trade.orderCreatedAt && (
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              <CountdownTimer
                createdAt={trade.orderCreatedAt}
                className="text-sm"
              />
            </div>
          )}
          <Badge
            variant="outline"
            className={`
              ${
                trade.status === "completed"
                  ? "border-green-500 text-green-500"
                  : trade.status === "committed"
                  ? "border-blue-500 text-blue-500"
                  : trade.status === "in_auction"
                  ? "border-yellow-500 text-yellow-500"
                  : trade.status === "rescue_available"
                  ? "border-orange-500 text-orange-500"
                  : trade.status === "failed"
                  ? "border-red-500 text-red-500"
                  : "border-gray-500 text-gray-500"
              }
            `}
          >
            {trade.status === "in_auction"
              ? "In Auction"
              : trade.status === "committed"
              ? "Committed"
              : trade.status === "completed"
              ? "Completed"
              : trade.status === "rescue_available"
              ? "Rescue Available"
              : trade.status === "failed"
              ? "Failed"
              : "Unknown"}
          </Badge>
        </div>

        {/* Trade Details Section */}
        <div className="space-y-6 pt-8">
          {/* Asset Flow Animation */}
          <div className="relative pb-6">
            <div className="flex items-center justify-between">
              {/* Source Asset */}
              <div className="flex flex-col items-center space-y-2">
                <TokenLogo
                  token={trade.fromToken || "ETH"}
                  chain={trade.fromChain || "Ethereum"}
                  chainId={trade.fromChainId}
                  size="lg"
                />
                <div className="text-center">
                  <p className="font-semibold">
                    {trade.srcAmount || "-"} {trade.fromToken}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {trade.fromChain}
                  </p>
                </div>
              </div>

              {/* Status Animation */}
              <div className="flex-1 mx-8">
                <StatusAnimation
                  status={trade.status}
                  createdAt={trade.orderCreatedAt}
                />
              </div>

              {/* Destination Asset */}
              <div className="flex flex-col items-center space-y-2">
                <TokenLogo
                  token={trade.toToken || "ETH"}
                  chain={trade.toChain || "Ethereum"}
                  chainId={trade.toChainId}
                  size="lg"
                />
                <div className="text-center">
                  <p className="font-semibold">
                    {trade.status === "in_auction" ? (
                      <span className="text-muted-foreground">Pending</span>
                    ) : (
                      `${trade.toAmount || "-"} ${trade.toToken}`
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{trade.toChain}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t" />

          {/* Trade Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Trade Details</h3>
            <div className="space-y-3">
              {/* Trade ID and Order Hash */}
              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  icon={Hash}
                  label="Trade ID"
                  value={trade.tradeId}
                  type="tx"
                  chainId={trade.fromChainId}
                  showPlaceholder
                />
                <DetailRow
                  icon={Hash}
                  label="Order Hash"
                  value={trade.orderHash}
                  type="tx"
                  chainId={trade.fromChainId}
                  showPlaceholder
                />
              </div>

              {/* Maker and Resolver */}
              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  icon={User}
                  label="Maker"
                  value={trade.makerAddress}
                  type="address"
                  chainId={trade.fromChainId}
                  showPlaceholder
                />
                <DetailRow
                  icon={Shield}
                  label="Resolver"
                  value={trade.resolverAddress}
                  type="address"
                  chainId={trade.fromChainId}
                  showPlaceholder
                />
              </div>

              {/* Secret Hash and Secret */}
              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  icon={Hash}
                  label="Secret Hash"
                  value={trade.secretHash}
                  type="tx"
                  chainId={trade.fromChainId}
                  showPlaceholder
                />
                <DetailRow
                  icon={Key}
                  label="Secret (Revealed)"
                  value={trade.secret}
                  type="tx"
                  chainId={trade.fromChainId}
                  showPlaceholder
                />
              </div>

              {/* Order Made - Centered */}
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Order Made:</span>
                  <span className="text-sm font-medium">
                    {getRelativeTime(trade.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t" />

          {/* Transactions Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Transactions</h3>
            <div className="space-y-2">
              <TransactionRow
                label="Approval"
                txHash={trade.approvalTxHash}
                chainId={trade.fromChainId}
              />
              <TransactionRow
                label="Deploy Source Escrow"
                txHash={trade.deploySrcEscrowTxHash}
                chainId={trade.fromChainId}
              />
              <TransactionRow
                label="Deploy Destination Escrow"
                txHash={trade.deployDstEscrowTxHash}
                chainId={trade.toChainId}
              />
              <TransactionRow
                label="Lock Source Assets"
                txHash={trade.lockSrcTxHash}
                chainId={trade.fromChainId}
              />
              <TransactionRow
                label="Lock Destination Assets"
                txHash={trade.lockDstTxHash}
                chainId={trade.toChainId}
              />
              <TransactionRow
                label="Unlock to User"
                txHash={trade.unlockUserTxHash}
                chainId={trade.toChainId}
              />
              <TransactionRow
                label="Unlock to Resolver"
                txHash={trade.unlockResolverTxHash}
                chainId={trade.fromChainId}
              />
            </div>
          </div>

          <div className="border-t" />

          {/* Logs Section - Placeholder */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Logs</h3>
            <p className="text-sm text-muted-foreground">Logs will be displayed here</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  type?: "address" | "tx";
  chainId?: number;
  plainText?: boolean;
  showPlaceholder?: boolean;
}

function DetailRow({
  icon: Icon,
  label,
  value,
  type,
  chainId,
  plainText,
  showPlaceholder,
}: DetailRowProps) {
  return (
    <div className="flex items-start space-x-2">
      <Icon className="h-3 w-3 text-muted-foreground mt-1" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {!value && showPlaceholder ? (
          <p className="text-sm text-muted-foreground">...</p>
        ) : value ? (
          plainText ? (
            <p className="text-sm">{value}</p>
          ) : (
            <ExplorerLink
              value={value}
              type={type || "tx"}
              chainId={chainId}
              className="text-sm"
            />
          )
        ) : null}
      </div>
    </div>
  );
}

// Transaction Row Component
function TransactionRow({ label, txHash, chainId }: { label: string; txHash?: string; chainId?: number }) {
  const chainLogo = chainId && chainConfigs[chainId] ? 
    chainConfigs[chainId].name.toLowerCase().replace(/ /g, "").replace("testnet", "").replace("sepolia", "") : 
    "ethereum";

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Image
          src={`/logos/${chainLogo}.png`}
          alt={chainConfigs[chainId || 1]?.name || "Chain"}
          width={20}
          height={20}
          className="rounded-full"
        />
        <span className="text-sm">{label}</span>
      </div>
      {txHash ? (
        <ExplorerLink
          value={txHash}
          type="tx"
          chainId={chainId}
          className="text-sm"
        />
      ) : (
        <span className="text-sm text-muted-foreground">...</span>
      )}
    </div>
  );
}

// Status Animation Component
function StatusAnimation({
  status,
  createdAt,
}: {
  status?: string;
  createdAt?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === "committed" && createdAt) {
      const updateProgress = () => {
        const newProgress = getTimeProgress(createdAt);
        setProgress(newProgress);
      };

      updateProgress();
      const interval = setInterval(updateProgress, 1000);
      return () => clearInterval(interval);
    }
  }, [status, createdAt]);

  if (status === "in_auction") {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <Image
          src="/gravel.png"
          alt="Gravel"
          width={32}
          height={32}
          className="opacity-80"
        />
        <div className="flex items-center justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"
              style={{
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "committed") {
    return (
      <div className="relative w-full">
        <div className="h-2 bg-blue-500/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        <div className="text-center mt-1">
          <span className="text-xs text-blue-500">{Math.round(progress)}%</span>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
          <div className="relative h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "rescue_available") {
    return (
      <div className="flex items-center justify-center">
        <div className="relative animate-pulse">
          <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center justify-center">
        <div className="h-0.5 w-full bg-red-500/20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
              <div className="relative h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white font-bold">✕</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
