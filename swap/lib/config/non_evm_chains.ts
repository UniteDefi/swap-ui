import { hasDeployments } from "@/lib/utils/deployment_filter";

export interface NonEvmChain {
  id: string;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string;
  walletType: string;
  testnet: boolean;
}

// All available non-EVM chains
const allNonEvmChains: NonEvmChain[] = [
  {
    id: "aptos-testnet",
    name: "Aptos Testnet",
    network: "aptos-testnet",
    nativeCurrency: {
      name: "Aptos",
      symbol: "APT",
      decimals: 8,
    },
    blockExplorer: "https://explorer.aptoslabs.com/?network=testnet",
    walletType: "aptos",
    testnet: true,
  },
  {
    id: "sui-testnet",
    name: "Sui Testnet",
    network: "sui-testnet",
    nativeCurrency: {
      name: "Sui",
      symbol: "SUI",
      decimals: 9,
    },
    blockExplorer: "https://suiscan.xyz/testnet",
    walletType: "sui",
    testnet: true,
  },
  {
    id: "stellar-testnet",
    name: "Stellar Testnet",
    network: "stellar-testnet",
    nativeCurrency: {
      name: "Lumens",
      symbol: "XLM",
      decimals: 7,
    },
    blockExplorer: "https://testnet.stellarchain.io",
    walletType: "stellar",
    testnet: true,
  },
  {
    id: "osmosis-testnet",
    name: "Osmosis Testnet",
    network: "osmosis-testnet",
    nativeCurrency: {
      name: "Osmosis",
      symbol: "OSMO",
      decimals: 6,
    },
    blockExplorer: "https://testnet.mintscan.io/osmosis-testnet",
    walletType: "cosmos",
    testnet: true,
  },
  {
    id: "xrpl-testnet",
    name: "XRPL Testnet",
    network: "xrpl-testnet",
    nativeCurrency: {
      name: "XRP",
      symbol: "XRP",
      decimals: 6,
    },
    blockExplorer: "https://testnet.xrpl.org",
    walletType: "xrpl",
    testnet: true,
  },
  {
    id: "starknet-testnet",
    name: "Starknet Testnet",
    network: "starknet-testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://testnet.starkscan.co",
    walletType: "starknet",
    testnet: true,
  },
  {
    id: "icp",
    name: "ICP",
    network: "icp",
    nativeCurrency: {
      name: "ICP",
      symbol: "ICP",
      decimals: 8,
    },
    blockExplorer: "https://dashboard.internetcomputer.org",
    walletType: "icp",
    testnet: true,
  },
];

// Only export chains that have deployments
export const nonEvmChains: NonEvmChain[] = allNonEvmChains.filter(chain => 
  hasDeployments(chain.id)
);

// Filter wallet types to only include those with deployed chains
export const nonEvmWalletTypes = [
  { id: "aptos", name: "Aptos Wallets", chains: ["aptos-testnet"] },
  { id: "sui", name: "Sui Wallets", chains: ["sui-testnet"] },
  { id: "stellar", name: "Stellar Wallets", chains: ["stellar-testnet"] },
  { id: "cosmos", name: "Cosmos Wallets", chains: ["osmosis-testnet"] },
  { id: "xrpl", name: "XRPL Wallets", chains: ["xrpl-testnet"] },
  { id: "starknet", name: "Starknet Wallets", chains: ["starknet-testnet"] },
  { id: "icp", name: "ICP Wallets", chains: ["icp"] },
].filter(walletType => 
  walletType.chains.some(chainId => hasDeployments(chainId))
);