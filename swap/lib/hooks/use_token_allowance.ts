import { useReadContract } from "wagmi";
import { type Address, formatUnits } from "viem";

const ERC20_ABI = [
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

interface UseTokenAllowanceParams {
  tokenAddress: Address | undefined;
  ownerAddress: Address | undefined;
  spenderAddress: Address | undefined;
  decimals: number;
  chainId: number;
}

export function useTokenAllowance({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  decimals,
  chainId
}: UseTokenAllowanceParams) {
  const { data: allowance, isLoading, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    chainId,
    query: {
      enabled: !!tokenAddress && !!ownerAddress && !!spenderAddress,
    },
  });

  const allowanceFormatted = allowance ? formatUnits(allowance, decimals) : "0";

  return {
    allowance: allowance || BigInt(0),
    allowanceFormatted,
    isLoading,
    error,
    refetch,
  };
}