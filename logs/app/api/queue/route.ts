import { NextResponse } from "next/server";
import { GetQueueAttributesCommand, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient, QUEUES } from "@/lib/aws-config";

export async function GET() {
  try {
    if (!sqsClient) {
      console.error("[API/queue] SQS client not initialized");
      return NextResponse.json(
        { success: false, error: "Queue service not available" },
        { status: 503 }
      );
    }

    if (!QUEUES.BRIDGE_INTENT) {
      console.error("[API/queue] Queue URL not configured");
      return NextResponse.json(
        { success: false, error: "Queue URL not configured" },
        { status: 503 }
      );
    }

    // Get queue attributes
    const attributesCommand = new GetQueueAttributesCommand({
      QueueUrl: QUEUES.BRIDGE_INTENT,
      AttributeNames: ["All"],
    });

    const attributes = await sqsClient.send(attributesCommand);

    // Get recent messages (up to 10)
    const messagesCommand = new ReceiveMessageCommand({
      QueueUrl: QUEUES.BRIDGE_INTENT,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 0, // Don't hide messages from other consumers
      WaitTimeSeconds: 0, // Don't wait for messages
    });

    const messages = await sqsClient.send(messagesCommand);

    return NextResponse.json({
      success: true,
      attributes: attributes.Attributes,
      recentMessages: messages.Messages || [],
      messageCount: parseInt(attributes.Attributes?.ApproximateNumberOfMessages || "0"),
      messagesInFlight: parseInt(attributes.Attributes?.ApproximateNumberOfMessagesNotVisible || "0"),
    });
  } catch (error) {
    console.error("[API/queue] Error fetching queue data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch queue data" },
      { status: 500 }
    );
  }
}