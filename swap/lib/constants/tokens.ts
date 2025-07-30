import { Token, Chain } from "@/components/features/swap/token_input";

export const CHAINS: Record<number, Chain> = {
  1: { id: 1, name: "Ethereum", shortName: "ETH", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  42161: { id: 42161, name: "Arbitrum", shortName: "ARB", logo: "https://arbitrum.io/logo.png" },
  10: { id: 10, name: "Optimism", shortName: "OP", logo: "https://optimism.io/logo.png" },
  137: { id: 137, name: "Polygon", shortName: "MATIC", logo: "https://assets.coingecko.com/coins/images/4713/small/polygon.png" },
  56: { id: 56, name: "BNB Chain", shortName: "BNB", logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
  8453: { id: 8453, name: "Base", shortName: "BASE", logo: "https://base.org/logo.png" },
  43114: { id: 43114, name: "Avalanche", shortName: "AVAX", logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" },
  100: { id: 100, name: "Gnosis", shortName: "GNO", logo: "https://gnosis.io/logo.png" },
  59144: { id: 59144, name: "Linea", shortName: "LINEA", logo: "https://linea.build/logo.png" },
  324: { id: 324, name: "zkSync Era", shortName: "ZK", logo: "https://zksync.io/logo.png" },
};

export const POPULAR_TOKENS: Token[] = [
  // Ethereum tokens
  {
    symbol: "ETH",
    name: "Ether",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    coingeckoId: "ethereum",
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    chainId: 1,
    chain: CHAINS[1],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    coingeckoId: "usd-coin",
    logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
    chainId: 1,
    chain: CHAINS[1],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    chainId: 1,
    chain: CHAINS[1],
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    coingeckoId: "weth",
    logoURI: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
    chainId: 1,
    chain: CHAINS[1],
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    coingeckoId: "uniswap",
    logoURI: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg",
    chainId: 1,
    chain: CHAINS[1],
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    coingeckoId: "wrapped-bitcoin",
    logoURI: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
    chainId: 1,
    chain: CHAINS[1],
  },
  {
    symbol: "1INCH",
    name: "1inch",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    decimals: 18,
    coingeckoId: "1inch",
    logoURI: "https://assets.coingecko.com/coins/images/13469/small/1inch-token.png",
    chainId: 1,
    chain: CHAINS[1],
  },
  
  // Arbitrum tokens
  {
    symbol: "ETH",
    name: "Ether",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    coingeckoId: "ethereum",
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    chainId: 42161,
    chain: CHAINS[42161],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    chainId: 42161,
    chain: CHAINS[42161],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6,
    coingeckoId: "usd-coin",
    logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
    chainId: 42161,
    chain: CHAINS[42161],
  },
  
  // Polygon tokens
  {
    symbol: "MATIC",
    name: "Polygon",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    coingeckoId: "matic-network",
    logoURI: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
    chainId: 137,
    chain: CHAINS[137],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
    coingeckoId: "usd-coin",
    logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
    chainId: 137,
    chain: CHAINS[137],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    chainId: 137,
    chain: CHAINS[137],
  },
  
  // BNB Chain tokens
  {
    symbol: "BNB",
    name: "BNB",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    coingeckoId: "binancecoin",
    logoURI: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    chainId: 56,
    chain: CHAINS[56],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18,
    coingeckoId: "tether",
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    chainId: 56,
    chain: CHAINS[56],
  },
];

export const TOKENS_BY_SYMBOL: Record<string, Token[]> = POPULAR_TOKENS.reduce((acc, token) => {
  if (!acc[token.symbol]) {
    acc[token.symbol] = [];
  }
  acc[token.symbol].push(token);
  return acc;
}, {} as Record<string, Token[]>);