import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
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

const LOGS_TABLE_NAME = process.env.LOGS_TABLE_NAME || "Logs";
const TRADES_TABLE_NAME = process.env.TRADES_TABLE_NAME || "Trades";

// Chain configurations with IDs
const chains = [
  { id: 80002, name: "Polygon Amoy", symbol: "polygon" },
  { id: 421614, name: "Arbitrum Sepolia", symbol: "arbitrum" },
  { id: 84532, name: "Base Sepolia", symbol: "base" },
  { id: 97, name: "BNB Testnet", symbol: "bnb" },
  { id: 11155111, name: "Ethereum Sepolia", symbol: "ethereum" },
  { id: 41454, name: "Monad Testnet", symbol: "monad" },
  { id: 128123, name: "Etherlink Testnet", symbol: "etherlink" },
  { id: 713715, name: "Sei Testnet", symbol: "sei" },
];

// Token configurations
const tokens = [
  { symbol: "USDT", name: "Tether USD" },
  { symbol: "DAI", name: "Dai Stablecoin" },
  { symbol: "ETH", name: "Ethereum" },
];

// Fixed resolver addresses (4 resolvers as specified)
const resolvers = [
  "0x1234567890abcdef1234567890abcdef12345678",
  "0xabcdef1234567890abcdef1234567890abcdef12",
  "0x9876543210fedcba9876543210fedcba98765432",
  "0xfedcba9876543210fedcba9876543210fedcba98",
];

// Generate random bytes32 hash
function generateTradeId(): string {
  return "0x" + randomBytes(32).toString("hex");
}

// Generate random ethereum address
function generateAddress(): string {
  return "0x" + randomBytes(20).toString("hex");
}

// Generate random transaction hash
function generateTxHash(): string {
  return "0x" + randomBytes(32).toString("hex");
}

// Get random item from array
function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate random amount between min and max
function randomAmount(min: number, max: number): string {
  return (Math.random() * (max - min) + min).toFixed(6);
}

// Calculate status based on timestamp
function calculateStatus(createdAt: number): "in_auction" | "committed" | "completed" | "rescue_available" | "failed" {
  const now = Date.now();
  const elapsed = now - createdAt;
  const fiveMinutes = 5 * 60 * 1000;

  // Random distribution based on requirements
  const rand = Math.random();
  
  if (elapsed < 30000) { // Less than 30 seconds old
    return rand < 0.7 ? "in_auction" : "committed";
  } else if (elapsed < fiveMinutes) { // Less than 5 minutes
    if (rand < 0.3) return "in_auction";
    if (rand < 0.5) return "committed";
    return "completed";
  } else { // More than 5 minutes
    if (rand < 0.5) return "completed";
    if (rand < 0.8) return "rescue_available";
    return "failed";
  }
}

async function insertTrade(trade: any) {
  try {
    const command = new PutCommand({
      TableName: TRADES_TABLE_NAME,
      Item: trade,
    });
    await dynamoDbClient.send(command);
    console.log(`[DataGen] Inserted trade: ${trade.tradeId} with status: ${trade.status}`);
  } catch (error) {
    console.error(`[DataGen] Error inserting trade:`, error);
  }
}

async function insertLog(log: any) {
  try {
    const command = new PutCommand({
      TableName: LOGS_TABLE_NAME,
      Item: log,
    });
    await dynamoDbClient.send(command);
    console.log(`[DataGen] Inserted log for trade: ${log.tradeId}`);
  } catch (error) {
    console.error(`[DataGen] Error inserting log:`, error);
  }
}

