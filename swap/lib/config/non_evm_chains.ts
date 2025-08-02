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

export const nonEvmChains: NonEvmChain[] = [
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
    id: "cardano-testnet",
    name: "Cardano Testnet",
    network: "cardano-testnet",
    nativeCurrency: {
      name: "ADA",
      symbol: "ADA",
      decimals: 6,
    },
    blockExplorer: "https://preview.cardanoscan.io",
    walletType: "cardano",
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
    id: "injective-testnet-cosmos",
    name: "Injective Testnet (Cosmos)",
    network: "injective-testnet-cosmos",
    nativeCurrency: {
      name: "Injective",
      symbol: "INJ",
      decimals: 18,
    },
    blockExplorer: "https://testnet.explorer.injective.network",
    walletType: "cosmos",
    testnet: true,
  },
  {
    id: "secret-testnet",
    name: "Secret Network Testnet",
    network: "secret-testnet",
    nativeCurrency: {
      name: "Secret",
      symbol: "SCRT",
      decimals: 6,
    },
    blockExplorer: "https://testnet.mintscan.io/secret-testnet",
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
    id: "ton-testnet",
    name: "TON Testnet",
    network: "ton-testnet",
    nativeCurrency: {
      name: "Toncoin",
      symbol: "TON",
      decimals: 9,
    },
    blockExplorer: "https://testnet.tonscan.org",
    walletType: "ton",
    testnet: true,
  },
  {
    id: "near-testnet",
    name: "NEAR Testnet",
    network: "near-testnet",
    nativeCurrency: {
      name: "NEAR",
      symbol: "NEAR",
      decimals: 24,
    },
    blockExplorer: "https://testnet.nearblocks.io",
    walletType: "near",
    testnet: true,
  },
  {
    id: "polkadot-testnet",
    name: "Polkadot Testnet (Westend)",
    network: "polkadot-testnet",
    nativeCurrency: {
      name: "DOT",
      symbol: "WND",
      decimals: 12,
    },
    blockExplorer: "https://westend.subscan.io",
    walletType: "polkadot",
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
];

export const nonEvmWalletTypes = [
  { id: "aptos", name: "Aptos Wallets", chains: ["aptos-testnet"] },
  { id: "sui", name: "Sui Wallets", chains: ["sui-testnet"] },
  { id: "cardano", name: "Cardano Wallets", chains: ["cardano-testnet"] },
  { id: "stellar", name: "Stellar Wallets", chains: ["stellar-testnet"] },
  { id: "cosmos", name: "Cosmos Wallets", chains: ["osmosis-testnet", "injective-testnet-cosmos", "secret-testnet"] },
  { id: "xrpl", name: "XRPL Wallets", chains: ["xrpl-testnet"] },
  { id: "ton", name: "TON Wallets", chains: ["ton-testnet"] },
  { id: "near", name: "NEAR Wallets", chains: ["near-testnet"] },
  { id: "polkadot", name: "Polkadot Wallets", chains: ["polkadot-testnet"] },
  { id: "starknet", name: "Starknet Wallets", chains: ["starknet-testnet"] },
];