import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomBytes } from "crypto";

// Initialize AWS clients directly for script usage
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const dynamoDbClient = DynamoDBDocumentClient.from(dynamoDBClient);

const TRADES_TABLE_NAME = process.env.TRADES_TABLE_NAME || "Trades";
const LOGS_TABLE_NAME = process.env.LOGS_TABLE_NAME || "Logs";

// Generate random transaction hash
function generateTxHash(): string {
  return "0x" + randomBytes(32).toString("hex");
}

// Generate random address
function generateAddress(): string {
  return "0x" + randomBytes(20).toString("hex");
}

async function getTrades() {
  try {
    const command = new ScanCommand({
      TableName: TRADES_TABLE_NAME,
      Limit: 10, // Get first 10 trades for demo
    });
    
    const response = await dynamoDbClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error("[AddLogs] Error fetching trades:", error);
    return [];
  }
}

async function insertLog(log: any) {
  try {
    const command = new PutCommand({
      TableName: LOGS_TABLE_NAME,
      Item: log,
    });
    await dynamoDbClient.send(command);
    console.log(`[AddLogs] Inserted log: ${log.logType} for trade ${log.tradeId}`);
  } catch (error) {
    console.error(`[AddLogs] Error inserting log:`, error);
  }
}

function createEnhancedLogsForTrade(trade: any): any[] {
  const logs: any[] = [];
  const baseTime = new Date(trade.timestamp || trade.orderCreatedAt || Date.now()).getTime();
  let logTime = baseTime;

  // Helper to get chain IDs
  const srcChainId = trade.fromChainId || 1;
  const dstChainId = trade.toChainId || 137;

  // 1. Order Creation (UI)
  logs.push({
    tradeId: trade.tradeId,
    timestamp: new Date(logTime).toISOString(),
    title: "Order Created",
    source: "UI",
    orderId: trade.orderHash || generateTxHash(),
    description: `User created swap order for ${trade.srcAmount || "100"} ${trade.fromToken || "USDT"} → ${trade.toAmount || "95"} ${trade.toToken || "DAI"}`,
    logType: "order_creation",
    data: {
      orderHash: trade.orderHash || generateTxHash(),
      signature: generateTxHash(),
      secretHash: trade.secretHash || generateTxHash(),
      srcToken: trade.fromToken || "USDT",
      dstToken: trade.toToken || "DAI",
      srcAmount: trade.srcAmount || "100.000000",
      dstAmount: trade.toAmount || "95.500000",
      srcChainId,
      dstChainId,
      makerAddress: trade.makerAddress || generateAddress(),
      deadline: new Date(baseTime + 5 * 60 * 1000).toISOString(),
    },
  });

  logTime += 1000; // 1 second later

  // 2. Order Broadcast (Relayer)
  logs.push({
    tradeId: trade.tradeId,
    timestamp: new Date(logTime).toISOString(),
    title: "Order Broadcasted",
    source: "Relayer",
    orderId: trade.orderHash || generateTxHash(),
    description: "Relayer broadcasted order to all available resolvers",
    logType: "order_broadcast",
    data: {
      orderHash: trade.orderHash || generateTxHash(),
      broadcastTimestamp: new Date(logTime).toISOString(),
      resolversNotified: [generateAddress(), generateAddress(), generateAddress()],
      resolverCount: 3,
    },
  });

  // Only add more logs if trade is not "in_auction"
  if (trade.status !== "in_auction") {
    logTime += 2000; // 2 seconds later

    // 3. Resolver Commitment
    logs.push({
      tradeId: trade.tradeId,
      timestamp: new Date(logTime).toISOString(),
      title: "75% Fill Commitment",
      source: "ResolverA",
      orderId: trade.orderHash || generateTxHash(),
      description: "Resolver committed to fill 71.625000 DAI",
      logType: "resolver_commitment",
      data: {
        resolverAddress: trade.resolverAddress || generateAddress(),
        commitmentHash: generateTxHash(),
        fillAmount: "71.625000",
        fillPercentage: 75,
        safetyDepositAmount: "7.162500",
        commitmentTxHash: generateTxHash(),
        chainId: dstChainId,
      },
    });

    logTime += 3000; // 3 seconds later

    // 4. Escrow Deployment
    logs.push({
      tradeId: trade.tradeId,
      timestamp: new Date(logTime).toISOString(),
      title: "Escrows Deployed",
      source: "ResolverA",
      orderId: trade.orderHash || generateTxHash(),
      description: "Lead resolver deployed source and destination escrows",
      logType: "escrow_deployment",
      data: {
        resolverAddress: trade.resolverAddress || generateAddress(),
        srcEscrowAddress: generateAddress(),
        dstEscrowAddress: generateAddress(),
        deploySrcTxHash: trade.deploySrcEscrowTxHash || generateTxHash(),
        deployDstTxHash: trade.deployDstEscrowTxHash || generateTxHash(),
        srcChainId,
        dstChainId,
        gasUsed: {
          src: "165432",
          dst: "158734",
        },
      },
    });

    // Add more logs for completed trades
    if (trade.status === "completed") {
      logTime += 5000; // 5 seconds later

      // 5. Asset Lock
      logs.push({
        tradeId: trade.tradeId,
        timestamp: new Date(logTime).toISOString(),
        title: "Assets Locked",
        source: "Relayer",
        orderId: trade.orderHash || generateTxHash(),
        description: `Locked ${trade.srcAmount || "100"} ${trade.fromToken || "USDT"} in source escrow`,
        logType: "asset_lock",
        data: {
          lockTxHash: trade.lockSrcTxHash || generateTxHash(),
          amount: trade.srcAmount || "100.000000",
          token: trade.fromToken || "USDT",
          escrowAddress: generateAddress(),
          userAddress: trade.makerAddress || generateAddress(),
          chainId: srcChainId,
          gasPrice: "25000000000",
        },
      });

      logTime += 2000; // 2 seconds later

      // 6. Destination Fill
      logs.push({
        tradeId: trade.tradeId,
        timestamp: new Date(logTime).toISOString(),
        title: "Destination Assets Filled",
        source: "ResolverA",
        orderId: trade.orderHash || generateTxHash(),
        description: `Filled ${trade.toAmount || "95.5"} ${trade.toToken || "DAI"} in destination escrow`,
        logType: "destination_fill",
        data: {
          resolverAddress: trade.resolverAddress || generateAddress(),
          fillTxHash: generateTxHash(),
          fillAmount: trade.toAmount || "95.500000",
          token: trade.toToken || "DAI",
          escrowAddress: generateAddress(),
          chainId: dstChainId,
          cumulativeFilled: trade.toAmount || "95.500000",
          remainingToFill: "0.000000",
        },
      });

      logTime += 1000; // 1 second later

      // 7. Fill Complete
      logs.push({
        tradeId: trade.tradeId,
        timestamp: new Date(logTime).toISOString(),
        title: "Order Fully Filled",
        source: "Relayer",
        orderId: trade.orderHash || generateTxHash(),
        description: "All resolvers have filled their commitments",
        logType: "fill_complete",
        data: {
          totalFilled: trade.toAmount || "95.500000",
          targetAmount: trade.toAmount || "95.500000",
          fillComplete: true,
          participatingResolvers: [trade.resolverAddress || generateAddress()],
          completionTimestamp: new Date(logTime).toISOString(),
        },
      });

      logTime += 2000; // 2 seconds later

      // 8. Secret Reveal
      logs.push({
        tradeId: trade.tradeId,
        timestamp: new Date(logTime).toISOString(),
        title: "Secret Revealed",
        source: "Relayer",
        orderId: trade.orderHash || generateTxHash(),
        description: "Secret revealed to all participating resolvers",
        logType: "secret_reveal",
        data: {
          secret: trade.secret || generateTxHash(),
          secretHash: trade.secretHash || generateTxHash(),
          broadcastTimestamp: new Date(logTime).toISOString(),
          sqsMessageId: `msg-${Math.random().toString(36).substr(2, 9)}`,
          hashVerified: true,
        },
      });

      logTime += 3000; // 3 seconds later

      // 9. User Release
      logs.push({
        tradeId: trade.tradeId,
        timestamp: new Date(logTime).toISOString(),
        title: "Funds Released to User",
        source: "ResolverA",
        orderId: trade.orderHash || generateTxHash(),
        description: `Released ${trade.toAmount || "95.5"} ${trade.toToken || "DAI"} to user`,
        logType: "user_release",
        data: {
          resolverAddress: trade.resolverAddress || generateAddress(),
          unlockTxHash: trade.unlockUserTxHash || generateTxHash(),
          amount: trade.toAmount || "95.500000",
          token: trade.toToken || "DAI",
          recipient: trade.makerAddress || generateAddress(),
          chainId: dstChainId,
          secret: trade.secret || generateTxHash(),
        },
      });

      logTime += 1000; // 1 second later

      // 10. Safety Recovery
      logs.push({
        tradeId: trade.tradeId,
        timestamp: new Date(logTime).toISOString(),
        title: "Safety Deposit Recovered",
        source: "ResolverA",
        orderId: trade.orderHash || generateTxHash(),
        description: "Recovered safety deposit from destination escrow",
        logType: "safety_recovery",
        data: {
          resolverAddress: trade.resolverAddress || generateAddress(),
          claimTxHash: generateTxHash(),
          safetyAmount: "7.162500",
          token: trade.toToken || "DAI",
          chainId: dstChainId,
          escrowAddress: generateAddress(),
        },
      });

      logTime += 400; // 400ms later

      // 11. Source Collection
      logs.push({
        tradeId: trade.tradeId,
        timestamp: new Date(logTime).toISOString(),
        title: "Source Assets Collected",
        source: "ResolverA",
        orderId: trade.orderHash || generateTxHash(),
        description: "Collected rewards and safety deposit from source escrow",
        logType: "source_collect",
        data: {
          resolverAddress: trade.resolverAddress || generateAddress(),
          collectTxHash: trade.unlockResolverTxHash || generateTxHash(),
          rewardAmount: trade.srcAmount || "100.000000",
          safetyAmount: "10.000000",
          totalAmount: ((parseFloat(trade.srcAmount || "100") + 10)).toFixed(6),
          token: trade.fromToken || "USDT",
          chainId: srcChainId,
          escrowAddress: generateAddress(),
        },
      });
    }
  }

  return logs;
}

async function addDummyLogs() {
  console.log("[AddLogs] Starting to add dummy enhanced logs...");
  
  const trades = await getTrades();
  console.log(`[AddLogs] Found ${trades.length} trades`);
  
  if (trades.length === 0) {
    console.log("[AddLogs] No trades found. Please run the data generator first.");
    return;
  }

  for (const trade of trades.slice(0, 5)) { // Add logs for first 5 trades
    console.log(`[AddLogs] Creating logs for trade: ${trade.tradeId} (${trade.status})`);
    
    const logs = createEnhancedLogsForTrade(trade);
    
    for (const log of logs) {
      await insertLog(log);
    }
    
    console.log(`[AddLogs] Added ${logs.length} logs for trade ${trade.tradeId}`);
  }
  
  console.log("[AddLogs] Dummy logs creation completed!");
}

// Run the script
addDummyLogs();