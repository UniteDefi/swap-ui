// Aptos wallet types for direct window object interaction
interface AptosAccount {
  address: string;
  publicKey?: string;
}

interface AptosTransaction {
  type: string;
  function: string;
  type_arguments: string[];
  arguments: unknown[];
}

interface AptosTransactionResponse {
  hash: string;
  sender: string;
  sequence_number: string;
  max_gas_amount: string;
  gas_unit_price: string;
  gas_used: string;
  success: boolean;
}

interface PetraWallet {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  account: () => Promise<AptosAccount>;
  getAccount: () => Promise<AptosAccount>;
  signAndSubmitTransaction: (transaction: AptosTransaction) => Promise<AptosTransactionResponse>;
}

interface MartianWallet {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  account: () => Promise<AptosAccount>;
  getAccount: () => Promise<AptosAccount>;
  signAndSubmitTransaction: (transaction: AptosTransaction) => Promise<AptosTransactionResponse>;
}

interface WindowWithAptos extends Window {
  aptos?: PetraWallet;
  martian?: MartianWallet;
}

export interface AptosWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: AptosTransaction) => Promise<AptosTransactionResponse>;
  wallet: PetraWallet | MartianWallet | null;
}

export class AptosWalletManager implements AptosWalletInterface {
  wallet: PetraWallet | MartianWallet | null = null;
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[AptosWallet] Connecting to Aptos wallet...");
    
    try {
      // Try Petra wallet first if available
      if (typeof window !== "undefined" && (window as WindowWithAptos).aptos) {
        const petra = (window as WindowWithAptos).aptos;
        
        if (petra) {
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
      }
      
      // Try Martian wallet
      if (typeof window !== "undefined" && (window as WindowWithAptos).martian) {
        const martian = (window as WindowWithAptos).martian;
        
        if (martian) {
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
      
      if ('account' in this.wallet && this.wallet.account) {
        const account = await this.wallet.account();
        address = account.address;
      } else if ('getAccount' in this.wallet && this.wallet.getAccount) {
        // For Petra wallet, use getAccount
        const account = await this.wallet.getAccount();
        address = account.address;
      } else {
        throw new Error("Unable to get account from wallet");
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

  async signTransaction(transaction: AptosTransaction): Promise<AptosTransactionResponse> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[AptosWallet] Signing transaction:", transaction);
    
    try {
      const pendingTransaction = await this.wallet.signAndSubmitTransaction(transaction);
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
  if (typeof window !== "undefined" && (window as WindowWithAptos).aptos) {
    wallets.push({
      name: "Petra",
      icon: "/logos/aptos.png",
      adapter: "petra",
    });
  }
  
  // Check for Martian wallet
  if (typeof window !== "undefined" && (window as WindowWithAptos).martian) {
    wallets.push({
      name: "Martian",
      icon: "/logos/aptos.png",
      adapter: "martian",
    });
  }
  
  return wallets;
};