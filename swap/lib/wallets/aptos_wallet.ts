// Aptos wallet types for direct window object interaction
interface AptosAccount {
  address: string;
  publicKey?: string;
}

interface PetraWallet {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  account: () => Promise<AptosAccount>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;
}

interface MartianWallet {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  account: () => Promise<AptosAccount>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;
}

export interface AptosWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: any) => Promise<any>;
  wallet: PetraWallet | MartianWallet | null;
}

export class AptosWalletManager implements AptosWalletInterface {
  wallet: PetraWallet | MartianWallet | null = null;
  
  async connect(walletName?: string): Promise<{ address: string; publicKey: string }> {
    console.log("[AptosWallet] Connecting to Aptos wallet...");
    
    try {
      // Try Petra wallet first if available
      if (typeof window !== "undefined" && (window as any).aptos) {
        const petra = (window as any).aptos;
        
        // Connect to Petra
        const response = await petra.connect();
        
        if (response) {
          this.wallet = petra;
          return {
            address: response.address,
            publicKey: response.publicKey,
          };
        }
      }
      
      // Try Martian wallet
      if (typeof window !== "undefined" && (window as any).martian) {
        const martian = (window as any).martian;
        
        // Connect to Martian
        const response = await martian.connect();
        
        if (response) {
          this.wallet = martian;
          return {
            address: response.address,
            publicKey: response.publicKey,
          };
        }
      }
      
      throw new Error("No Aptos wallet found. Please install Petra or Martian wallet.");
    } catch (error) {
      console.error("[AptosWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[AptosWallet] Disconnecting from Aptos wallet...");
    if (this.wallet) {
      await this.wallet.disconnect();
      this.wallet = null;
    }
  }

  isConnected(): boolean {
    return !!this.wallet;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Get account from wallet
      let address: string;
      
      if ((this.wallet as any).account) {
        const account = await (this.wallet as any).account();
        address = account.address;
      } else {
        // For Petra wallet, use getAccount
        const account = await (this.wallet as any).getAccount();
        address = account.address;
      }
      
      // Fetch balance from Aptos testnet
      const response = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      
      const data = await response.json();
      const balance = data.data?.coin?.value || "0";
      
      return {
        amount: balance,
        decimals: 8, // APT has 8 decimals
      };
    } catch (error) {
      console.error("[AptosWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 8,
      };
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[AptosWallet] Signing transaction:", transaction);
    
    try {
      const pendingTransaction = await (this.wallet as any).signAndSubmitTransaction(transaction);
      return pendingTransaction;
    } catch (error) {
      console.error("[AptosWallet] Transaction signing error:", error);
      throw error;
    }
  }
}

// Wallet detection utilities
export const detectAptosWallets = () => {
  const wallets = [];
  
  // Check for Petra wallet
  if (typeof window !== "undefined" && (window as any).aptos) {
    wallets.push({
      name: "Petra",
      icon: "/logos/aptos.png",
      adapter: "petra",
    });
  }
  
  // Check for Martian wallet
  if (typeof window !== "undefined" && (window as any).martian) {
    wallets.push({
      name: "Martian",
      icon: "/logos/aptos.png",
      adapter: "martian",
    });
  }
  
  return wallets;
};