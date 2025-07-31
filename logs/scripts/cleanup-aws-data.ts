import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, PurgeQueueCommand } from "@aws-sdk/client-sqs";

// Initialize AWS clients directly for script usage
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const dynamoDbClient = DynamoDBDocumentClient.from(dynamoDBClient);

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const LOGS_TABLE_NAME = process.env.LOGS_TABLE_NAME || "Logs";
const TRADES_TABLE_NAME = process.env.TRADES_TABLE_NAME || "Trades";
const RESOLVER_COMMITMENTS_TABLE_NAME = process.env.RESOLVER_COMMITMENTS_TABLE_NAME || "ResolverCommitments";
const BRIDGE_INTENT_QUEUE_URL = process.env.BRIDGE_INTENT_QUEUE_URL || "https://sqs.us-east-1.amazonaws.com/112639119226/BridgeIntentQueue";

async function deleteAllItemsFromTable(tableName: string) {
  console.log(`[AWS/Cleanup] Starting cleanup for table: ${tableName}`);
  let deletedCount = 0;
  let lastEvaluatedKey = undefined;

  do {
    try {
      // Scan the table
      const scanCommand = new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
      });

      const scanResult = await dynamoDbClient.send(scanCommand) as any;
      
      if (scanResult.Items && scanResult.Items.length > 0) {
        // Delete each item
        for (const item of scanResult.Items) {
          // Get the key attributes based on table
          let key: any = {};
          
          if (tableName === TRADES_TABLE_NAME && item.tradeId) {
            key = { tradeId: item.tradeId };
          } else if (tableName === LOGS_TABLE_NAME && item.tradeId) {
            key = { tradeId: item.tradeId };
          } else if (tableName === RESOLVER_COMMITMENTS_TABLE_NAME && item.commitmentId && item.tradeId) {
            // ResolverCommitments has composite key
            key = { commitmentId: item.commitmentId, tradeId: item.tradeId };
          } else {
            console.log(`[AWS/Cleanup] Warning: Could not determine primary key for item in ${tableName}`, item);
            continue;
          }

          const deleteCommand = new DeleteCommand({
            TableName: tableName,
            Key: key,
          });

          await dynamoDbClient.send(deleteCommand);
          deletedCount++;
        }
      }

      lastEvaluatedKey = scanResult.LastEvaluatedKey;
    } catch (error) {
      console.error(`[AWS/Cleanup] Error cleaning table ${tableName}:`, error);
      throw error;
    }
  } while (lastEvaluatedKey);

  console.log(`[AWS/Cleanup] Deleted ${deletedCount} items from ${tableName}`);
  return deletedCount;
}

async function purgeQueue(queueUrl: string) {
  console.log(`[AWS/Cleanup] Purging queue: ${queueUrl}`);
  
  try {
    const command = new PurgeQueueCommand({
      QueueUrl: queueUrl,
    });

    await sqsClient.send(command);
    console.log(`[AWS/Cleanup] Successfully purged queue: ${queueUrl}`);
  } catch (error) {
    console.error(`[AWS/Cleanup] Error purging queue:`, error);
    throw error;
  }
}

async function cleanupAllData() {
  console.log("[AWS/Cleanup] Starting AWS data cleanup...");
  
  try {
    // Clean up DynamoDB tables
    const results = await Promise.all([
      deleteAllItemsFromTable(TRADES_TABLE_NAME),
      deleteAllItemsFromTable(LOGS_TABLE_NAME),
      deleteAllItemsFromTable(RESOLVER_COMMITMENTS_TABLE_NAME),
    ]);

    console.log(`[AWS/Cleanup] Total items deleted from all tables: ${results.reduce((a, b) => a + b, 0)}`);

    // Purge SQS queue
    await purgeQueue(BRIDGE_INTENT_QUEUE_URL);

    console.log("[AWS/Cleanup] AWS data cleanup completed successfully!");
  } catch (error) {
    console.error("[AWS/Cleanup] Error during cleanup:", error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupAllData();