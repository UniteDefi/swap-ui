interface CardanoWalletApi {
  enable: () => Promise<CardanoWalletApi>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  signTx: (transaction: string) => Promise<string>;
}

interface CardanoWalletProvider {
  enable: () => Promise<CardanoWalletApi>;
  name: string;
  icon: string;
}

interface WindowWithCardano extends Window {
  cardano?: {
    nami?: CardanoWalletProvider;
    eternl?: CardanoWalletProvider;
    flint?: CardanoWalletProvider;
    yoroi?: CardanoWalletProvider;
    typhoncip30?: CardanoWalletProvider;
  };
}

export interface CardanoWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: string) => Promise<string>;
}

export class CardanoWalletManager implements CardanoWalletInterface {
  private walletApi: CardanoWalletApi | null = null;
  private address: string | null = null;
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[CardanoWallet] Connecting to Cardano wallet...");
    
    try {
      // Check if Cardano wallets are available
      const availableWallets = this.getAvailableWallets();
      
      if (availableWallets.length === 0) {
        throw new Error("No Cardano wallet found. Please install Nami, Eternl, or another Cardano wallet.");
      }
      
      // Use the first available wallet
      const selectedWallet = availableWallets[0];
      
      // Enable the wallet
      this.walletApi = await selectedWallet.enable();
      
      // Get the wallet address
      const addresses = await this.walletApi.getUsedAddresses();
      if (!addresses || addresses.length === 0) {
        // Try to get unused addresses
        const unusedAddresses = await this.walletApi.getUnusedAddresses();
        if (!unusedAddresses || unusedAddresses.length === 0) {
          throw new Error("No addresses found in wallet");
        }
        this.address = unusedAddresses[0];
      } else {
        this.address = addresses[0];
      }
      
      return {
        address: this.address || "",
        publicKey: "", // Cardano doesn't expose public key directly
      };
    } catch (error) {
      console.error("[CardanoWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[CardanoWallet] Disconnecting from Cardano wallet...");
    this.walletApi = null;
    this.address = null;
  }

  isConnected(): boolean {
    return !!this.walletApi && !!this.address;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.walletApi || !this.address) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Get the balance
      const balance = await this.walletApi.getBalance();
      
      // Parse the balance (Cardano uses lovelace as base unit, 1 ADA = 1,000,000 lovelace)
      const balanceValue = parseInt(balance, 16) || 0;
      
      return {
        amount: balanceValue.toString(),
        decimals: 6, // ADA has 6 decimals (lovelace)
      };
    } catch (error) {
      console.error("[CardanoWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 6,
      };
    }
  }

  async signTransaction(transaction: string): Promise<string> {
    if (!this.walletApi) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[CardanoWallet] Signing transaction:", transaction);
    
    try {
      // Sign the transaction
      const witnessSet = await this.walletApi.signTx(transaction);
      return witnessSet;
    } catch (error) {
      console.error("[CardanoWallet] Transaction signing error:", error);
      throw error;
    }
  }
  
  private getAvailableWallets(): CardanoWalletProvider[] {
    const wallets: CardanoWalletProvider[] = [];
    
    if (typeof window === "undefined") return wallets;
    
    const cardanoWindow = window as WindowWithCardano;
    
    // Check for Nami wallet
    if (cardanoWindow.cardano?.nami) {
      wallets.push(cardanoWindow.cardano.nami);
    }
    
    // Check for Eternl wallet
    if (cardanoWindow.cardano?.eternl) {
      wallets.push(cardanoWindow.cardano.eternl);
    }
    
    // Check for Flint wallet
    if (cardanoWindow.cardano?.flint) {
      wallets.push(cardanoWindow.cardano.flint);
    }
    
    // Check for Yoroi wallet
    if (cardanoWindow.cardano?.yoroi) {
      wallets.push(cardanoWindow.cardano.yoroi);
    }
    
    // Check for Typhon wallet
    if (cardanoWindow.cardano?.typhoncip30) {
      wallets.push(cardanoWindow.cardano.typhoncip30);
    }
    
    return wallets;
  }
}

// Wallet detection utilities
export const detectCardanoWallets = (): Array<{name: string; icon: string; adapter: string}> => {
  const wallets: Array<{name: string; icon: string; adapter: string}> = [];
  
  if (typeof window === "undefined") return wallets;
  
  const cardanoWindow = window as WindowWithCardano;
  
  // Check for Nami wallet
  if (cardanoWindow.cardano?.nami) {
    wallets.push({
      name: "Nami",
      icon: "/logos/cardano.png",
      adapter: "nami",
    });
  }
  
  // Check for Eternl wallet
  if (cardanoWindow.cardano?.eternl) {
    wallets.push({
      name: "Eternl",
      icon: "/logos/cardano.png",
      adapter: "eternl",
    });
  }
  
  // Check for Flint wallet
  if (cardanoWindow.cardano?.flint) {
    wallets.push({
      name: "Flint",
      icon: "/logos/cardano.png",
      adapter: "flint",
    });
  }
  
  // Check for Yoroi wallet
  if (cardanoWindow.cardano?.yoroi) {
    wallets.push({
      name: "Yoroi",
      icon: "/logos/cardano.png",
      adapter: "yoroi",
    });
  }
  
  return wallets;
};