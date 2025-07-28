import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

export type SwapStatus = 
  | "idle"
  | "generating_secret"
  | "approving_token"
  | "creating_order"
  | "waiting_for_relayer"
  | "relayer_deposited"
  | "user_claiming"
  | "completed"
  | "failed"
  | "timeout";

export interface SwapStatusData {
  orderId?: string;
  escrowAddress?: string;
  relayerAddress?: string;
  expiryTime?: number;
  error?: string;
  txHash?: string;
}

interface UseSwapStatusReturn {
  status: SwapStatus;
  statusData: SwapStatusData;
  updateStatus: (status: SwapStatus, data?: Partial<SwapStatusData>) => void;
  resetStatus: () => void;
  checkOrderStatus: (orderId: string) => Promise<void>;
}

export function useSwapStatus(): UseSwapStatusReturn {
  const [status, setStatus] = useState<SwapStatus>("idle");
  const [statusData, setStatusData] = useState<SwapStatusData>({});
  const { toast } = useToast();

  const updateStatus = useCallback((newStatus: SwapStatus, data?: Partial<SwapStatusData>) => {
    console.log("[SwapStatus] Status update:", newStatus, data);
    setStatus(newStatus);
    if (data) {
      setStatusData(prev => ({ ...prev, ...data }));
    }

    // Show toast notifications for certain status changes
    switch (newStatus) {
      case "creating_order":
        toast({
          title: "Creating Swap Order",
          description: "Submitting your swap request...",
        });
        break;
      case "waiting_for_relayer":
        toast({
          title: "Order Created",
          description: "Waiting for relayer to deposit funds...",
        });
        break;
      case "relayer_deposited":
        toast({
          title: "Relayer Deposited",
          description: "Funds deposited! You can now claim your tokens.",
        });
        break;
      case "completed":
        toast({
          title: "Swap Completed!",
          description: "Your cross-chain swap has been completed successfully.",
        });
        break;
      case "failed":
        toast({
          title: "Swap Failed",
          description: data?.error || "The swap could not be completed.",
          variant: "destructive",
        });
        break;
      case "timeout":
        toast({
          title: "Swap Timeout",
          description: "The swap has expired. Please try again.",
          variant: "destructive",
        });
        break;
    }
  }, [toast]);

  const resetStatus = useCallback(() => {
    setStatus("idle");
    setStatusData({});
  }, []);

  const checkOrderStatus = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/order-status/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order status");
      }

      const data = await response.json();
      console.log("[SwapStatus] Order status:", data);

      // Update status based on response
      if (data.status === "completed") {
        updateStatus("completed", { orderId });
      } else if (data.status === "failed") {
        updateStatus("failed", { orderId, error: data.error });
      } else if (data.relayerDeposited) {
        updateStatus("relayer_deposited", { orderId });
      } else if (Date.now() > data.expiryTime) {
        updateStatus("timeout", { orderId });
      }
    } catch (error) {
      console.error("[SwapStatus] Error checking order status:", error);
    }
  }, [updateStatus]);

  // Auto-check order status periodically when waiting
  useEffect(() => {
    if (status === "waiting_for_relayer" && statusData.orderId) {
      const interval = setInterval(() => {
        checkOrderStatus(statusData.orderId!);
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [status, statusData.orderId, checkOrderStatus]);

  return {
    status,
    statusData,
    updateStatus,
    resetStatus,
    checkOrderStatus,
  };
}