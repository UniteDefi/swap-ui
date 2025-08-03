import { ethers } from "ethers";

export interface HTLCOrder {
  userAddress: string;
  srcChainId: number;
  srcToken: string;
  srcAmount: string;
  dstChainId: number;
  dstToken: string;
  secretHash: string;
  minAcceptablePrice: string;
  orderDuration: number;
  nonce: string;
  deadline: number;
}

export const EIP712_DOMAIN_TYPE = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" }
];

export const HTLC_ORDER_TYPE = [
  { name: "userAddress", type: "address" },
  { name: "srcChainId", type: "uint256" },
  { name: "srcToken", type: "address" },
  { name: "srcAmount", type: "uint256" },
  { name: "dstChainId", type: "uint256" },
  { name: "dstToken", type: "address" },
  { name: "secretHash", type: "bytes32" },
  { name: "minAcceptablePrice", type: "uint256" },
  { name: "orderDuration", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" }
];

export const EIP712_TYPES = {
  HTLCOrder: HTLC_ORDER_TYPE
};

export async function signHTLCOrder(
  signer: ethers.Signer,
  swapRequest: {
    userAddress: string;
    srcChainId: number;
    srcToken: string;
    srcAmount: string;
    dstChainId: number;
    dstToken: string;
    secretHash: string;
    minAcceptablePrice: string;
    orderDuration: number;
  },
  verifyingContract: string
): Promise<{ signature: string; typedData: unknown; orderId: string }> {
  // Create HTLCOrder
  const htlcOrder: HTLCOrder = {
    ...swapRequest,
    nonce: Date.now().toString(),
    deadline: Math.floor(Date.now() / 1000) + swapRequest.orderDuration
  };

  // Create domain
  const domain = {
    name: "HTLC Cross-Chain Swap",
    version: "1",
    chainId: swapRequest.srcChainId,
    verifyingContract
  };

  // Create typed data
  const typedData = {
    types: EIP712_TYPES,
    domain,
    message: htlcOrder
  };

  // Sign the typed data
  const signature = await signer.signTypedData(
    domain,
    EIP712_TYPES,
    htlcOrder
  );

  // Calculate order ID (hash)
  const orderId = ethers.TypedDataEncoder.hash(
    domain,
    EIP712_TYPES,
    htlcOrder
  );

  return { signature, typedData, orderId };
}