import { Token, Chain } from "@/components/features/swap/token_input";
import { hasDeployments, getContractAddress } from "@/lib/utils/deployment_filter";

// All available chains
const ALL_CHAINS: Record<number | string, Chain> = {
  // EVM Chains
  11155111: { id: 11155111, name: "Ethereum Sepolia", shortName: "ETH", logo: "/logos/ethereum.png" },
  84532: { id: 84532, name: "Base Sepolia", shortName: "BASE", logo: "/logos/base.png" },
  421614: { id: 421614, name: "Arbitrum Sepolia", shortName: "ARB", logo: "/logos/arbitrum.png" },
  11155420: { id: 11155420, name: "Optimism Sepolia", shortName: "OP", logo: "/logos/optimism.png" },
  80002: { id: 80002, name: "Polygon Amoy", shortName: "MATIC", logo: "/logos/polygon.png" },
  534351: { id: 534351, name: "Scroll Sepolia", shortName: "SCROLL", logo: "/logos/scroll.png" },
  44787: { id: 44787, name: "Celo Alfajores", shortName: "CELO", logo: "/logos/celo.png" },
  1301: { id: 1301, name: "Unichain Sepolia", shortName: "UNI", logo: "/logos/unichain.png" },
  545: { id: 545, name: "Flow Testnet", shortName: "FLOW", logo: "/logos/flow.png" },
  713715: { id: 713715, name: "Sei Testnet", shortName: "SEI", logo: "/logos/sei.png" },
  97: { id: 97, name: "BNB Testnet", shortName: "BNB", logo: "/logos/bnb.png" },
  1313161555: { id: 1313161555, name: "Aurora Testnet", shortName: "AURORA", logo: "/logos/aurora.png" },
  11111: { id: 11111, name: "Injective Testnet", shortName: "INJ", logo: "/logos/injective.png" },
  128123: { id: 128123, name: "Etherlink Testnet", shortName: "XTZ", logo: "/logos/etherlink.png" },
  10143: { id: 10143, name: "Monad Testnet", shortName: "MON", logo: "/logos/monad.png" },
  // Non-EVM Chains
  "aptos-testnet": { id: "aptos-testnet", name: "Aptos Testnet", shortName: "APT", logo: "/logos/aptos.png" },
  "sui-testnet": { id: "sui-testnet", name: "Sui Testnet", shortName: "SUI", logo: "/logos/sui.png" },
  "stellar-testnet": { id: "stellar-testnet", name: "Stellar Testnet", shortName: "XLM", logo: "/logos/stellar.png" },
  "osmosis-testnet": { id: "osmosis-testnet", name: "Osmosis", shortName: "OSMO", logo: "/logos/osmosis.png" },
  "xrpl-testnet": { id: "xrpl-testnet", name: "XRPL Testnet", shortName: "XRP", logo: "/logos/xrpl.png" },
  "starknet-testnet": { id: "starknet-testnet", name: "Starknet Testnet", shortName: "STRK", logo: "/logos/starknet.png" },
  "icp": { id: "icp", name: "ICP", shortName: "ICP", logo: "/logos/icp.png" },
};

// Only export chains that have deployments
export const CHAINS: Record<number | string, Chain> = Object.fromEntries(
  Object.entries(ALL_CHAINS).filter(([chainId]) => hasDeployments(chainId))
);

// Helper function to get token addresses from deployments
function getTokenAddress(chainId: string | number, tokenType: "usdt" | "dai" | "wrapped"): string {
  switch (tokenType) {
    case "usdt":
      return getContractAddress(chainId, "mockUsdt") || "";
    case "dai":
      return getContractAddress(chainId, "mockDai") || "";
    case "wrapped":
      return getContractAddress(chainId, "mockWrappedNative") || "";
    default:
      return "";
  }
}

// Generate USDT and DAI tokens for all deployed chains
function generateTokensForAllChains(): Token[] {
  const tokens: Token[] = [];
  
  // Get all chain IDs from CHAINS (which already filters for deployed chains)
  const chainIds = Object.keys(CHAINS);
  
  for (const chainId of chainIds) {
    const chain = CHAINS[chainId];
    const numericChainId = typeof chainId === "string" && isNaN(Number(chainId)) ? chainId : Number(chainId);
    
    // Only add USDT if the chain has USDT deployment
    const usdtAddress = getTokenAddress(chainId, "usdt");
    if (usdtAddress) {
      tokens.push({
        symbol: "USDT",
        name: "Tether USD",
        address: usdtAddress,
        decimals: 6,
        coingeckoId: "tether",
        logoURI: "/logos/usdt.png",
        chainId: numericChainId,
        chain: chain,
      });
    }
    
    // Only add DAI if the chain has DAI deployment
    const daiAddress = getTokenAddress(chainId, "dai");
    if (daiAddress) {
      tokens.push({
        symbol: "DAI",
        name: "Dai Stablecoin",
        address: daiAddress,
        decimals: 18,
        coingeckoId: "dai",
        logoURI: "/logos/dai.png",
        chainId: numericChainId,
        chain: chain,
      });
    }
  }
  
  return tokens;
}

export const POPULAR_TOKENS: Token[] = generateTokensForAllChains();

export const TOKENS_BY_SYMBOL: Record<string, Token[]> = POPULAR_TOKENS.reduce((acc, token) => {
  if (!acc[token.symbol]) {
    acc[token.symbol] = [];
  }
  acc[token.symbol].push(token);
  return acc;
}, {} as Record<string, Token[]>);