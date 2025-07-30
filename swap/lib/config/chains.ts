import {
  arbitrumSepolia,
  baseSepolia,
  polygonAmoy,
  sepolia,
  bscTestnet,
} from "viem/chains";
import { defineChain } from "viem";

// Define custom chains
export const monadTestnet = defineChain({
  id: 41454,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.monad.xyz"],
    },
    public: {
      http: ["https://testnet.monad.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.testnet.monad.xyz" },
  },
  testnet: true,
});

export const etherlinkTestnet = defineChain({
  id: 128123,
  name: "Etherlink Testnet",
  network: "etherlink-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Tez",
    symbol: "XTZ",
  },
  rpcUrls: {
    default: {
      http: ["https://node.ghostnet.etherlink.com"],
    },
    public: {
      http: ["https://node.ghostnet.etherlink.com"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet-explorer.etherlink.com" },
  },
  testnet: true,
});

export const seiTestnet = defineChain({
  id: 713715,
  name: "Sei Testnet",
  network: "sei-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Sei",
    symbol: "SEI",
  },
  rpcUrls: {
    default: {
      http: ["https://evm-rpc-arctic-1.sei-apis.com"],
    },
    public: {
      http: ["https://evm-rpc-arctic-1.sei-apis.com"],
    },
  },
  blockExplorers: {
    default: { name: "Seitrace", url: "https://seitrace.com/?chain=arctic-1" },
  },
  testnet: true,
});

export const supportedChains = [
  polygonAmoy,
  arbitrumSepolia,
  baseSepolia,
  bscTestnet,
  sepolia,
  monadTestnet,
  etherlinkTestnet,
  seiTestnet,
] as const;

export const chainConfigs = {
  [polygonAmoy.id]: {
    name: "Polygon Amoy",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorer: "https://amoy.polygonscan.com",
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
  [baseSepolia.id]: {
    name: "Base Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.basescan.org",
  },
  [bscTestnet.id]: {
    name: "BNB Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorer: "https://testnet.bscscan.com",
  },
  [sepolia.id]: {
    name: "Ethereum Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.etherscan.io",
  },
  [monadTestnet.id]: {
    name: "Monad Testnet",
    nativeCurrency: {
      name: "Monad",
      symbol: "MON",
      decimals: 18,
    },
    blockExplorer: "https://explorer.testnet.monad.xyz",
  },
  [etherlinkTestnet.id]: {
    name: "Etherlink Testnet",
    nativeCurrency: {
      name: "Tez",
      symbol: "XTZ",
      decimals: 18,
    },
    blockExplorer: "https://testnet-explorer.etherlink.com",
  },
  [seiTestnet.id]: {
    name: "Sei Testnet",
    nativeCurrency: {
      name: "Sei",
      symbol: "SEI",
      decimals: 18,
    },
    blockExplorer: "https://seitrace.com/?chain=arctic-1",
  },
};
