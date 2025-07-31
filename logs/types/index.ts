export type TradeStatus = "in_auction" | "committed" | "completed" | "rescue_available" | "failed";

export interface Trade {
  tradeId: string;
  userId?: string;
  fromToken?: string;
  toToken?: string;
  srcAmount?: string; // Static amount provided by maker
  toAmount?: string; // Pending until committed
  fromChain?: string;
  toChain?: string;
  status?: TradeStatus;
  timestamp?: string;
  resolverAddress?: string;
  makerAddress?: string;
  orderCreatedAt?: string; // For countdown calculation
  fromChainId?: number; // Chain ID for logo mapping
  toChainId?: number; // Chain ID for logo mapping
  
  // Transaction hashes
  approvalTxHash?: string; // Approval transaction hash
  orderHash?: string; // Order hash
  secretHash?: string; // Secret hash for HTLC
  secret?: string; // Revealed secret (if available)
  deploySrcEscrowTxHash?: string; // Deploy source escrow transaction
  deployDstEscrowTxHash?: string; // Deploy destination escrow transaction
  lockSrcTxHash?: string; // Lock source assets transaction
  lockDstTxHash?: string; // Lock destination assets transaction
  unlockUserTxHash?: string; // Unlock funds to user on destination
  unlockResolverTxHash?: string; // Unlock funds to resolver on source
}

export interface Log {
  tradeId: string;
  timestamp?: string;
  level?: string;
  message?: string;
  data?: any;
  source?: string;
}