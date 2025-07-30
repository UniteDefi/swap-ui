"use client";

import { QueueMessage } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QueueMonitorProps {
  messages: QueueMessage[];
  messageCount: number;
  messagesInFlight: number;
}

export function QueueMonitor({ messages, messageCount, messagesInFlight }: QueueMonitorProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">BridgeIntent Queue</h2>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Messages:</span>
            <span className="text-sm font-medium">{messageCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">In Flight:</span>
            <span className="text-sm font-medium">{messagesInFlight}</span>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-2">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No messages in queue</p>
          ) : (
            messages.map((message) => (
              <div key={message.MessageId} className="p-3 rounded bg-muted/50 hover:bg-muted">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {message.MessageId?.slice(0, 12)}...
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.Attributes?.SentTimestamp ? 
                      new Date(parseInt(message.Attributes.SentTimestamp)).toLocaleTimeString() : 
                      "-"
                    }
                  </span>
                </div>
                {message.Body && (
                  <pre className="text-xs bg-background/50 p-2 rounded overflow-x-auto">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(message.Body), null, 2);
                      } catch {
                        return message.Body;
                      }
                    })()}
                  </pre>
                )}
                {message.Attributes?.ApproximateReceiveCount && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Receive count: {message.Attributes.ApproximateReceiveCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}