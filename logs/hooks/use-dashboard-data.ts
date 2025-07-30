"use client";

import { useState, useEffect, useCallback } from "react";
import { Trade, Log, ResolverCommitment, QueueMessage } from "@/types";

interface DashboardData {
  trades: Trade[];
  logs: Log[];
  commitments: ResolverCommitment[];
  queueMessages: QueueMessage[];
  queueStats: {
    messageCount: number;
    messagesInFlight: number;
  };
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(refreshInterval: number = 5000) {
  const [data, setData] = useState<DashboardData>({
    trades: [],
    logs: [],
    commitments: [],
    queueMessages: [],
    queueStats: {
      messageCount: 0,
      messagesInFlight: 0,
    },
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      const [tradesRes, logsRes, commitmentsRes, queueRes] = await Promise.all([
        fetch("/api/trades"),
        fetch("/api/logs"),
        fetch("/api/resolver-commitments"),
        fetch("/api/queue"),
      ]);

      const [tradesData, logsData, commitmentsData, queueData] = await Promise.all([
        tradesRes.json(),
        logsRes.json(),
        commitmentsRes.json(),
        queueRes.json(),
      ]);

      setData({
        trades: tradesData.data || [],
        logs: logsData.data || [],
        commitments: commitmentsData.data || [],
        queueMessages: queueData.recentMessages || [],
        queueStats: {
          messageCount: queueData.messageCount || 0,
          messagesInFlight: queueData.messagesInFlight || 0,
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("[useDashboardData] Error fetching data:", error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to fetch dashboard data",
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return data;
}