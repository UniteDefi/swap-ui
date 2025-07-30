"use client";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TradeTable } from "@/components/dashboard/trade-table";
import { ResolverCommitments } from "@/components/dashboard/resolver-commitments";
import { LogsViewer } from "@/components/dashboard/logs-viewer";
import { QueueMonitor } from "@/components/dashboard/queue-monitor";

export default function HomePage() {
  const {
    trades,
    logs,
    commitments,
    queueMessages,
    queueStats,
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

  const activeTrades = trades.filter((t) => t.status === "pending").length;
  const uniqueResolvers = new Set(
    commitments.map((c) => c.resolverAddress).filter(Boolean)
  ).size;

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
        totalResolvers={uniqueResolvers}
        queueMessages={queueStats.messageCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradeTable trades={trades} />
        <ResolverCommitments commitments={commitments} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LogsViewer logs={logs} />
        <QueueMonitor
          messages={queueMessages}
          messageCount={queueStats.messageCount}
          messagesInFlight={queueStats.messagesInFlight}
        />
      </div>
    </div>
  );
}
