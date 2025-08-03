"use client";

import { useAccount, useBalance, useReadContracts } from "wagmi";
import { CHAINS, POPULAR_TOKENS } from "@/lib/constants/tokens";
import { useTokenPrices } from "./use_token_prices";
import { formatUnits } from "viem";
import { erc20Abi } from "viem";
import { useMultiWallet } from "@/lib/context/multi_wallet_context";
import { useEffect, useState } from "react";
import { chainLogos } from "@/lib/config/chain_logos";

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
    id: number | string;
    name: string;
    shortName: string;
    logo?: string;
  };
  balance: string;
  balanceFormatted: string;
  usdValue: number;
}

interface NonEvmBalance {
  chainId: string;
  tokens: {
    symbol: string;
    balance: string;
    decimals: number;
  }[];
}

export function useMultiChainBalances() {
  const { address, isConnected } = useAccount();
  const { wallets } = useMultiWallet();
  const [nonEvmBalances, setNonEvmBalances] = useState<NonEvmBalance[]>([]);
  const [isLoadingNonEvm, setIsLoadingNonEvm] = useState(false);
  
  // Get unique EVM chain IDs from popular tokens
  const evmChainIds = [...new Set(
    POPULAR_TOKENS
      .filter(token => typeof token.chainId === "number")
      .map(token => token.chainId as number)
  )];
  
  // Get native token balances for each EVM chain
  const ethereumBalance = useBalance({
    address,
    chainId: 11155111, // Ethereum Sepolia
    query: {
      enabled: !!address && isConnected && evmChainIds.includes(11155111),
    },
  });
  
  const baseBalance = useBalance({
    address,
    chainId: 84532, // Base Sepolia
    query: {
      enabled: !!address && isConnected && evmChainIds.includes(84532),
    },
  });
  
  const arbitrumBalance = useBalance({
    address,
    chainId: 421614, // Arbitrum Sepolia
    query: {
      enabled: !!address && isConnected && evmChainIds.includes(421614),
    },
  });
  
  const polygonBalance = useBalance({
    address,
    chainId: 80002, // Polygon Amoy
    query: {
      enabled: !!address && isConnected && evmChainIds.includes(80002),
    },
  });

  const bnbBalance = useBalance({
    address,
    chainId: 97, // BNB Testnet
    query: {
      enabled: !!address && isConnected && evmChainIds.includes(97),
    },
  });

  // Collect all EVM balance results
  const nativeBalances = [
    { chainId: 11155111, balance: ethereumBalance.data },
    { chainId: 84532, balance: baseBalance.data },
    { chainId: 421614, balance: arbitrumBalance.data },
    { chainId: 80002, balance: polygonBalance.data },
    { chainId: 97, balance: bnbBalance.data },
  ].filter(item => evmChainIds.includes(item.chainId));

  // Prepare contract reads for all ERC20 tokens (EVM only)
  const contractReads = POPULAR_TOKENS
    .filter(token => 
      typeof token.chainId === "number" && 
      token.address !== "0x0000000000000000000000000000000000000000" &&
      token.address !== "0x0"
    )
    .map(token => ({
      address: token.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
      chainId: token.chainId as number,
    }));

  const { data: erc20Balances } = useReadContracts({
    contracts: contractReads,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Fetch non-EVM balances
  useEffect(() => {
    const fetchNonEvmBalances = async () => {
      if (!wallets || wallets.length === 0) return;
      
      setIsLoadingNonEvm(true);
      const balances: NonEvmBalance[] = [];
      
      for (const wallet of wallets) {
        if (wallet.type === "non-evm" && wallet.walletType) {
          try {
            // Get the wallet manager from window
            const walletManagerKey = `${wallet.walletType}-${wallet.chainId}`;
            const walletManager = (window as unknown as { __nonEvmWalletManagers?: Record<string, { getBalance?: () => Promise<{ amount: string; decimals: number }> }> }).__nonEvmWalletManagers?.[walletManagerKey];
            
            if (walletManager && walletManager.getBalance) {
              const balance = await walletManager.getBalance();
              
              // For non-EVM chains, we'll simulate having the 3 tokens
              // In reality, you'd fetch the actual token balances
              balances.push({
                chainId: wallet.chainId as string,
                tokens: [
                  {
                    symbol: `W${CHAINS[wallet.chainId]?.shortName || ""}`,
                    balance: balance.amount || "0",
                    decimals: balance.decimals || 18,
                  },
                  {
                    symbol: "USDT",
                    balance: "0", // Mock balance - replace with actual
                    decimals: 6,
                  },
                  {
                    symbol: "DAI",
                    balance: "0", // Mock balance - replace with actual
                    decimals: 18,
                  }
                ]
              });
            }
          } catch (error) {
            console.error(`[MultiChainBalances] Error fetching balance for ${wallet.walletType}:`, error);
          }
        }
      }
      
      setNonEvmBalances(balances);
      setIsLoadingNonEvm(false);
    };
    
    fetchNonEvmBalances();
  }, [wallets]);

  // Get all unique coingecko IDs for price fetching
  const coingeckoIds = POPULAR_TOKENS
    .map(token => token.coingeckoId)
    .filter((id): id is string => !!id);
  
  const { prices } = useTokenPrices(coingeckoIds);

  // Combine all balances
  const allBalances: TokenBalance[] = [];

  // Add EVM native token balances
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
      chain: {
        ...CHAINS[chainId],
        logo: chainLogos[chainId],
      },
      balance: balance.value.toString(),
      balanceFormatted: balance.formatted,
      usdValue,
    });
  });

  // Add EVM ERC20 token balances
  erc20Balances?.forEach((result, index) => {
    if (!result || result.status !== "success" || !result.result) return;
    
    const balance = result.result as bigint;
    if (balance === BigInt(0)) return;
    
    const token = POPULAR_TOKENS.filter(
      t => typeof t.chainId === "number" && 
          t.address !== "0x0000000000000000000000000000000000000000" &&
          t.address !== "0x0"
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
      chain: {
        ...CHAINS[token.chainId],
        logo: chainLogos[token.chainId],
      },
      balance: balance.toString(),
      balanceFormatted,
      usdValue,
    });
  });

  // Add non-EVM balances
  nonEvmBalances.forEach(({ chainId, tokens }) => {
    tokens.forEach((tokenBalance) => {
      const token = POPULAR_TOKENS.find(
        t => t.chainId === chainId && t.symbol === tokenBalance.symbol
      );
      
      if (!token || tokenBalance.balance === "0") return;
      
      const balanceFormatted = formatUnits(BigInt(tokenBalance.balance), tokenBalance.decimals);
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
        chain: {
          ...CHAINS[chainId],
          logo: chainLogos[chainId],
        },
        balance: tokenBalance.balance,
        balanceFormatted,
        usdValue,
      });
    });
  });

  // Calculate total USD value
  const totalUsdValue = allBalances.reduce((sum, balance) => sum + balance.usdValue, 0);

  // Sort by USD value descending
  allBalances.sort((a, b) => b.usdValue - a.usdValue);

  return {
    balances: allBalances,
    totalUsdValue,
    isLoading: !prices || Object.keys(prices).length === 0 || isLoadingNonEvm,
  };
}