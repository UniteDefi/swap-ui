import { NextRequest, NextResponse } from "next/server";

export interface CreateSwapRequest {
  sourceChainId: number;
  destChainId: number;
  sourceToken: string;
  destToken: string;
  sourceAmount: string;
  userAddress: string;
  secretHash: string;
  secret: string;
  minAcceptablePrice: string;
  orderDuration: number;
  signature: string;
}

export interface CreateSwapResponse {
  orderId: string;
  success: boolean;
  marketPrice: string;
  expiresAt: number;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSwapRequest = await request.json();
    
    // TODO: Replace with actual relayer service URL
    const RELAYER_SERVICE_URL = process.env.RELAYER_SERVICE_URL || "http://localhost:3000";
    
    console.log("[API/create-swap] Creating EIP-712 signed swap order");
    
    // Prepare swap request in relayer format
    const swapRequest = {
      userAddress: body.userAddress,
      srcChainId: body.sourceChainId,
      srcToken: body.sourceToken,
      srcAmount: body.sourceAmount,
      dstChainId: body.destChainId,
      dstToken: body.destToken,
      secretHash: body.secretHash,
      minAcceptablePrice: body.minAcceptablePrice,
      orderDuration: body.orderDuration
    };
    
    // Forward request to relayer service with EIP-712 signature
    const response = await fetch(`${RELAYER_SERVICE_URL}/api/create-swap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        swapRequest,
        signature: body.signature,
        secret: body.secret
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("[API/create-swap] Relayer service error:", error);
      return NextResponse.json(
        { error: "Failed to create swap order" },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log("[API/create-swap] EIP-712 signed order created:", data);
    
    return NextResponse.json<CreateSwapResponse>(data);
  } catch (error) {
    console.error("[API/create-swap] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}