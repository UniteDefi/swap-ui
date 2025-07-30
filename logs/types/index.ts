export interface Trade {
  tradeId: string;
  userId?: string;
  fromToken?: string;
  toToken?: string;
  fromAmount?: string;
  toAmount?: string;
  fromChain?: string;
  toChain?: string;
  status?: string;
  timestamp?: string;
  resolverAddress?: string;
}

export interface Log {
  tradeId: string;
  timestamp?: string;
  level?: string;
  message?: string;
  data?: any;
  source?: string;
}

export interface ResolverCommitment {
  commitmentId: string;
  tradeId: string;
  resolverAddress?: string;
  commitment?: string;
  status?: string;
  timestamp?: string;
  proofHash?: string;
}

export interface QueueMessage {
  MessageId?: string;
  Body?: string;
  Attributes?: {
    SentTimestamp?: string;
    ApproximateReceiveCount?: string;
    ApproximateFirstReceiveTimestamp?: string;
  };
}