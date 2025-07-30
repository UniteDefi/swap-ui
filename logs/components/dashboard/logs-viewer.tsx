"use client";

import { Log } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogsViewerProps {
  logs: Log[];
}

export function LogsViewer({ logs }: LogsViewerProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">System Logs</h2>
        <p className="text-sm text-muted-foreground">Real-time logs from the relayer system</p>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-2">
          {logs.map((log, index) => (
            <div key={`${log.tradeId}-${index}`} className="font-mono text-xs p-2 rounded bg-muted/50 hover:bg-muted">
              <div className="flex items-start gap-2">
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  log.level === "error" ? "bg-red-500/20 text-red-500" :
                  log.level === "warn" ? "bg-yellow-500/20 text-yellow-500" :
                  log.level === "info" ? "bg-blue-500/20 text-blue-500" :
                  "bg-gray-500/20 text-gray-500"
                }`}>
                  {log.level || "info"}
                </span>
                <span className="text-muted-foreground">
                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ""}
                </span>
                <span className="text-muted-foreground">[{log.source || "system"}]</span>
                <span className="flex-1 break-all">{log.message}</span>
              </div>
              {log.data && (
                <pre className="mt-2 text-xs bg-background/50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}