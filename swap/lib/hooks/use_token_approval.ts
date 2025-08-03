import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, type Address } from "viem";
import { useToast } from "./use-toast";
import { getEscrowFactoryAddress } from "@/lib/utils/escrow_factory";

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    name: "allowance",
    type: "function",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  }
] as const;

interface UseTokenApprovalParams {
  tokenAddress: Address | undefined;
  chainId: number;
  amount: string;
  decimals: number;
}

export function useTokenApproval({
  tokenAddress,
  chainId,
  amount,
  decimals
}: UseTokenApprovalParams) {
  const { address } = useAccount();
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  
  const { isLoading: isWaitingForTx, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = useCallback(async () => {
    if (!tokenAddress || !address || !amount) {
      console.error("[TokenApproval] Missing required parameters");
      return;
    }

    const spenderAddress = getEscrowFactoryAddress(chainId);
    if (!spenderAddress) {
      console.error("[TokenApproval] No escrow factory address configured for chain", chainId);
      toast({
        title: "Configuration Error",
        description: "Escrow factory address not configured for this chain",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsApproving(true);
      const amountInWei = parseUnits(amount, decimals);
      
      console.log("[TokenApproval] Approving:", {
        token: tokenAddress,
        spender: spenderAddress,
        amount: amountInWei.toString(),
        chainId,
      });

      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [spenderAddress as Address, amountInWei],
      });
    } catch (error) {
      console.error("[TokenApproval] Error:", error);
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsApproving(false);
    }
  }, [tokenAddress, chainId, address, amount, decimals, writeContract, toast]);

  // Reset approving state when transaction completes
  if (isSuccess && isApproving) {
    setIsApproving(false);
    toast({
      title: "Approval Successful",
      description: "Token approval completed successfully",
    });
  }

  if (writeError && isApproving) {
    setIsApproving(false);
    toast({
      title: "Approval Failed",
      description: writeError.message,
      variant: "destructive",
    });
  }

  return {
    approve,
    isApproving: isApproving || isWaitingForTx,
    isSuccess,
    error: writeError,
    hash,
  };
}