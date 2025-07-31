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

    // Generate logs for each trade
    const logMessages = [
      { level: "info", message: `Trade ${tradeId} created`, source: "relayer" },
    ];

    if (status !== "in_auction") {
      logMessages.push({
        level: "info",
        message: `Resolver ${trade.resolverAddress} committed to trade ${tradeId}`,
        source: "resolver",
      });
    }

    if (status === "completed") {
      logMessages.push({
        level: "info",
        message: `Trade ${tradeId} completed successfully`,
        source: "relayer",
      });
    } else if (status === "rescue_available") {
      logMessages.push({
        level: "warn",
        message: `Trade ${tradeId} expired - rescue available`,
        source: "monitor",
      });
    } else if (status === "failed") {
      logMessages.push({
        level: "error",
        message: `Trade ${tradeId} failed - funds rescued`,
        source: "rescuer",
      });
    }

    logMessages.forEach((logMsg, index) => {
      logs.push({
        tradeId,
        timestamp: new Date(createdAt + index * 1000).toISOString(),
        ...logMsg,
        data: {
          fromChain: fromChain.name,
          toChain: toChain.name,
          amount: srcAmount,
        },
      });
    });
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