"use client";

import { useState, useEffect, useCallback } from "react";
import { Trade, Log } from "@/types";

interface DashboardData {
  trades: Trade[];
  logs: Log[];
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(refreshInterval: number = 5000) {
  const [data, setData] = useState<DashboardData>({
    trades: [],
    logs: [],
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      const [tradesRes, logsRes] = await Promise.all([
        fetch("/api/trades"),
        fetch("/api/logs"),
      ]);

      const [tradesData, logsData] = await Promise.all([
        tradesRes.json(),
        logsRes.json(),
      ]);

      setData({
        trades: tradesData.data || [],
        logs: logsData.data || [],
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