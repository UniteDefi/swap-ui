export type OrderStatus = 
  | "in_auction" 
  | "committed" 
  | "completed" 
  | "rescue_available" 
  | "failed";

export interface Order {
  tradeId: string;
  fromToken?: string;
  toToken?: string;
  srcAmount?: string;
  toAmount?: string;
  fromChain?: string;
  toChain?: string;
  status?: OrderStatus;
  maker?: string;
  resolver?: string;
  secretHash?: string;
  secretReveal?: string;
  timeLeft?: number;
  
  // Transaction hashes
  initiateTxHash?: string;
  commitTxHash?: string;
  revealTxHash?: string;
  completeTxHash?: string;
  rescueTxHash?: string;
  cancelTxHash?: string;
  auctionBidTxHash?: string;
  
  // Addresses
  resolverAddress?: string;
  makerAddress?: string;
  
  // Timestamps
  initiateTimestamp?: number;
  commitTimestamp?: number;
  revealTimestamp?: number;
  completeTimestamp?: number;
  rescueTimestamp?: number;
  cancelTimestamp?: number;
  auctionBidTimestamp?: number;
  
  // Additional metadata
  createdAt?: string;
  updatedAt?: string;
}

export type LogSource = "UI" | "Relayer" | "ResolverA" | "ResolverB" | "ResolverC" | "ResolverD";

export type LogType = 
  | "swap_initiated"
  | "commit_received"
  | "secret_revealed"
  | "swap_completed"
  | "swap_rescued"
  | "swap_cancelled"
  | "auction_bid_placed"
  | "auction_resolved"
  | "relayer_connected"
  | "relayer_disconnected"
  | "error_occurred";

export interface OrderLog {
  id: string;
  orderId: string;
  type: LogType;
  source: LogSource;
  message: string;
  data?: Record<string, any>;
  timestamp: number;
  txHash?: string;
  blockNumber?: number;
}

export interface OrderWithLogs extends Order {
  logs?: OrderLog[];
}