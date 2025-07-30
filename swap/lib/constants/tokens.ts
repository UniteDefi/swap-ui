import { Token, Chain } from "@/components/features/swap/token_input";

export const CHAINS: Record<number, Chain> = {
  80002: { id: 80002, name: "Polygon Amoy", shortName: "MATIC", logo: "/logos/polygon.png" },
  421614: { id: 421614, name: "Arbitrum Sepolia", shortName: "ARB", logo: "/logos/arbitrum.png" },
  84532: { id: 84532, name: "Base Sepolia", shortName: "BASE", logo: "/logos/base.png" },
  97: { id: 97, name: "BNB Testnet", shortName: "BNB", logo: "/logos/bnb.png" },
  11155111: { id: 11155111, name: "Ethereum Sepolia", shortName: "ETH", logo: "/logos/ethereum.png" },
  41454: { id: 41454, name: "Monad Testnet", shortName: "MON", logo: "/logos/monad.png" },
  128123: { id: 128123, name: "Etherlink Testnet", shortName: "XTZ", logo: "/logos/etherlink.png" },
  713715: { id: 713715, name: "Sei Testnet", shortName: "SEI", logo: "/logos/sei.png" },
};

export const POPULAR_TOKENS: Token[] = [
  // Polygon Amoy
  {
    symbol: "WMATIC",
    name: "Wrapped Matic",
    address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    decimals: 18,
    coingeckoId: "wmatic",
    logoURI: "/logos/polygon.png",
    chainId: 80002,
    chain: CHAINS[80002],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "/logos/usdt.png",
    chainId: 80002,
    chain: CHAINS[80002],
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "/logos/dai.png",
    chainId: 80002,
    chain: CHAINS[80002],
  },

  // Arbitrum Sepolia
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
    decimals: 18,
    coingeckoId: "weth",
    logoURI: "/logos/ethereum.png",
    chainId: 421614,
    chain: CHAINS[421614],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x1234567890123456789012345678901234567890", // Mock address for testnet
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "/logos/usdt.png",
    chainId: 421614,
    chain: CHAINS[421614],
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x1234567890123456789012345678901234567891", // Mock address for testnet
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "/logos/dai.png",
    chainId: 421614,
    chain: CHAINS[421614],
  },

  // Base Sepolia
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    coingeckoId: "weth",
    logoURI: "/logos/ethereum.png",
    chainId: 84532,
    chain: CHAINS[84532],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x1234567890123456789012345678901234567892", // Mock address for testnet
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "/logos/usdt.png",
    chainId: 84532,
    chain: CHAINS[84532],
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x1234567890123456789012345678901234567893", // Mock address for testnet
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "/logos/dai.png",
    chainId: 84532,
    chain: CHAINS[84532],
  },

  // BNB Testnet
  {
    symbol: "WBNB",
    name: "Wrapped BNB",
    address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    decimals: 18,
    coingeckoId: "wbnb",
    logoURI: "/logos/bnb.png",
    chainId: 97,
    chain: CHAINS[97],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    decimals: 18,
    coingeckoId: "tether",
    logoURI: "/logos/usdt.png",
    chainId: 97,
    chain: CHAINS[97],
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867",
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "/logos/dai.png",
    chainId: 97,
    chain: CHAINS[97],
  },

  // Ethereum Sepolia
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    decimals: 18,
    coingeckoId: "weth",
    logoURI: "/logos/ethereum.png",
    chainId: 11155111,
    chain: CHAINS[11155111],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "/logos/usdt.png",
    chainId: 11155111,
    chain: CHAINS[11155111],
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x68194a729C2450ad26072b3D33ADaCbcef39D574",
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "/logos/dai.png",
    chainId: 11155111,
    chain: CHAINS[11155111],
  },

  // Monad Testnet
  {
    symbol: "WMON",
    name: "Wrapped Monad",
    address: "0x1234567890123456789012345678901234567894", // Mock address for testnet
    decimals: 18,
    coingeckoId: "wmon",
    logoURI: "/logos/monad.png",
    chainId: 41454,
    chain: CHAINS[41454],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x1234567890123456789012345678901234567895", // Mock address for testnet
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "/logos/usdt.png",
    chainId: 41454,
    chain: CHAINS[41454],
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x1234567890123456789012345678901234567896", // Mock address for testnet
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "/logos/dai.png",
    chainId: 41454,
    chain: CHAINS[41454],
  },

  // Etherlink Testnet
  {
    symbol: "WXTZ",
    name: "Wrapped Tez",
    address: "0x1234567890123456789012345678901234567897", // Mock address for testnet
    decimals: 18,
    coingeckoId: "wxtz",
    logoURI: "/logos/tezos.png",
    chainId: 128123,
    chain: CHAINS[128123],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x1234567890123456789012345678901234567898", // Mock address for testnet
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "/logos/usdt.png",
    chainId: 128123,
    chain: CHAINS[128123],
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x1234567890123456789012345678901234567899", // Mock address for testnet
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "/logos/dai.png",
    chainId: 128123,
    chain: CHAINS[128123],
  },

  // Sei Testnet
  {
    symbol: "WSEI",
    name: "Wrapped Sei",
    address: "0x123456789012345678901234567890123456789A", // Mock address for testnet
    decimals: 18,
    coingeckoId: "wsei",
    logoURI: "/logos/sei.png",
    chainId: 713715,
    chain: CHAINS[713715],
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x123456789012345678901234567890123456789B", // Mock address for testnet
    decimals: 6,
    coingeckoId: "tether",
    logoURI: "/logos/usdt.png",
    chainId: 713715,
    chain: CHAINS[713715],
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x123456789012345678901234567890123456789C", // Mock address for testnet
    decimals: 18,
    coingeckoId: "dai",
    logoURI: "/logos/dai.png",
    chainId: 713715,
    chain: CHAINS[713715],
  },
];

export const TOKENS_BY_SYMBOL: Record<string, Token[]> = POPULAR_TOKENS.reduce((acc, token) => {
  if (!acc[token.symbol]) {
    acc[token.symbol] = [];
  }
  acc[token.symbol].push(token);
  return acc;
}, {} as Record<string, Token[]>);