async function generateDummyData() {
  console.log("[DataGen] Starting dummy data generation...");

  const trades: any[] = [];
  const logs: any[] = [];

  // Generate 100 trades with various timestamps
  for (let i = 0; i < 100; i++) {
    const tradeId = generateTradeId();
    const fromChain = randomFrom(chains);
    const toChain = randomFrom(chains.filter(c => c.id !== fromChain.id));
    const fromToken = randomFrom(tokens);
    const toToken = randomFrom(tokens);
    const srcAmount = randomAmount(10, 1000);
    
    // Create trades with various ages for status distribution
    let createdAt: number;
    if (i < 20) {
      // Recent trades (within 30 seconds)
      createdAt = Date.now() - Math.floor(Math.random() * 30000);
    } else if (i < 40) {
      // Trades within 5 minutes
      createdAt = Date.now() - Math.floor(Math.random() * 5 * 60 * 1000);
    } else {
      // Older trades (5-30 minutes)
      createdAt = Date.now() - Math.floor(Math.random() * 25 * 60 * 1000 + 5 * 60 * 1000);
    }

    const status = calculateStatus(createdAt);
    const hasResolver = status !== "in_auction";
    
    const makerAddress = generateAddress();
    const trade: any = {
      tradeId,
      userId: generateAddress(),
      fromToken: fromToken.symbol,
      toToken: toToken.symbol,
      srcAmount,
      toAmount: status === "in_auction" ? "pending" : randomAmount(10, 1000),
      fromChain: fromChain.name,
      toChain: toChain.name,
      fromChainId: fromChain.id,
      toChainId: toChain.id,
      status,
      timestamp: new Date(createdAt).toISOString(),
      orderCreatedAt: new Date(createdAt).toISOString(),
      resolverAddress: hasResolver ? randomFrom(resolvers) : undefined,
      makerAddress,
      // Add fields for DynamoDB GSI
      createdAt: Math.floor(createdAt / 1000),
      expiresAt: Math.floor((createdAt + 5 * 60 * 1000) / 1000),
      ...(hasResolver && status === "committed" ? {
        commitmentDeadline: Math.floor((createdAt + 5 * 60 * 1000) / 1000),
        resolver: randomFrom(resolvers),
      } : {}),
    };

    // Add transaction hashes based on status
    // All trades have approval and order hash
    trade.approvalTxHash = generateTxHash();
    trade.orderHash = generateTxHash();
    trade.secretHash = generateTxHash();

    // Add more hashes based on status progression
    if (status !== "in_auction") {
      // Committed or beyond - escrows deployed
      trade.deploySrcEscrowTxHash = generateTxHash();
      trade.deployDstEscrowTxHash = generateTxHash();
      
      if (status !== "committed") {
        // Completed, rescue_available, or failed - assets locked
        trade.lockSrcTxHash = generateTxHash();
        trade.lockDstTxHash = generateTxHash();
        
        if (status === "completed") {
          // Completed - funds unlocked
          trade.unlockUserTxHash = generateTxHash();
          trade.unlockResolverTxHash = generateTxHash();
          trade.secret = generateTxHash(); // Secret revealed
        } else if (status === "failed") {
          // Failed - only user rescued
          trade.unlockUserTxHash = generateTxHash();
          trade.secret = generateTxHash(); // Secret revealed
        }
        // rescue_available - no unlocks yet
      }
    }

    trades.push(trade);

    // Generate realistic logs following trade lifecycle
    const tradeLogs: any[] = [];
    let logTime = createdAt;

    // 1. Order Creation (UI)
    tradeLogs.push({
      tradeId,
      timestamp: new Date(logTime).toISOString(),
      title: "Order Created",
      source: "UI",
      orderId: trade.orderHash,
      description: `User created swap order for ${srcAmount} ${fromToken.symbol} → ${toToken.symbol}`,
      logType: "order_creation",
      data: {
        orderHash: trade.orderHash,
        signature: generateTxHash(),
        secretHash: trade.secretHash,
        srcToken: fromToken.symbol,
        dstToken: toToken.symbol,
        srcAmount,
        dstAmount: trade.toAmount,
        srcChainId: fromChain.id,
        dstChainId: toChain.id,
        makerAddress,
        deadline: new Date(createdAt + 5 * 60 * 1000).toISOString(),
      },
    });

    logTime += 1000; // 1 second later

    // 2. Order Broadcast (Relayer)
    tradeLogs.push({
      tradeId,
      timestamp: new Date(logTime).toISOString(),
      title: "Order Broadcasted",
      source: "Relayer",
      orderId: trade.orderHash,
      description: "Relayer broadcasted order to all available resolvers",
      logType: "order_broadcast",
      data: {
        orderHash: trade.orderHash,
        broadcastTimestamp: new Date(logTime).toISOString(),
        resolversNotified: resolvers,
        resolverCount: resolvers.length,
      },
    });

    if (status !== "in_auction") {
      logTime += 2000; // 2 seconds later

      // 3. Resolver Commitments
      const participatingResolvers = resolvers.slice(0, Math.floor(Math.random() * 3) + 1); // 1-3 resolvers
      const totalFillAmount = parseFloat(trade.toAmount === "pending" ? srcAmount : trade.toAmount);
      let remainingAmount = totalFillAmount;

      participatingResolvers.forEach((resolverAddr, index) => {
        const fillAmount = index === participatingResolvers.length - 1 
          ? remainingAmount 
          : Math.min(remainingAmount, totalFillAmount * (0.2 + Math.random() * 0.6));
        const fillPercentage = (fillAmount / totalFillAmount) * 100;
        remainingAmount -= fillAmount;

        const resolverSource = `Resolver${String.fromCharCode(65 + index)}` as any; // A, B, C, D

        tradeLogs.push({
          tradeId,
          timestamp: new Date(logTime + index * 500).toISOString(),
          title: `${fillPercentage.toFixed(1)}% Fill Commitment`,
          source: resolverSource,
          orderId: trade.orderHash,
          description: `Resolver committed to fill ${fillAmount.toFixed(6)} ${toToken.symbol}`,
          logType: "resolver_commitment",
          data: {
            resolverAddress: resolverAddr,
            commitmentHash: generateTxHash(),
            fillAmount: fillAmount.toFixed(6),
            fillPercentage: Math.round(fillPercentage),
            safetyDepositAmount: (fillAmount * 0.1).toFixed(6),
            commitmentTxHash: generateTxHash(),
            chainId: toChain.id,
          },
        });
      });

      logTime += participatingResolvers.length * 500 + 3000; // After all commitments + 3 seconds

      // 4. Escrow Deployment (Lead Resolver)
      tradeLogs.push({
        tradeId,
        timestamp: new Date(logTime).toISOString(),
        title: "Escrows Deployed",
        source: "ResolverA",
        orderId: trade.orderHash,
        description: "Lead resolver deployed source and destination escrows",
        logType: "escrow_deployment",
        data: {
          resolverAddress: participatingResolvers[0],
          srcEscrowAddress: generateAddress(),
          dstEscrowAddress: generateAddress(),
          deploySrcTxHash: trade.deploySrcEscrowTxHash!,
          deployDstTxHash: trade.deployDstEscrowTxHash!,
          srcChainId: fromChain.id,
          dstChainId: toChain.id,
          gasUsed: {
            src: (150000 + Math.floor(Math.random() * 50000)).toString(),
            dst: (140000 + Math.floor(Math.random() * 50000)).toString(),
          },
        },
      });

      if (status !== "committed") {
        logTime += 5000; // 5 seconds later

        // 5. Asset Lock (Relayer)
        tradeLogs.push({
          tradeId,
          timestamp: new Date(logTime).toISOString(),
          title: "Assets Locked",
          source: "Relayer",
          orderId: trade.orderHash,
          description: `Locked ${srcAmount} ${fromToken.symbol} in source escrow`,
          logType: "asset_lock",
          data: {
            lockTxHash: trade.lockSrcTxHash!,
            amount: srcAmount,
            token: fromToken.symbol,
            escrowAddress: generateAddress(),
            userAddress: makerAddress,
            chainId: fromChain.id,
            gasPrice: (20000000000 + Math.floor(Math.random() * 10000000000)).toString(),
          },
        });

        logTime += 2000; // 2 seconds later

        // 6. Destination Fills (Resolvers)
        let cumulativeFilled = 0;
        participatingResolvers.forEach((resolverAddr, index) => {
          const fillAmount = totalFillAmount / participatingResolvers.length;
          cumulativeFilled += fillAmount;
          const resolverSource = `Resolver${String.fromCharCode(65 + index)}` as any;

          tradeLogs.push({
            tradeId,
            timestamp: new Date(logTime + index * 1000).toISOString(),
            title: "Destination Assets Filled",
            source: resolverSource,
            orderId: trade.orderHash,
            description: `Filled ${fillAmount.toFixed(6)} ${toToken.symbol} in destination escrow`,
            logType: "destination_fill",
            data: {
              resolverAddress: resolverAddr,
              fillTxHash: generateTxHash(),
              fillAmount: fillAmount.toFixed(6),
              token: toToken.symbol,
              escrowAddress: generateAddress(),
              chainId: toChain.id,
              cumulativeFilled: cumulativeFilled.toFixed(6),
              remainingToFill: (totalFillAmount - cumulativeFilled).toFixed(6),
            },
          });
        });

        logTime += participatingResolvers.length * 1000 + 1000; // After all fills + 1 second

        // 7. Fill Complete (Relayer)
        tradeLogs.push({
          tradeId,
          timestamp: new Date(logTime).toISOString(),
          title: "Order Fully Filled",
          source: "Relayer",
          orderId: trade.orderHash,
          description: "All resolvers have filled their commitments",
          logType: "fill_complete",
          data: {
            totalFilled: totalFillAmount.toFixed(6),
            targetAmount: totalFillAmount.toFixed(6),
            fillComplete: true,
            participatingResolvers,
            completionTimestamp: new Date(logTime).toISOString(),
          },
        });

        logTime += 2000; // 2 seconds later

        // 8. Secret Reveal (Relayer)
        tradeLogs.push({
          tradeId,
          timestamp: new Date(logTime).toISOString(),
          title: "Secret Revealed",
          source: "Relayer",
          orderId: trade.orderHash,
          description: "Secret revealed to all participating resolvers",
          logType: "secret_reveal",
          data: {
            secret: trade.secret || generateTxHash(),
            secretHash: trade.secretHash,
            broadcastTimestamp: new Date(logTime).toISOString(),
            sqsMessageId: `msg-${Math.random().toString(36).substr(2, 9)}`,
            hashVerified: true,
          },
        });

        if (status === "completed") {
          logTime += 3000; // 3 seconds later

          // 9. User Releases (Resolvers)
          participatingResolvers.forEach((resolverAddr, index) => {
            const resolverSource = `Resolver${String.fromCharCode(65 + index)}` as any;
            const releaseAmount = totalFillAmount / participatingResolvers.length;

            tradeLogs.push({
              tradeId,
              timestamp: new Date(logTime + index * 500).toISOString(),
              title: "Funds Released to User",
              source: resolverSource,
              orderId: trade.orderHash,
              description: `Released ${releaseAmount.toFixed(6)} ${toToken.symbol} to user`,
              logType: "user_release",
              data: {
                resolverAddress: resolverAddr,
                unlockTxHash: generateTxHash(),
                amount: releaseAmount.toFixed(6),
                token: toToken.symbol,
                recipient: makerAddress,
                chainId: toChain.id,
                secret: trade.secret || generateTxHash(),
              },
            });
          });

          logTime += participatingResolvers.length * 500 + 1000; // After all releases + 1 second

          // 10. Safety Recovery & 11. Source Collection (Resolvers)
          participatingResolvers.forEach((resolverAddr, index) => {
            const resolverSource = `Resolver${String.fromCharCode(65 + index)}` as any;
            const rewardAmount = (parseFloat(srcAmount) / participatingResolvers.length).toFixed(6);
            const safetyAmount = (parseFloat(rewardAmount) * 0.1).toFixed(6);

            // Safety Recovery
            tradeLogs.push({
              tradeId,
              timestamp: new Date(logTime + index * 800).toISOString(),
              title: "Safety Deposit Recovered",
              source: resolverSource,
              orderId: trade.orderHash,
              description: `Recovered safety deposit from destination escrow`,
              logType: "safety_recovery", 
              data: {
                resolverAddress: resolverAddr,
                claimTxHash: generateTxHash(),
                safetyAmount,
                token: toToken.symbol,
                chainId: toChain.id,
                escrowAddress: generateAddress(),
              },
            });

            // Source Collection
            tradeLogs.push({
              tradeId,
              timestamp: new Date(logTime + index * 800 + 400).toISOString(),
              title: "Source Assets Collected",
              source: resolverSource,
              orderId: trade.orderHash,
              description: `Collected rewards and safety deposit from source escrow`,
              logType: "source_collect",
              data: {
                resolverAddress: resolverAddr,
                collectTxHash: generateTxHash(),
                rewardAmount,
                safetyAmount,
                totalAmount: (parseFloat(rewardAmount) + parseFloat(safetyAmount)).toFixed(6),
                token: fromToken.symbol,
                chainId: fromChain.id,
                escrowAddress: generateAddress(),
              },
            });
          });
        }
      }
    }

    logs.push(...tradeLogs);
  }

  // Insert all trades
  console.log(`[DataGen] Inserting ${trades.length} trades...`);
  for (const trade of trades) {
    await insertTrade(trade);
  }

  // Insert all logs
  console.log(`[DataGen] Inserting ${logs.length} logs...`);
  for (const log of logs) {
    await insertLog(log);
  }

  // Summary
  const statusCounts = trades.reduce((acc, trade) => {
    acc[trade.status] = (acc[trade.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("[DataGen] Data generation completed!");
  console.log("[DataGen] Status distribution:", statusCounts);
  console.log(`[DataGen] Total trades: ${trades.length}`);
  console.log(`[DataGen] Total logs: ${logs.length}`);
}

// Run the generator
generateDummyData();