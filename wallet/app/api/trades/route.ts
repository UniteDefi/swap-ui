import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/aws-config";

export async function GET() {
  try {
    if (!docClient) {
      console.error("[API/trades] DynamoDB client not initialized");
      return NextResponse.json(
        { success: false, error: "Database connection not available" },
        { status: 503 }
      );
    }

    const command = new ScanCommand({
      TableName: TABLES.TRADES,
      Limit: 100,
    });

    const response = await docClient.send(command);
    
    return NextResponse.json({
      success: true,
      data: response.Items || [],
      count: response.Count || 0,
    });
  } catch (error) {
    console.error("[API/trades] Error fetching trades:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}