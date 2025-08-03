import { ethers } from "ethers";
import { signHTLCOrder } from "./eip712";

// Example of how to create and sign a swap order
export async function createSwapOrder(
  signer: ethers.Signer,
  sourceChainId: number,
  sourceToken: string,
  sourceAmount: string,
  destChainId: number,
  destToken: string,
  minAcceptablePrice: string,
  escrowFactoryAddress: string
) {
  // Generate secret
  const secret = ethers.randomBytes(32);
  const secretHash = ethers.keccak256(secret);
  
  // Get user address
  const userAddress = await signer.getAddress();
  
  // Create swap request
  const swapRequest = {
    userAddress,
    srcChainId: sourceChainId,
    srcToken: sourceToken,
    srcAmount: sourceAmount,
    dstChainId: destChainId,
    dstToken: destToken,
    secretHash: secretHash,
    minAcceptablePrice: minAcceptablePrice,
    orderDuration: 3600 // 1 hour
  };
  
  // Sign with EIP-712
  const { signature, orderId } = await signHTLCOrder(
    signer,
    swapRequest,
    escrowFactoryAddress
  );
  
  console.log("[Swap] Order ID:", orderId);
  console.log("[Swap] EIP-712 Signature:", signature);
  
  // Submit to API
  const response = await fetch("/api/create-swap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceChainId,
      destChainId: destChainId,
      sourceToken,
      destToken: destToken,
      sourceAmount,
      userAddress,
      secretHash,
      secret: ethers.hexlify(secret),
      minAcceptablePrice,
      orderDuration: 3600,
      signature
    })
  });
  
  if (!response.ok) {
    throw new Error("Failed to create swap order");
  }
  
  const result = await response.json();
  
  return {
    orderId: result.orderId,
    secret: ethers.hexlify(secret),
    secretHash,
    signature,
    ...result
  };
}