import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Mock logs data for testing
const mockLogs = [
  {
    tradeId: "0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b",
    timestamp: "2024-01-01T12:00:00Z",
    title: "Order Created",
    source: "UI",
    orderId: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
    description: "User created swap order for 645.524211 USDT → 591.368479 USDT",
    logType: "order_creation",
    data: {
      orderHash: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
      signature: "0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890",
      secretHash: "0xb43b69a6426fb8d7c9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",  
      srcToken: "USDT",
      dstToken: "USDT",
      srcAmount: "645.524211",
      dstAmount: "591.368479",
      srcChainId: 97,
      dstChainId: 11155111,
      makerAddress: "0x24b6cac3d9876543210abcdef9876543210abcdef",
      deadline: "2024-01-01T12:05:00Z"
    }
  },
  {
    tradeId: "0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b",
    timestamp: "2024-01-01T12:00:01Z", 
    title: "Order Broadcasted",
    source: "Relayer",
    orderId: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
    description: "Relayer broadcasted order to all available resolvers",
    logType: "order_broadcast",
    data: {
      orderHash: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
      broadcastTimestamp: "2024-01-01T12:00:01Z",
      resolversNotified: [
        "0x1234567890abcdef1234567890abcdef12345678",
        "0xabcdef1234567890abcdef1234567890abcdef12", 
        "0x9876543210fedcba9876543210fedcba98765432"
      ],
      resolverCount: 3
    }
  },
  {
    tradeId: "0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b", 
    timestamp: "2024-01-01T12:00:03Z",
    title: "65% Fill Commitment", 
    source: "ResolverA",
    orderId: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
    description: "Resolver committed to fill 384.389511 USDT",
    logType: "resolver_commitment",
    data: {
      resolverAddress: "0x9876543210fedcba9876543210fedcba98765432",
      commitmentHash: "0xc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
      fillAmount: "384.389511", 
      fillPercentage: 65,
      safetyDepositAmount: "38.438951",
      commitmentTxHash: "0xe3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
      chainId: 11155111
    }
  },
  {
    tradeId: "0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b",
    timestamp: "2024-01-01T12:00:06Z",
    title: "Escrows Deployed",
    source: "ResolverA", 
    orderId: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
    description: "Lead resolver deployed source and destination escrows",
    logType: "escrow_deployment",
    data: {
      resolverAddress: "0x9876543210fedcba9876543210fedcba98765432",
      srcEscrowAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      dstEscrowAddress: "0x5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e",
      deploySrcTxHash: "0x0929a1b2c3d4e5f678901234567890123456789012345678901234567890a3cb",
      deployDstTxHash: "0x77a5b2c3d4e5f678901234567890123456789012345678901234567890132a2",
      srcChainId: 97,
      dstChainId: 11155111,
      gasUsed: {
        src: "165432",
        dst: "158734"
      }
    }
  },
  {
    tradeId: "0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b",
    timestamp: "2024-01-01T12:00:11Z",
    title: "Assets Locked", 
    source: "Relayer",
    orderId: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
    description: "Locked 645.524211 USDT in source escrow",
    logType: "asset_lock",
    data: {
      lockTxHash: "0xa389c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f86960",
      amount: "645.524211",
      token: "USDT", 
      escrowAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      userAddress: "0x24b6cac3d9876543210abcdef9876543210abcdef",
      chainId: 97,
      gasPrice: "25000000000"
    }
  },
  {
    tradeId: "0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b",
    timestamp: "2024-01-01T12:00:13Z",
    title: "Destination Assets Filled",
    source: "ResolverA",
    orderId: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a", 
    description: "Filled 591.368479 USDT in destination escrow",
    logType: "destination_fill",
    data: {
      resolverAddress: "0x9876543210fedcba9876543210fedcba98765432",
      fillTxHash: "0xf7cda1b2c3d4e5f6789012345678901234567890123456789012345678902759",
      fillAmount: "591.368479",
      token: "USDT",
      escrowAddress: "0x5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e", 
      chainId: 11155111,
      cumulativeFilled: "591.368479",
      remainingToFill: "0.000000"
    }
  },
  {
    tradeId: "0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b",
    timestamp: "2024-01-01T12:00:14Z",
    title: "Order Fully Filled",
    source: "Relayer",
    orderId: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
    description: "All resolvers have filled their commitments", 
    logType: "fill_complete",
    data: {
      totalFilled: "591.368479",
      targetAmount: "591.368479", 
      fillComplete: true,
      participatingResolvers: ["0x9876543210fedcba9876543210fedcba98765432"],
      completionTimestamp: "2024-01-01T12:00:14Z"
    }
  },
  {
    tradeId: "0x3da38d10ad77bff18f3174be5e08b79cd9a358daaca42ebbdafeb6a43b3d0a1b",
    timestamp: "2024-01-01T12:00:16Z",
    title: "Secret Revealed",
    source: "Relayer", 
    orderId: "0xd6c64c1f5a2b3e8d9c7f6e5a4b3c2d1e0f9e8d7c6b5a4f3e2d1c0b9a8e7d6c5451a",
    description: "Secret revealed to all participating resolvers",
    logType: "secret_reveal",
    data: {
      secret: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
      secretHash: "0xb43b69a6426fb8d7c9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
      broadcastTimestamp: "2024-01-01T12:00:16Z", 
      sqsMessageId: "msg-abc123def",
      hashVerified: true
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tradeId = searchParams.get("tradeId");
    
    let logs = mockLogs;
    
    if (tradeId) {
      logs = mockLogs.filter(log => log.tradeId === tradeId);
    }
    
    // Sort by timestamp
    logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error("[API/logs-mock] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mock logs" },
      { status: 500 }
    );
  }
}