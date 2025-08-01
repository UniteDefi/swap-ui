// Chain configurations with explorer URLs
export const chainConfigs: Record<number, { name: string; explorer: string }> = {
  // Mainnet chains (for reference)
  1: { name: "Ethereum", explorer: "https://etherscan.io" },
  
  // Testnet chains
  11155111: { name: "Ethereum Sepolia", explorer: "https://sepolia.etherscan.io" },
  421614: { name: "Arbitrum Sepolia", explorer: "https://sepolia.arbiscan.io" },
  84532: { name: "Base Sepolia", explorer: "https://sepolia.basescan.org" },
  97: { name: "BNB Testnet", explorer: "https://testnet.bscscan.com" },
  80002: { name: "Polygon Amoy", explorer: "https://amoy.polygonscan.com" },
  41454: { name: "Monad Testnet", explorer: "https://explorer.testnet.monad.xyz" },
  128123: { name: "Etherlink Testnet", explorer: "https://testnet-explorer.etherlink.com" },
  713715: { name: "Sei Testnet", explorer: "https://seitrace.com/?chain=arctic-1" },
};

// Get explorer URL for a chain
export function getExplorerUrl(chainId?: number): string {
  if (!chainId || !chainConfigs[chainId]) {
    return "https://etherscan.io"; // Default to Ethereum
  }
  return chainConfigs[chainId].explorer;
}

// Get explorer URL for address
export function getExplorerAddressUrl(chainId?: number, address?: string): string {
  if (!address) return "#";
  const explorerUrl = getExplorerUrl(chainId);
  return `${explorerUrl}/address/${address}`;
}

// Get explorer URL for transaction
export function getExplorerTxUrl(chainId?: number, txHash?: string): string {
  if (!txHash) return "#";
  const explorerUrl = getExplorerUrl(chainId);
  return `${explorerUrl}/tx/${txHash}`;
}

// Format address for display (0x1234...5678)
export function formatAddress(address?: string): string {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format transaction hash for display (0x1234...5678)
export function formatTxHash(txHash?: string): string {
  if (!txHash) return "";
  if (txHash.length <= 10) return txHash;
  return `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;
}