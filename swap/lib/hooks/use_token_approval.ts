import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, type Address } from "viem";
import { useToast } from "./use-toast";

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
  spenderAddress: Address | undefined;
  amount: string;
  decimals: number;
}

export function useTokenApproval({
  tokenAddress,
  spenderAddress,
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
    if (!tokenAddress || !spenderAddress || !address || !amount) {
      console.error("[TokenApproval] Missing required parameters");
      return;
    }

    try {
      setIsApproving(true);
      const amountInWei = parseUnits(amount, decimals);
      
      console.log("[TokenApproval] Approving:", {
        token: tokenAddress,
        spender: spenderAddress,
        amount: amountInWei.toString(),
      });

      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [spenderAddress, amountInWei],
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
  }, [tokenAddress, spenderAddress, address, amount, decimals, writeContract, toast]);

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