import {
  arbitrumSepolia,
  baseSepolia,
  polygonAmoy,
  sepolia,
} from "viem/chains";

export const supportedChains = [
  sepolia,
  polygonAmoy,
  baseSepolia,
  arbitrumSepolia,
] as const;

export const chainConfigs = {
  [sepolia.id]: {
    name: "Ethereum Sepolia",

    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.etherscan.io",
  },
  [polygonAmoy.id]: {
    name: "Polygon Amoy",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorer: "https://amoy.polygonscan.com",
  },
  [baseSepolia.id]: {
    name: "Base Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.basescan.org",
  },
  [arbitrumSepolia.id]: {
    name: "Arbitrum Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.arbiscan.io",
  },
};
