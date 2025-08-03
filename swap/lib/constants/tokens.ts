import { Token, Chain } from "@/components/features/swap/token_input";
import deployments from "./deployments.json";

export const CHAINS: Record<number | string, Chain> = {
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
  41454: { id: 41454, name: "Monad Testnet", shortName: "MON", logo: "/logos/monad.png" },
  // Non-EVM Chains
  "aptos-testnet": { id: "aptos-testnet", name: "Aptos Testnet", shortName: "APT", logo: "/logos/aptos.png" },
  "sui-testnet": { id: "sui-testnet", name: "Sui Testnet", shortName: "SUI", logo: "/logos/sui.png" },
  "cardano-testnet": { id: "cardano-testnet", name: "Cardano Testnet", shortName: "ADA", logo: "/logos/cardano.png" },
  "stellar-testnet": { id: "stellar-testnet", name: "Stellar Testnet", shortName: "XLM", logo: "/logos/stellar.png" },
  "osmosis-testnet": { id: "osmosis-testnet", name: "Osmosis Testnet", shortName: "OSMO", logo: "/logos/osmosis.png" },
  "secret-testnet": { id: "secret-testnet", name: "Secret Network Testnet", shortName: "SCRT", logo: "/logos/secret.png" },
  "xrpl-testnet": { id: "xrpl-testnet", name: "XRPL Testnet", shortName: "XRP", logo: "/logos/xrpl.png" },
  "ton-testnet": { id: "ton-testnet", name: "TON Testnet", shortName: "TON", logo: "/logos/ton.png" },
  "near-testnet": { id: "near-testnet", name: "NEAR Testnet", shortName: "NEAR", logo: "/logos/near.png" },
  "polkadot-testnet": { id: "polkadot-testnet", name: "Polkadot Testnet", shortName: "DOT", logo: "/logos/polkadot.png" },
  "starknet-testnet": { id: "starknet-testnet", name: "Starknet Testnet", shortName: "STRK", logo: "/logos/starknet.png" },
};

// Helper function to get token addresses from deployments
function getTokenAddress(chainId: string | number, tokenType: "usdt" | "dai" | "wrapped"): string {
  const deployment = deployments[chainId as keyof typeof deployments];
  if (!deployment) return "";
  
  switch (tokenType) {
    case "usdt":
      return deployment.mockUsdtAddress || "";
    case "dai":
      return deployment.mockDaiAddress || "";
    case "wrapped":
      return deployment.mockWrappedNativeAddress || "";
    default:
      return "";
  }
}

// Generate USDT and DAI tokens for all supported chains
function generateTokensForAllChains(): Token[] {
  const tokens: Token[] = [];
  
  // Get all chain IDs from CHAINS
  const chainIds = Object.keys(CHAINS);
  
  for (const chainId of chainIds) {
    const chain = CHAINS[chainId];
    const numericChainId = typeof chainId === "string" && isNaN(Number(chainId)) ? chainId : Number(chainId);
    
    // Add USDT for this chain
    tokens.push({
      symbol: "USDT",
      name: "Tether USD",
      address: getTokenAddress(chainId, "usdt") || "0x0000000000000000000000000000000000000000",
      decimals: 6,
      coingeckoId: "tether",
      logoURI: "/logos/usdt.png",
      chainId: numericChainId,
      chain: chain,
    });
    
    // Add DAI for this chain
    tokens.push({
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: getTokenAddress(chainId, "dai") || "0x0000000000000000000000000000000000000000",
      decimals: 18,
      coingeckoId: "dai",
      logoURI: "/logos/dai.png",
      chainId: numericChainId,
      chain: chain,
    });
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