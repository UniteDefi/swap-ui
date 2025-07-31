import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/aws-config";

export async function GET(request: NextRequest) {
  try {
    if (!docClient) {
      console.error("[API/logs] DynamoDB client not initialized");
      return NextResponse.json(
        { success: false, error: "Database connection not available" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tradeId = searchParams.get("tradeId");

    let command;

    if (tradeId) {
      // Query logs for specific trade
      command = new QueryCommand({
        TableName: TABLES.LOGS,
        KeyConditionExpression: "tradeId = :tradeId",
        ExpressionAttributeValues: {
          ":tradeId": tradeId,
        },
      });
    } else {
      // Scan all logs
      command = new ScanCommand({
        TableName: TABLES.LOGS,
        Limit: 100,
      });
    }

    const response = await docClient.send(command);

    return NextResponse.json({ data: response.Items || [] });
  } catch (error) {
    console.error("[API/logs] Error fetching logs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
