"use client";

import { useAccount, useBalance, useReadContracts } from "wagmi";
import { CHAINS, POPULAR_TOKENS } from "@/lib/constants/tokens";
import { useTokenPrices } from "./use_token_prices";
import { formatUnits } from "viem";
import { erc20Abi } from "viem";

export interface TokenBalance {
  token: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string;
    coingeckoId?: string;
  };
  chain: {
    id: number;
    name: string;
    shortName: string;
    logo?: string;
  };
  balance: string;
  balanceFormatted: string;
  usdValue: number;
}

export function useMultiChainBalances() {
  const { address, isConnected } = useAccount();
  
  // Get unique chain IDs from popular tokens
  const chainIds = [...new Set(POPULAR_TOKENS.map(token => token.chainId))];
  
  // Get native token balances for each chain
  // Note: We need to call useBalance for each chain separately at the top level
  const ethereumBalance = useBalance({
    address,
    chainId: 1, // Ethereum
    query: {
      enabled: !!address && isConnected && chainIds.includes(1),
    },
  });
  
  const polygonBalance = useBalance({
    address,
    chainId: 137, // Polygon
    query: {
      enabled: !!address && isConnected && chainIds.includes(137),
    },
  });
  
  const bscBalance = useBalance({
    address,
    chainId: 56, // BSC
    query: {
      enabled: !!address && isConnected && chainIds.includes(56),
    },
  });
  
  const arbitrumBalance = useBalance({
    address,
    chainId: 42161, // Arbitrum
    query: {
      enabled: !!address && isConnected && chainIds.includes(42161),
    },
  });

  // Collect all balance results
  const nativeBalances = [
    { chainId: 1, balance: ethereumBalance.data },
    { chainId: 137, balance: polygonBalance.data },
    { chainId: 56, balance: bscBalance.data },
    { chainId: 42161, balance: arbitrumBalance.data },
  ].filter(item => chainIds.includes(item.chainId));

  // Prepare contract reads for all ERC20 tokens
  const contractReads = POPULAR_TOKENS
    .filter(token => token.address !== "0x0000000000000000000000000000000000000000")
    .map(token => ({
      address: token.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
      chainId: token.chainId,
    }));

  const { data: erc20Balances } = useReadContracts({
    contracts: contractReads,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Get all unique coingecko IDs for price fetching
  const coingeckoIds = POPULAR_TOKENS
    .map(token => token.coingeckoId)
    .filter((id): id is string => !!id);
  
  const { prices } = useTokenPrices(coingeckoIds);

  // Combine all balances
  const allBalances: TokenBalance[] = [];

  // Add native token balances
  nativeBalances.forEach(({ chainId, balance }) => {
    if (!balance || balance.value === BigInt(0)) return;
    
    const nativeToken = POPULAR_TOKENS.find(
      token => token.chainId === chainId && token.address === "0x0000000000000000000000000000000000000000"
    );
    
    if (!nativeToken) return;
    
    const price = nativeToken.coingeckoId ? prices[nativeToken.coingeckoId]?.usd || 0 : 0;
    const usdValue = parseFloat(balance.formatted) * price;
    
    allBalances.push({
      token: {
        symbol: nativeToken.symbol,
        name: nativeToken.name,
        address: nativeToken.address,
        decimals: nativeToken.decimals,
        logoURI: nativeToken.logoURI,
        coingeckoId: nativeToken.coingeckoId,
      },
      chain: CHAINS[chainId],
      balance: balance.value.toString(),
      balanceFormatted: balance.formatted,
      usdValue,
    });
  });

  // Add ERC20 token balances
  erc20Balances?.forEach((result, index) => {
    if (!result || result.status !== "success" || !result.result) return;
    
    const balance = result.result as bigint;
    if (balance === BigInt(0)) return;
    
    const token = POPULAR_TOKENS.filter(
      t => t.address !== "0x0000000000000000000000000000000000000000"
    )[index];
    
    if (!token) return;
    
    const balanceFormatted = formatUnits(balance, token.decimals);
    const price = token.coingeckoId ? prices[token.coingeckoId]?.usd || 0 : 0;
    const usdValue = parseFloat(balanceFormatted) * price;
    
    allBalances.push({
      token: {
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        decimals: token.decimals,
        logoURI: token.logoURI,
        coingeckoId: token.coingeckoId,
      },
      chain: CHAINS[token.chainId],
      balance: balance.toString(),
      balanceFormatted,
      usdValue,
    });
  });

  // Calculate total USD value
  const totalUsdValue = allBalances.reduce((sum, balance) => sum + balance.usdValue, 0);

  // Sort by USD value descending
  allBalances.sort((a, b) => b.usdValue - a.usdValue);

  return {
    balances: allBalances,
    totalUsdValue,
    isLoading: !prices || Object.keys(prices).length === 0,
  };
}