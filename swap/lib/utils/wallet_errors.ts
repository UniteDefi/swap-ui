export interface WalletInstallInfo {
  name: string;
  downloadUrl: string;
  description: string;
}

export const WALLET_INSTALL_URLS: Record<string, WalletInstallInfo> = {
  sui: {
    name: "Sui Wallet",
    downloadUrl: "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
    description: "Official Sui wallet for Chrome"
  },
  suiet: {
    name: "Suiet Wallet",
    downloadUrl: "https://suiet.app/",
    description: "Multi-chain wallet supporting Sui"
  },
  ethos: {
    name: "Ethos Wallet",
    downloadUrl: "https://ethoswallet.xyz/",
    description: "Sui wallet with advanced features"
  },
  argentX: {
    name: "Argent X",
    downloadUrl: "https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb",
    description: "Official Starknet wallet"
  },
  braavos: {
    name: "Braavos Wallet",
    downloadUrl: "https://chrome.google.com/webstore/detail/braavos-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma",
    description: "Advanced Starknet wallet"
  },
  keplr: {
    name: "Keplr Wallet",
    downloadUrl: "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap",
    description: "Cosmos ecosystem wallet"
  },
  freighter: {
    name: "Freighter Wallet",
    downloadUrl: "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk",
    description: "Official Stellar wallet"
  },
  martian: {
    name: "Martian Wallet",
    downloadUrl: "https://chrome.google.com/webstore/detail/martian-aptos-wallet/efbglgofoippbgcjepnhiblaibcnclgk",
    description: "Multi-chain wallet supporting multiple networks"
  },
  plug: {
    name: "Plug Wallet",
    downloadUrl: "https://plugwallet.ooo/",
    description: "ICP wallet for Internet Computer"
  }
};

export class WalletConnectionError extends Error {
  constructor(
    message: string,
    public readonly walletType: string,
    public readonly installInfo?: WalletInstallInfo[]
  ) {
    super(message);
    this.name = "WalletConnectionError";
  }
}

export function createWalletNotFoundError(walletType: string, supportedWallets: string[]): WalletConnectionError {
  const installInfo = supportedWallets.map(wallet => WALLET_INSTALL_URLS[wallet]).filter(Boolean);
  
  const message = `No ${walletType} wallet found. Please install one of these wallets:\n\n${installInfo.map(info => `• ${info.name} - ${info.description}`).join("\n")}\n\nThen refresh the page and try again.`;
  
  return new WalletConnectionError(message, walletType, installInfo);
}

export function formatWalletError(error: unknown): string {
  if (error instanceof WalletConnectionError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    // Handle common wallet error messages
    const message = error.message.toLowerCase();
    
    if (message.includes("user rejected") || message.includes("user denied")) {
      return "Connection was cancelled by the user.";
    }
    
    if (message.includes("not found") || message.includes("undefined")) {
      return "Wallet not found. Please make sure your wallet extension is installed and enabled.";
    }
    
    if (message.includes("locked")) {
      return "Wallet is locked. Please unlock your wallet and try again.";
    }
    
    if (message.includes("network") || message.includes("rpc")) {
      return "Network connection error. Please check your internet connection and try again.";
    }
    
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again.";
}