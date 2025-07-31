import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomBytes } from "crypto";

// Initialize AWS clients
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

// Helper functions
function generateTxHash(): string {
  return "0x" + randomBytes(32).toString("hex");
}

function generateAddress(): string {
  return "0x" + randomBytes(20).toString("hex");
}

async function insertLog(log: any) {
  try {
    const command = new PutCommand({
      TableName: LOGS_TABLE_NAME,
      Item: log,
    });
    await dynamoDbClient.send(command);
    console.log(`[InsertLogs] ✅ Inserted ${log.logType} log for trade ${log.tradeId.slice(0, 10)}...`);
  } catch (error) {
    console.error(`[InsertLogs] ❌ Error inserting ${log.logType} log:`, error);
  }
}

async function getTrades() {
  try {
    const command = new ScanCommand({
      TableName: TRADES_TABLE_NAME,
      Limit: 5, // Get first 5 trades for demo
    });
    
    const response = await dynamoDbClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error("[InsertLogs] Error fetching trades:", error);
    return [];
  }
}

function createAllLogTypesForTrade(trade: any): any[] {
  const logs: any[] = [];
  const baseTime = new Date(trade.timestamp || trade.orderCreatedAt || Date.now()).getTime();
  let logTime = baseTime;

  // Get chain IDs with fallbacks
  const srcChainId = trade.fromChainId || 97; // BNB Testnet
  const dstChainId = trade.toChainId || 11155111; // Ethereum Sepolia
  
  // Common addresses to use throughout
  const resolverA = generateAddress();
  const resolverB = generateAddress();
  const resolverC = generateAddress();
  const resolverD = generateAddress();
  const makerAddr = trade.makerAddress || generateAddress();
  const orderHashValue = trade.orderHash || generateTxHash();
  const secretHashValue = trade.secretHash || generateTxHash();
  const secretValue = trade.secret || generateTxHash();

  // 1. ORDER CREATION (UI)
  logs.push({
    tradeId: trade.tradeId,
    timestamp: new Date(logTime).toISOString(),
    title: "Order Created",
    source: "UI",
    orderId: orderHashValue,
    description: `User created swap order for ${trade.srcAmount || "645.524211"} ${trade.fromToken || "USDT"} → ${trade.toAmount || "591.368479"} ${trade.toToken || "USDT"}`,
    logType: "order_creation",
    data: {
      orderHash: orderHashValue,
      signature: generateTxHash(),
      secretHash: secretHashValue,
      srcToken: trade.fromToken || "USDT",
      dstToken: trade.toToken || "USDT", 
      srcAmount: trade.srcAmount || "645.524211",
      dstAmount: trade.toAmount === "pending" ? "591.368479" : trade.toAmount || "591.368479",
      srcChainId,
      dstChainId,
      makerAddress: makerAddr,
      deadline: new Date(baseTime + 5 * 60 * 1000).toISOString(),
    },
    txHash: orderHashValue,
    chainId: srcChainId,
  });

  logTime += 1000; // 1 second later

  // 2. ORDER BROADCAST (Relayer) 
  logs.push({
    tradeId: trade.tradeId,
    timestamp: new Date(logTime).toISOString(),
    title: "Order Broadcasted",
    source: "Relayer",
    orderId: orderHashValue,
    description: "Relayer broadcasted order to all available resolvers",
    logType: "order_broadcast",
    data: {
      orderHash: orderHashValue,
      broadcastTimestamp: new Date(logTime).toISOString(),
      resolversNotified: [resolverA, resolverB, resolverC, resolverD],
      resolverCount: 4,
    },
  });

  logTime += 2000; // 2 seconds later

  // 3. RESOLVER COMMITMENT (Multiple resolvers)
  const resolvers = [
    { source: "ResolverA", address: resolverA, fillPercent: 45, fillAmount: "266.115816" },
    { source: "ResolverB", address: resolverB, fillPercent: 30, fillAmount: "177.410544" },
    { source: "ResolverC", address: resolverC, fillPercent: 25, fillAmount: "147.842119" },
  ];

  resolvers.forEach((resolver, index) => {
    logs.push({
      tradeId: trade.tradeId,
      timestamp: new Date(logTime + index * 500).toISOString(),
      title: `${resolver.fillPercent}% Fill Commitment`,
      source: resolver.source,
      orderId: orderHashValue,
      description: `Resolver committed to fill ${resolver.fillAmount} ${trade.toToken || "USDT"}`,
      logType: "resolver_commitment",
      data: {
        resolverAddress: resolver.address,
        commitmentHash: generateTxHash(),
        fillAmount: resolver.fillAmount,
        fillPercentage: resolver.fillPercent,
        safetyDepositAmount: (parseFloat(resolver.fillAmount) * 0.1).toFixed(6),
        commitmentTxHash: generateTxHash(),
        chainId: dstChainId,
      },
      txHash: generateTxHash(),
      chainId: dstChainId,
    });
  });

  logTime += resolvers.length * 500 + 3000; // After all commitments + 3 seconds

  // 4. ESCROW DEPLOYMENT (Lead Resolver)
  const srcEscrowAddr = generateAddress();
  const dstEscrowAddr = generateAddress();
  const deploySrcTx = trade.deploySrcEscrowTxHash || generateTxHash();
  const deployDstTx = trade.deployDstEscrowTxHash || generateTxHash();

  logs.push({
    tradeId: trade.tradeId,
    timestamp: new Date(logTime).toISOString(),
    title: "Escrows Deployed",
    source: "ResolverA",
    orderId: orderHashValue,
    description: "Lead resolver deployed source and destination escrows",
    logType: "escrow_deployment",
    data: {
      resolverAddress: resolverA,
      srcEscrowAddress: srcEscrowAddr,
      dstEscrowAddress: dstEscrowAddr,
      deploySrcTxHash: deploySrcTx,
      deployDstTxHash: deployDstTx,
      srcChainId,
      dstChainId,
      gasUsed: {
        src: (150000 + Math.floor(Math.random() * 50000)).toString(),
        dst: (140000 + Math.floor(Math.random() * 50000)).toString(),
      },
    },
    txHash: deploySrcTx,
    chainId: srcChainId,
  });

  logTime += 5000; // 5 seconds later

  // 5. ASSET LOCK (Relayer)
  const lockTx = trade.lockSrcTxHash || generateTxHash();
  logs.push({
    tradeId: trade.tradeId,
    timestamp: new Date(logTime).toISOString(),
    title: "Assets Locked",
    source: "Relayer",
    orderId: orderHashValue,
    description: `Locked ${trade.srcAmount || "645.524211"} ${trade.fromToken || "USDT"} in source escrow`,
    logType: "asset_lock",
    data: {
      lockTxHash: lockTx,
      amount: trade.srcAmount || "645.524211",
      token: trade.fromToken || "USDT",
      escrowAddress: srcEscrowAddr,
      userAddress: makerAddr,
      chainId: srcChainId,
      gasPrice: (20000000000 + Math.floor(Math.random() * 10000000000)).toString(),
    },
    txHash: lockTx,
    chainId: srcChainId,
  });

  logTime += 2000; // 2 seconds later

  // 6. DESTINATION FILL (Multiple resolvers filling)
  let cumulativeFilled = 0;
  const totalDstAmount = parseFloat(trade.toAmount === "pending" ? "591.368479" : trade.toAmount || "591.368479");
  
  resolvers.forEach((resolver, index) => {
    const fillAmount = parseFloat(resolver.fillAmount);
    cumulativeFilled += fillAmount;
    const remaining = totalDstAmount - cumulativeFilled;

    logs.push({
      tradeId: trade.tradeId,
      timestamp: new Date(logTime + index * 1000).toISOString(),
      title: "Destination Assets Filled",
      source: resolver.source,
      orderId: orderHashValue,
      description: `Filled ${resolver.fillAmount} ${trade.toToken || "USDT"} in destination escrow`,
      logType: "destination_fill",
      data: {
        resolverAddress: resolver.address,
        fillTxHash: generateTxHash(),
        fillAmount: resolver.fillAmount,
        token: trade.toToken || "USDT",
        escrowAddress: dstEscrowAddr,
        chainId: dstChainId,
        cumulativeFilled: cumulativeFilled.toFixed(6),
        remainingToFill: Math.max(0, remaining).toFixed(6),
      },
      txHash: generateTxHash(),
      chainId: dstChainId,
    });
  });

  logTime += resolvers.length * 1000 + 1000; // After all fills + 1 second

  // 7. FILL COMPLETE (Relayer)
  logs.push({
    tradeId: trade.tradeId,
    timestamp: new Date(logTime).toISOString(),
    title: "Order Fully Filled",
    source: "Relayer",
    orderId: orderHashValue,
    description: "All resolvers have filled their commitments",
    logType: "fill_complete",
    data: {
      totalFilled: totalDstAmount.toFixed(6),
      targetAmount: totalDstAmount.toFixed(6),
      fillComplete: true,
      participatingResolvers: [resolverA, resolverB, resolverC],
      completionTimestamp: new Date(logTime).toISOString(),
    },
  });

  logTime += 2000; // 2 seconds later

  // 8. SECRET REVEAL (Relayer)
  logs.push({
    tradeId: trade.tradeId,
    timestamp: new Date(logTime).toISOString(), 
    title: "Secret Revealed",
    source: "Relayer",
    orderId: orderHashValue,
    description: "Secret revealed to all participating resolvers",
    logType: "secret_reveal",
    data: {
      secret: secretValue,
      secretHash: secretHashValue,
      broadcastTimestamp: new Date(logTime).toISOString(),
      sqsMessageId: `msg-${Math.random().toString(36).substr(2, 9)}`,
      hashVerified: true,
    },
  });

  logTime += 3000; // 3 seconds later

  // 9. USER RELEASE (Multiple resolvers releasing to user)
  resolvers.forEach((resolver, index) => {
    logs.push({
      tradeId: trade.tradeId,
      timestamp: new Date(logTime + index * 500).toISOString(),
      title: "Funds Released to User",
      source: resolver.source,
      orderId: orderHashValue,
      description: `Released ${resolver.fillAmount} ${trade.toToken || "USDT"} to user`,
      logType: "user_release",
      data: {
        resolverAddress: resolver.address,
        unlockTxHash: generateTxHash(),
        amount: resolver.fillAmount,
        token: trade.toToken || "USDT",
        recipient: makerAddr,
        chainId: dstChainId,
        secret: secretValue,
      },
      txHash: generateTxHash(),
      chainId: dstChainId,
    });
  });

  logTime += resolvers.length * 500 + 1000; // After all releases + 1 second

  // 10. SAFETY RECOVERY (Each resolver recovers safety deposit)
  resolvers.forEach((resolver, index) => {
    const safetyAmount = (parseFloat(resolver.fillAmount) * 0.1).toFixed(6);
    logs.push({
      tradeId: trade.tradeId,
      timestamp: new Date(logTime + index * 800).toISOString(),
      title: "Safety Deposit Recovered",
      source: resolver.source,
      orderId: orderHashValue,
      description: "Recovered safety deposit from destination escrow",
      logType: "safety_recovery",
      data: {
        resolverAddress: resolver.address,
        claimTxHash: generateTxHash(),
        safetyAmount,
        token: trade.toToken || "USDT",
        chainId: dstChainId,
        escrowAddress: dstEscrowAddr,
      },
      txHash: generateTxHash(),
      chainId: dstChainId,
    });
  });

  logTime += resolvers.length * 800 + 400; // After all recoveries + 400ms

  // 11. SOURCE COLLECT (Each resolver collects rewards from source)
  resolvers.forEach((resolver, index) => {
    const srcRewardAmount = (parseFloat(trade.srcAmount || "645.524211") * (resolver.fillPercent / 100)).toFixed(6);
    const safetyAmount = (parseFloat(resolver.fillAmount) * 0.1).toFixed(6);
    const totalAmount = (parseFloat(srcRewardAmount) + parseFloat(safetyAmount)).toFixed(6);

    logs.push({
      tradeId: trade.tradeId,
      timestamp: new Date(logTime + index * 800).toISOString(),
      title: "Source Assets Collected",
      source: resolver.source,
      orderId: orderHashValue,
      description: "Collected rewards and safety deposit from source escrow",
      logType: "source_collect",
      data: {
        resolverAddress: resolver.address,
        collectTxHash: generateTxHash(),
        rewardAmount: srcRewardAmount,
        safetyAmount,
        totalAmount,
        token: trade.fromToken || "USDT",
        chainId: srcChainId,
        escrowAddress: srcEscrowAddr,
      },
      txHash: generateTxHash(),
      chainId: srcChainId,
    });
  });

  return logs;
}

