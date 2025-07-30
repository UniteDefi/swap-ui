import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/aws-config";

export async function GET() {
  try {
    if (!docClient) {
      console.error("[API/resolver-commitments] DynamoDB client not initialized");
      return NextResponse.json(
        { success: false, error: "Database connection not available" },
        { status: 503 }
      );
    }

    const command = new ScanCommand({
      TableName: TABLES.RESOLVER_COMMITMENTS,
      Limit: 100,
    });

    const response = await docClient.send(command);
    
    return NextResponse.json({
      success: true,
      data: response.Items || [],
      count: response.Count || 0,
    });
  } catch (error) {
    console.error("[API/resolver-commitments] Error fetching commitments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resolver commitments" },
      { status: 500 }
    );
  }
}