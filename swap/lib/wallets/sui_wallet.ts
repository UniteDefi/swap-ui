// Sui wallet types
interface SuiWalletAccount {
  address: string;
  publicKey?: string;
}

interface SuiWallet {
  hasPermissions: (permissions: string[]) => Promise<boolean>;
  requestPermissions: (permissions: string[]) => Promise<boolean>;
  getAccounts: () => Promise<SuiWalletAccount[]>;
  signAndExecuteTransactionBlock: (input: SuiTransactionInput) => Promise<SuiTransactionResult>;
  connect?: () => Promise<{ account: SuiWalletAccount }>;
}

interface SuiTransactionInput {
  transactionBlock: unknown;
  account: SuiWalletAccount;
}

interface SuiTransactionResult {
  digest: string;
  effects: {
    status: {
      status: string;
    };
    gasUsed: {
      computationCost: string;
      storageCost: string;
    };
  };
}

interface SuiBalanceResponse {
  result: {
    totalBalance: string;
    coinType: string;
  };
}

interface WindowWithSui extends Window {
  sui?: SuiWallet;
  suiet?: SuiWallet;
  suiWallet?: SuiWallet;
  ethosWallet?: SuiWallet;
  martian?: {
    sui?: SuiWallet & {
      connect: () => Promise<{ address: string; publicKey?: string }>;
    };
  };
}

export interface SuiWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: unknown) => Promise<SuiTransactionResult>;
}

export class SuiWalletManager implements SuiWalletInterface {
  private wallet: SuiWallet | null = null;
  private account: SuiWalletAccount | null = null;
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[SuiWallet] Connecting to Sui wallet...");
    
    try {
      // Check for modern Sui Wallet (window.sui)
      if (typeof window !== "undefined" && (window as WindowWithSui).sui) {
        const suiWallet = (window as WindowWithSui).sui;
        
        if (suiWallet) {
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
      }
      
      // Check for Suiet Wallet
      if (typeof window !== "undefined" && (window as WindowWithSui).suiet) {
        const suietWallet = (window as WindowWithSui).suiet;
        
        if (suietWallet) {
          // Connect to Suiet
          const connection = await suietWallet.connect?.();
          
          if (!connection || !connection.account) {
            throw new Error("Failed to connect to Suiet wallet");
          }
          
          this.wallet = suietWallet;
          this.account = connection.account;
          
          return {
            address: connection.account.address,
            publicKey: connection.account.publicKey || "",
          };
        }
      }
      
      // Check for legacy Sui Wallet (window.suiWallet)
      if (typeof window !== "undefined" && (window as WindowWithSui).suiWallet) {
        const suiWallet = (window as WindowWithSui).suiWallet;
        
        if (suiWallet) {
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
      }
      
      // Check for Ethos Wallet
      if (typeof window !== "undefined" && (window as WindowWithSui).ethosWallet) {
        const ethosWallet = (window as WindowWithSui).ethosWallet;
        
        if (ethosWallet) {
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
      }
      
      // Check for Martian Wallet (supports Sui)
      if (typeof window !== "undefined" && (window as WindowWithSui).martian?.sui) {
        const martianSui = (window as WindowWithSui).martian?.sui;
        
        if (martianSui) {
          // Connect to Martian
          const connection = await martianSui.connect();
          
          if (!connection || !('address' in connection) || !connection.address) {
            throw new Error("Failed to connect to Martian wallet");
          }
          
          this.wallet = martianSui;
          this.account = { 
            address: connection.address as string, 
            publicKey: ('publicKey' in connection ? connection.publicKey as string : undefined)
          };
          
          return {
            address: connection.address as string,
            publicKey: ('publicKey' in connection ? connection.publicKey as string : "") || "",
          };
        }
      }
      
      const { createWalletNotFoundError } = await import("@/lib/utils/wallet_errors");
      throw createWalletNotFoundError("Sui", ["sui", "suiet", "ethos", "martian"]);
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
      
      const data: SuiBalanceResponse = await response.json();
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

  async signTransaction(transaction: unknown): Promise<SuiTransactionResult> {
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
  
  private getAvailableWallets(): SuiWallet[] {
    const wallets: SuiWallet[] = [];
    const windowWithSui = window as WindowWithSui;
    
    // Check for Sui Wallet
    if (typeof window !== "undefined" && windowWithSui.suiWallet) {
      wallets.push(windowWithSui.suiWallet);
    }
    
    // Check for Ethos Wallet
    if (typeof window !== "undefined" && windowWithSui.ethosWallet) {
      wallets.push(windowWithSui.ethosWallet);
    }
    
    // Check for Martian Wallet (supports Sui)
    if (typeof window !== "undefined" && windowWithSui.martian?.sui) {
      wallets.push(windowWithSui.martian.sui);
    }
    
    // Check for Suiet Wallet
    if (typeof window !== "undefined" && windowWithSui.suiet) {
      wallets.push(windowWithSui.suiet);
    }
    
    return wallets;
  }
}

// Wallet detection utilities
export const detectSuiWallets = () => {
  const wallets = [];
  const windowWithSui = window as WindowWithSui;
  
  // Check for Sui Wallet
  if (typeof window !== "undefined" && windowWithSui.suiWallet) {
    wallets.push({
      name: "Sui Wallet",
      icon: "/logos/sui.png",
      adapter: "sui",
    });
  }
  
  // Check for Ethos Wallet
  if (typeof window !== "undefined" && windowWithSui.ethosWallet) {
    wallets.push({
      name: "Ethos",
      icon: "/logos/sui.png",
      adapter: "ethos",
    });
  }
  
  // Check for Martian Wallet (supports Sui)
  if (typeof window !== "undefined" && windowWithSui.martian?.sui) {
    wallets.push({
      name: "Martian",
      icon: "/logos/sui.png",
      adapter: "martian",
    });
  }
  
  // Check for Suiet Wallet
  if (typeof window !== "undefined" && windowWithSui.suiet) {
    wallets.push({
      name: "Suiet",
      icon: "/logos/sui.png",
      adapter: "suiet",
    });
  }
  
  return wallets;
};