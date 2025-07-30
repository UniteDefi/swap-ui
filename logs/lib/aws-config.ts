import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SQSClient } from "@aws-sdk/client-sqs";

// Check if we're in a server environment
const isServer = typeof window === "undefined";

// Only initialize AWS clients on the server
const dynamoDBClient = isServer && process.env.AWS_ACCESS_KEY_ID
  ? new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    })
  : null;

export const docClient = dynamoDBClient 
  ? DynamoDBDocumentClient.from(dynamoDBClient)
  : null;

export const sqsClient = isServer && process.env.AWS_ACCESS_KEY_ID
  ? new SQSClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    })
  : null;

export const TABLES = {
  LOGS: process.env.LOGS_TABLE_NAME || "Logs",
  RESOLVER_COMMITMENTS: process.env.RESOLVER_COMMITMENTS_TABLE_NAME || "ResolverCommitments",
  TRADES: process.env.TRADES_TABLE_NAME || "Trades",
};

export const QUEUES = {
  BRIDGE_INTENT: process.env.BRIDGE_INTENT_QUEUE_URL || "",
};