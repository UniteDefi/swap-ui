"use client";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TradeTable } from "@/components/dashboard/trade-table";
import { LogsViewer } from "@/components/dashboard/logs-viewer";

export default function HomePage() {
  const {
    trades,
    logs,
    isLoading,
    error,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Active trades are those with "committed" status
  const activeTrades = trades.filter((t) => t.status === "committed").length;
  // Fixed at 4 resolvers as specified
  const activeResolvers = 4;
  // Queued trades are those in auction
  const queuedTrades = trades.filter((t) => t.status === "in_auction").length;

  return (
    <div className="container mx-auto p-6 space-y-6 mt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Unite DeFi Infrastructure Logs
        </h1>
        <p className="text-muted-foreground">
          Real-time monitoring of trades, resolvers, and system activity
        </p>
      </div>

      <StatsCards
        totalTrades={trades.length}
        activeTrades={activeTrades}
        totalResolvers={activeResolvers}
        queuedTrades={queuedTrades}
      />

      <TradeTable trades={trades} />
      
      <LogsViewer logs={logs} />
    </div>
  );
}
