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

export type LogSource = "UI" | "Relayer" | "ResolverA" | "ResolverB" | "ResolverC" | "ResolverD";

export type LogType = 
  | "order_creation"
  | "order_broadcast" 
  | "resolver_commitment"
  | "escrow_deployment"
  | "asset_lock"
  | "destination_fill"
  | "fill_complete"
  | "secret_reveal"
  | "user_release"
  | "safety_recovery"
  | "source_collect";

// Log data interfaces for each type
export interface OrderCreationData {
  orderHash: string;
  signature: string;
  secretHash: string;
  srcToken: string;
  dstToken: string;
  srcAmount: string;
  dstAmount: string;
  srcChainId: number;
  dstChainId: number;
  makerAddress: string;
  deadline: string;
}

export interface OrderBroadcastData {
  orderHash: string;
  broadcastTimestamp: string;
  resolversNotified: string[];
  resolverCount: number;
}

export interface ResolverCommitmentData {
  resolverAddress: string;
  commitmentHash: string;
  fillAmount: string;
  fillPercentage: number;
  safetyDepositAmount: string;
  commitmentTxHash: string;
  chainId: number;
}

export interface EscrowDeploymentData {
  resolverAddress: string;
  srcEscrowAddress: string;
  dstEscrowAddress: string;
  deploySrcTxHash: string;
  deployDstTxHash: string;
  srcChainId: number;
  dstChainId: number;
  gasUsed: {
    src: string;
    dst: string;
  };
}

export interface AssetLockData {
  lockTxHash: string;
  amount: string;
  token: string;
  escrowAddress: string;
  userAddress: string;
  chainId: number;
  gasPrice: string;
}

export interface DestinationFillData {
  resolverAddress: string;
  fillTxHash: string;
  fillAmount: string;
  token: string;
  escrowAddress: string;
  chainId: number;
  cumulativeFilled: string;
  remainingToFill: string;
}

export interface FillCompleteData {
  totalFilled: string;
  targetAmount: string;
  fillComplete: boolean;
  participatingResolvers: string[];
  completionTimestamp: string;
}

export interface SecretRevealData {
  secret: string;
  secretHash: string;
  broadcastTimestamp: string;
  sqsMessageId: string;
  hashVerified: boolean;
}

export interface UserReleaseData {
  resolverAddress: string;
  unlockTxHash: string;
  amount: string;
  token: string;
  recipient: string;
  chainId: number;
  secret: string;
}

export interface SafetyRecoveryData {
  resolverAddress: string;
  claimTxHash: string;
  safetyAmount: string;
  token: string;
  chainId: number;
  escrowAddress: string;
}

export interface SourceCollectData {
  resolverAddress: string;
  collectTxHash: string;
  rewardAmount: string;
  safetyAmount: string;
  totalAmount: string;
  token: string;
  chainId: number;
  escrowAddress: string;
}

export type LogData = 
  | OrderCreationData
  | OrderBroadcastData
  | ResolverCommitmentData
  | EscrowDeploymentData
  | AssetLockData
  | DestinationFillData
  | FillCompleteData
  | SecretRevealData
  | UserReleaseData
  | SafetyRecoveryData
  | SourceCollectData;

export interface Log {
  tradeId: string;
  timestamp: string;
  title: string;
  source: LogSource;
  orderId: string;
  description: string;
  logType: LogType;
  data: LogData;
  txHash?: string;
  chainId?: number;
}