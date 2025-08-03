// Chain logo mappings for both EVM and non-EVM chains

export const chainLogos: Record<string | number, string> = {
  // EVM Chains
  11155111: "/logos/ethereum.png", // Sepolia
  84532: "/logos/base.png", // Base Sepolia
  421614: "/logos/arbitrum.png", // Arbitrum Sepolia
  11155420: "/logos/optimism.png", // Optimism Sepolia
  80002: "/logos/polygon.png", // Polygon Amoy
  534351: "/logos/scroll.png", // Scroll Sepolia
  44787: "/logos/celo.png", // Celo Alfajores
  1301: "/logos/unichain.jpg", // Unichain Sepolia
  545: "/logos/flow.jpg", // Flow Testnet
  713715: "/logos/sei.png", // Sei Testnet
  97: "/logos/bnb.png", // BNB Testnet
  1313161555: "/logos/aurora.jpg", // Aurora Testnet
  11111: "/logos/injective.png", // Injective Testnet
  128123: "/logos/etherlink.png", // Etherlink Testnet
  41454: "/logos/monad.png", // Monad Testnet
  
  // Non-EVM Chains
  "aptos-testnet": "/logos/aptos.png",
  "sui-testnet": "/logos/sui.png",
  "cardano-testnet": "/logos/cardano.png",
  "stellar-testnet": "/logos/stellar.png",
  "osmosis-testnet": "/logos/osmosis.png",
  "secret-testnet": "/logos/secret.png",
  "xrpl-testnet": "/logos/xrpl.png",
  "ton-testnet": "/logos/ton.png",
  "near-testnet": "/logos/near.png",
  "polkadot-testnet": "/logos/polkadot.png",
  "starknet-testnet": "/logos/starknet.png",
};

// Chain names for display
export const chainNames: Record<string | number, string> = {
  // EVM Chains
  11155111: "Ethereum Sepolia",
  84532: "Base Sepolia",
  421614: "Arbitrum Sepolia",
  11155420: "Optimism Sepolia",
  80002: "Polygon Amoy",
  534351: "Scroll Sepolia",
  44787: "Celo Alfajores",
  1301: "Unichain Sepolia",
  545: "Flow Testnet",
  713715: "Sei Testnet",
  97: "BNB Testnet",
  1313161555: "Aurora Testnet",
  11111: "Injective Testnet",
  128123: "Etherlink Testnet",
  41454: "Monad Testnet",
  
  // Non-EVM Chains
  "aptos-testnet": "Aptos Testnet",
  "sui-testnet": "Sui Testnet",
  "cardano-testnet": "Cardano Testnet",
  "stellar-testnet": "Stellar Testnet",
  "osmosis-testnet": "Osmosis Testnet",
  "secret-testnet": "Secret Network",
  "xrpl-testnet": "XRPL Testnet",
  "ton-testnet": "TON Testnet",
  "near-testnet": "NEAR Testnet",
  "polkadot-testnet": "Polkadot Testnet",
  "starknet-testnet": "Starknet Testnet",
};