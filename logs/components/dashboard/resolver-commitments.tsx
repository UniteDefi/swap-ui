"use client";

import { ResolverCommitment } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResolverCommitmentsProps {
  commitments: ResolverCommitment[];
}

export function ResolverCommitments({ commitments }: ResolverCommitmentsProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Resolver Commitments</h2>
        <p className="text-sm text-muted-foreground">Commitments from resolvers picking up orders</p>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Commitment ID</th>
                  <th className="text-left p-2 text-sm font-medium">Trade ID</th>
                  <th className="text-left p-2 text-sm font-medium">Resolver</th>
                  <th className="text-left p-2 text-sm font-medium">Status</th>
                  <th className="text-left p-2 text-sm font-medium">Proof Hash</th>
                  <th className="text-left p-2 text-sm font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {commitments.map((commitment) => (
                  <tr key={commitment.commitmentId} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-mono text-xs">{commitment.commitmentId.slice(0, 8)}...</td>
                    <td className="p-2 font-mono text-xs">{commitment.tradeId.slice(0, 8)}...</td>
                    <td className="p-2 font-mono text-xs">
                      {commitment.resolverAddress ? `${commitment.resolverAddress.slice(0, 6)}...${commitment.resolverAddress.slice(-4)}` : "-"}
                    </td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        commitment.status === "fulfilled" ? "bg-green-500/20 text-green-500" :
                        commitment.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                        commitment.status === "failed" ? "bg-red-500/20 text-red-500" :
                        "bg-gray-500/20 text-gray-500"
                      }`}>
                        {commitment.status || "unknown"}
                      </span>
                    </td>
                    <td className="p-2 font-mono text-xs">
                      {commitment.proofHash ? `${commitment.proofHash.slice(0, 8)}...` : "-"}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground">
                      {commitment.timestamp ? new Date(commitment.timestamp).toLocaleTimeString() : "-"}
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