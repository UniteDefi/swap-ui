export interface Chain {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  derivationPath: string;
  addressFormat: "ethereum" | "bitcoin" | "solana" | "custom";
  rpcUrl?: string;
}

export interface WalletAccount {
  chainId: string;
  address: string;
  publicKey: string;
  derivationPath: string;
}

export interface EncryptedWallet {
  id: string;
  name: string;
  encryptedMnemonic: string;
  accounts: WalletAccount[];
  createdAt: number;
}

export interface WalletState {
  isInitialized: boolean;
  isUnlocked: boolean;
  currentWallet: EncryptedWallet | null;
  wallets: EncryptedWallet[];
}

export const SUPPORTED_CHAINS: Chain[] = [
  // EVM Chains (same derivation path)
  { id: "ethereum", name: "Ethereum", symbol: "ETH", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "base", name: "Base", symbol: "ETH", logo: "/logos/base.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ETH", logo: "/logos/arbitrum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", logo: "/logos/polygon.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "bnb", name: "BNB Smart Chain", symbol: "BNB", logo: "/logos/bnb.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "optimism", name: "Optimism", symbol: "ETH", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "zircuit", name: "Zircuit", symbol: "ETH", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "scroll", name: "Scroll", symbol: "ETH", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "celo", name: "Celo", symbol: "CELO", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "zora", name: "Zora", symbol: "ETH", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "gnosis", name: "Gnosis", symbol: "xDAI", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "worldchain", name: "Worldchain", symbol: "ETH", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "apechain", name: "ApeChain", symbol: "APE", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "flow-evm", name: "Flow EVM", symbol: "FLOW", logo: "/logos/ethereum.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "etherlink", name: "Etherlink", symbol: "XTZ", logo: "/logos/etherlink.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },

  // Non-EVM Chains (different derivation paths)
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", logo: "/logos/bitcoin.png", derivationPath: "m/44'/0'/0'/0/0", addressFormat: "bitcoin" },
  { id: "aptos", name: "Aptos", symbol: "APT", logo: "/logos/aptos.png", derivationPath: "m/44'/637'/0'/0'/0'", addressFormat: "custom" },
  { id: "solana", name: "Solana", symbol: "SOL", logo: "/logos/ethereum.png", derivationPath: "m/44'/501'/0'/0'", addressFormat: "solana" },
  { id: "sui", name: "Sui", symbol: "SUI", logo: "/logos/sui.png", derivationPath: "m/44'/784'/0'/0'/0'", addressFormat: "custom" },
  { id: "near", name: "NEAR", symbol: "NEAR", logo: "/logos/near.png", derivationPath: "m/44'/397'/0'", addressFormat: "custom" },
  { id: "injective", name: "Injective", symbol: "INJ", logo: "/logos/injective.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "custom" },
  { id: "osmosis", name: "Osmosis", symbol: "OSMO", logo: "/logos/osmosis.png", derivationPath: "m/44'/118'/0'/0/0", addressFormat: "custom" },
  { id: "sei", name: "Sei", symbol: "SEI", logo: "/logos/sei.png", derivationPath: "m/44'/118'/0'/0/0", addressFormat: "custom" },
  { id: "tron", name: "Tron", symbol: "TRX", logo: "/logos/tron.png", derivationPath: "m/44'/195'/0'/0/0", addressFormat: "custom" },
  { id: "stellar", name: "Stellar", symbol: "XLM", logo: "/logos/stellar.png", derivationPath: "m/44'/148'/0'", addressFormat: "custom" },
  { id: "ton", name: "TON", symbol: "TON", logo: "/logos/ton.png", derivationPath: "m/44'/607'/0'/0/0", addressFormat: "custom" },
  { id: "monad", name: "Monad", symbol: "MON", logo: "/logos/monad.png", derivationPath: "m/44'/60'/0'/0/0", addressFormat: "ethereum" },
  { id: "cardano", name: "Cardano", symbol: "ADA", logo: "/logos/cardano.png", derivationPath: "m/44'/1815'/0'/0/0", addressFormat: "custom" },
  { id: "xrp", name: "XRP Ledger", symbol: "XRP", logo: "/logos/xrp.png", derivationPath: "m/44'/144'/0'/0/0", addressFormat: "custom" },
  { id: "icp", name: "Internet Computer", symbol: "ICP", logo: "/logos/icp.png", derivationPath: "m/44'/223'/0'/0/0", addressFormat: "custom" },
  { id: "tezos", name: "Tezos", symbol: "XTZ", logo: "/logos/tezos.png", derivationPath: "m/44'/1729'/0'/0'", addressFormat: "custom" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", logo: "/logos/polkadot.png", derivationPath: "m/44'/354'/0'/0'/0'", addressFormat: "custom" },
  { id: "eos", name: "EOS", symbol: "EOS", logo: "/logos/eos.png", derivationPath: "m/44'/194'/0'/0/0", addressFormat: "custom" },
];