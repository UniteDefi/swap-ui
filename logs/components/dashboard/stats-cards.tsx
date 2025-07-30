"use client";

interface StatsCardsProps {
  totalTrades: number;
  activeTrades: number;
  totalResolvers: number;
  queueMessages: number;
}

export function StatsCards({ totalTrades, activeTrades, totalResolvers, queueMessages }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-2xl font-bold">{totalTrades}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-500 text-lg">📊</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Trades</p>
            <p className="text-2xl font-bold">{activeTrades}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-green-500 text-lg">⚡</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Resolvers</p>
            <p className="text-2xl font-bold">{totalResolvers}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-purple-500 text-lg">🤖</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Queue Messages</p>
            <p className="text-2xl font-bold">{queueMessages}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="text-orange-500 text-lg">📨</span>
          </div>
        </div>
      </div>
    </div>
  );
}