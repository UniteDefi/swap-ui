// Sui wallet types
interface SuiWalletAccount {
  address: string;
  publicKey?: string;
}

interface SuiWallet {
  hasPermissions: (permissions: string[]) => Promise<boolean>;
  requestPermissions: (permissions: string[]) => Promise<boolean>;
  getAccounts: () => Promise<SuiWalletAccount[]>;
  signAndExecuteTransactionBlock: (input: any) => Promise<any>;
}

export interface SuiWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: any) => Promise<any>;
}

export class SuiWalletManager implements SuiWalletInterface {
  private wallet: SuiWallet | null = null;
  private account: SuiWalletAccount | null = null;
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[SuiWallet] Connecting to Sui wallet...");
    
    try {
      // Check for Sui Wallet
      if (typeof window !== "undefined" && (window as any).suiWallet) {
        const suiWallet = (window as any).suiWallet;
        
        // Request permissions
        const hasPermissions = await suiWallet.hasPermissions(['viewAccount']);
        
        if (!hasPermissions) {
          await suiWallet.requestPermissions(['viewAccount']);
        }
        
        // Get accounts
        const accounts = await suiWallet.getAccounts();
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found in Sui wallet");
        }
        
        this.wallet = suiWallet;
        this.account = accounts[0];
        
        return {
          address: accounts[0].address,
          publicKey: accounts[0].publicKey || "",
        };
      }
      
      // Check for Ethos Wallet
      if (typeof window !== "undefined" && (window as any).ethosWallet) {
        const ethosWallet = (window as any).ethosWallet;
        
        // Connect to Ethos
        const accounts = await ethosWallet.getAccounts();
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found in Ethos wallet");
        }
        
        this.wallet = ethosWallet;
        this.account = accounts[0];
        
        return {
          address: accounts[0].address,
          publicKey: accounts[0].publicKey || "",
        };
      }
      
      throw new Error("No Sui wallet found. Please install Sui Wallet or Ethos.");
    } catch (error) {
      console.error("[SuiWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[SuiWallet] Disconnecting from Sui wallet...");
    this.wallet = null;
    this.account = null;
  }

  isConnected(): boolean {
    return !!this.wallet && !!this.account;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.account) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Fetch balance from Sui testnet
      const response = await fetch(
        `https://fullnode.testnet.sui.io/sui_getBalance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "sui_getBalance",
            params: [
              this.account.address,
              "0x2::sui::SUI", // SUI coin type
            ],
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      
      const data = await response.json();
      const balance = data.result?.totalBalance || "0";
      
      return {
        amount: balance,
        decimals: 9, // SUI has 9 decimals
      };
    } catch (error) {
      console.error("[SuiWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 9,
      };
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this.wallet || !this.account) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[SuiWallet] Signing transaction:", transaction);
    
    try {
      // Sign and execute transaction
      const result = await this.wallet.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        account: this.account,
      });
      
      return result;
    } catch (error) {
      console.error("[SuiWallet] Transaction signing error:", error);
      throw error;
    }
  }
  
  private getAvailableWallets(): any[] {
    const wallets = [];
    
    // Check for Sui Wallet
    if (typeof window !== "undefined" && (window as any).suiWallet) {
      wallets.push((window as any).suiWallet);
    }
    
    // Check for Ethos Wallet
    if (typeof window !== "undefined" && (window as any).ethosWallet) {
      wallets.push((window as any).ethosWallet);
    }
    
    // Check for Martian Wallet (supports Sui)
    if (typeof window !== "undefined" && (window as any).martian?.sui) {
      wallets.push((window as any).martian.sui);
    }
    
    // Check for Suiet Wallet
    if (typeof window !== "undefined" && (window as any).suiet) {
      wallets.push((window as any).suiet);
    }
    
    return wallets;
  }
}

// Wallet detection utilities
export const detectSuiWallets = () => {
  const wallets = [];
  
  // Check for Sui Wallet
  if (typeof window !== "undefined" && (window as any).suiWallet) {
    wallets.push({
      name: "Sui Wallet",
      icon: "/logos/sui.png",
      adapter: "sui",
    });
  }
  
  // Check for Ethos Wallet
  if (typeof window !== "undefined" && (window as any).ethosWallet) {
    wallets.push({
      name: "Ethos",
      icon: "/logos/sui.png",
      adapter: "ethos",
    });
  }
  
  // Check for Martian Wallet (supports Sui)
  if (typeof window !== "undefined" && (window as any).martian?.sui) {
    wallets.push({
      name: "Martian",
      icon: "/logos/sui.png",
      adapter: "martian",
    });
  }
  
  // Check for Suiet Wallet
  if (typeof window !== "undefined" && (window as any).suiet) {
    wallets.push({
      name: "Suiet",
      icon: "/logos/sui.png",
      adapter: "suiet",
    });
  }
  
  return wallets;
};