async function insertCompleteLogsForAllTrades() {
  console.log("[InsertLogs] 🚀 Starting complete logs insertion for all 11 log types...");
  
  const trades = await getTrades();
  console.log(`[InsertLogs] 📊 Found ${trades.length} trades to process`);
  
  if (trades.length === 0) {
    console.log("[InsertLogs] ⚠️  No trades found. Please run the trade data generator first.");
    return;
  }

  let totalLogs = 0;
  
  for (const trade of trades) {
    console.log(`[InsertLogs] 🔄 Processing trade: ${trade.tradeId.slice(0, 10)}... (${trade.status})`);
    
    const logs = createAllLogTypesForTrade(trade);
    console.log(`[InsertLogs] 📝 Generated ${logs.length} logs for this trade`);
    
    // Insert logs sequentially to maintain timing order
    for (const log of logs) {
      await insertLog(log);
      // Small delay to avoid overwhelming DynamoDB
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    totalLogs += logs.length;
    console.log(`[InsertLogs] ✅ Completed trade ${trade.tradeId.slice(0, 10)}... (${logs.length} logs)`);
  }
  
  console.log(`[InsertLogs] 🎉 Complete! Inserted ${totalLogs} logs across all 11 log types for ${trades.length} trades`);
  console.log(`[InsertLogs] 📈 Average ${Math.round(totalLogs / trades.length)} logs per trade`);
  
  // Summary of log types
  console.log("\n[InsertLogs] 📋 Log Types Inserted:");
  console.log("  1. ✅ Order Creation (UI)");
  console.log("  2. ✅ Order Broadcast (Relayer)");
  console.log("  3. ✅ Resolver Commitment (3x Resolvers)");
  console.log("  4. ✅ Escrow Deployment (Lead Resolver)");
  console.log("  5. ✅ Asset Lock (Relayer)");
  console.log("  6. ✅ Destination Fill (3x Resolvers)");
  console.log("  7. ✅ Fill Complete (Relayer)");
  console.log("  8. ✅ Secret Reveal (Relayer)");
  console.log("  9. ✅ User Release (3x Resolvers)");
  console.log(" 10. ✅ Safety Recovery (3x Resolvers)");
  console.log(" 11. ✅ Source Collect (3x Resolvers)");
}

// Run the script
insertCompleteLogsForAllTrades().catch(console.error);