import {
  arbitrumSepolia,
  baseSepolia,
  polygonAmoy,
  sepolia,
  bscTestnet,
  optimismSepolia,
  scrollSepolia,
  celoAlfajores,
} from "viem/chains";
import { defineChain } from "viem";
import { hasDeployments } from "@/lib/utils/deployment_filter";

// Define custom chains
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/monad_testnet"],
    },
    public: {
      http: ["https://rpc.ankr.com/monad_testnet"],
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
      http: ["https://sei-testnet.g.alchemy.com/v2/9MExjLYju7RbwL5KDizzG"],
    },
    public: {
      http: ["https://sei-testnet.g.alchemy.com/v2/9MExjLYju7RbwL5KDizzG"],
    },
  },
  blockExplorers: {
    default: { name: "Seitrace", url: "https://seitrace.com/?chain=arctic-1" },
  },
  testnet: true,
});

export const injectiveTestnet = defineChain({
  id: 11111,
  name: "Injective Testnet",
  network: "injective-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Injective",
    symbol: "INJ",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.sentry.chain.json-rpc.injective.network"],
    },
    public: {
      http: ["https://testnet.sentry.chain.json-rpc.injective.network"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.explorer.injective.network" },
  },
  testnet: true,
});

export const auroraTestnet = defineChain({
  id: 1313161555,
  name: "Aurora Testnet",
  network: "aurora-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.aurora.dev"],
    },
    public: {
      http: ["https://testnet.aurora.dev"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.aurorascan.dev" },
  },
  testnet: true,
});

export const flowTestnet = defineChain({
  id: 545,
  name: "Flow Testnet",
  network: "flow-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "FLOW",
    symbol: "FLOW",
  },
  rpcUrls: {
    default: {
      http: ["https://flow-testnet.g.alchemy.com/v2/9MExjLYju7RbwL5KDizzG"],
    },
    public: {
      http: ["https://flow-testnet.g.alchemy.com/v2/9MExjLYju7RbwL5KDizzG"],
    },
  },
  blockExplorers: {
    default: { name: "Flowscan", url: "https://testnet.flowscan.io" },
  },
  testnet: true,
});

export const unichainSepolia = defineChain({
  id: 1301,
  name: "Unichain Sepolia",
  network: "unichain-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://unichain-sepolia.g.alchemy.com/v2/9MExjLYju7RbwL5KDizzG"],
    },
    public: {
      http: ["https://unichain-sepolia.g.alchemy.com/v2/9MExjLYju7RbwL5KDizzG"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://sepolia.uniscan.xyz" },
  },
  testnet: true,
});

// All available EVM chains
const allEvmChains = [
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  polygonAmoy,
  scrollSepolia,
  celoAlfajores,
  unichainSepolia,
  flowTestnet,
  seiTestnet,
  bscTestnet,
  auroraTestnet,
  injectiveTestnet,
  etherlinkTestnet,
  monadTestnet,
] as const;

// Filter chains by deployments
const getDeployedChains = () => {
  const deployed = allEvmChains.filter(chain => hasDeployments(chain.id));
  
  // Always ensure at least one chain is available for development
  if (deployed.length === 0) {
    console.warn("[Chains] No deployments found, falling back to Sepolia for development");
    return [sepolia];
  }
  
  return deployed;
};

export const supportedChains = getDeployedChains();

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
  [optimismSepolia.id]: {
    name: "Optimism Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia-optimism.etherscan.io",
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
  [scrollSepolia.id]: {
    name: "Scroll Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.scrollscan.com",
  },
  [celoAlfajores.id]: {
    name: "Celo Alfajores",
    nativeCurrency: {
      name: "CELO",
      symbol: "CELO",
      decimals: 18,
    },
    blockExplorer: "https://alfajores.celoscan.io",
  },
  [unichainSepolia.id]: {
    name: "Unichain Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.uniscan.xyz",
  },
  [flowTestnet.id]: {
    name: "Flow Testnet",
    nativeCurrency: {
      name: "FLOW",
      symbol: "FLOW",
      decimals: 18,
    },
    blockExplorer: "https://testnet.flowscan.io",
  },
  [seiTestnet.id]: {
    name: "Sei Testnet",
    nativeCurrency: {
      name: "SEI",
      symbol: "SEI",
      decimals: 18,
    },
    blockExplorer: "https://seitrace.com/?chain=arctic-1",
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
  [auroraTestnet.id]: {
    name: "Aurora Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://testnet.aurorascan.dev",
  },
  [injectiveTestnet.id]: {
    name: "Injective Testnet",
    nativeCurrency: {
      name: "INJ",
      symbol: "INJ",
      decimals: 18,
    },
    blockExplorer: "https://testnet.explorer.injective.network",
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
  [monadTestnet.id]: {
    name: "Monad Testnet",
    nativeCurrency: {
      name: "Monad",
      symbol: "MON",
      decimals: 18,
    },
    blockExplorer: "https://explorer.testnet.monad.xyz",
  },
};
