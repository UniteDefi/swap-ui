import { setupWalletSelector } from "@near-wallet-selector/core";
import type { WalletSelector, Wallet } from "@near-wallet-selector/core";

// NearTransaction interface for future transaction handling
// interface NearTransaction {
//   receiverId: string;
//   actions: Array<{
//     type: "FunctionCall" | "Transfer" | "AddKey" | "DeleteKey" | "DeleteAccount" | "CreateAccount" | "DeployContract" | "Stake";
//     params: Record<string, unknown>;
//   }>;
// }

interface NearTransactionResult {
  transaction: {
    hash: string;
    nonce: number;
    public_key: string;
    receiver_id: string;
    signature: string;
    signer_id: string;
  };
  transaction_outcome: {
    id: string;
    outcome: {
      status: Record<string, unknown>;
      gas_burnt: number;
    };
  };
}

interface NearBalanceResponse {
  result: {
    amount: string;
    block_hash: string;
    block_height: number;
  };
}

export interface NearWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: unknown) => Promise<NearTransactionResult>;
}

export class NearWalletManager implements NearWalletInterface {
  private selector: WalletSelector | null = null;
  private wallet: Wallet | null = null;
  private accountId: string | null = null;
  
  async initializeSelector() {
    if (!this.selector) {
      this.selector = await setupWalletSelector({
        network: "testnet",
        modules: [
          // Basic setup without wallet-specific modules
          // In a full implementation, you would add specific wallet modules
        ],
      });
    }
    return this.selector;
  }
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[NearWallet] Connecting to NEAR wallet...");
    
    try {
      const selector = await this.initializeSelector();
      
      // Get available wallets
      const wallets = await selector.wallet();
      
      if (!wallets) {
        throw new Error("No NEAR wallet available");
      }
      
      // Sign in and get accounts
      await wallets.signIn({
        contractId: "unite-defi.testnet", // Your contract ID
        accounts: [], // Empty array for basic sign in
      });
      
      const accounts = await wallets.getAccounts();
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }
      
      this.wallet = wallets;
      this.accountId = accounts[0].accountId;
      
      return {
        address: this.accountId,
        publicKey: accounts[0].publicKey || "",
      };
    } catch (error) {
      console.error("[NearWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[NearWallet] Disconnecting from NEAR wallet...");
    
    try {
      if (this.wallet) {
        await this.wallet.signOut();
      }
      this.wallet = null;
      this.accountId = null;
    } catch (error) {
      console.error("[NearWallet] Disconnect error:", error);
    }
  }

  isConnected(): boolean {
    return !!this.wallet && !!this.accountId;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.accountId) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Fetch balance from NEAR testnet
      const response = await fetch(
        "https://rpc.testnet.near.org",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "query",
            params: {
              request_type: "view_account",
              finality: "final",
              account_id: this.accountId,
            },
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      
      const data: NearBalanceResponse = await response.json();
      const balance = data.result?.amount || "0";
      
      return {
        amount: balance,
        decimals: 24, // NEAR has 24 decimals
      };
    } catch (error) {
      console.error("[NearWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 24,
      };
    }
  }

  async signTransaction(transaction: unknown): Promise<NearTransactionResult> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[NearWallet] Signing transaction:", transaction);
    
    try {
      // Sign and send transaction
      const result = await this.wallet.signAndSendTransaction(transaction as Parameters<Wallet['signAndSendTransaction']>[0]);
      return result as NearTransactionResult;
    } catch (error) {
      console.error("[NearWallet] Transaction signing error:", error);
      throw error;
    }
  }
}

// Wallet detection utilities
export const detectNearWallets = () => {
  const wallets = [];
  
  // Check for NEAR Wallet
  if (typeof window !== "undefined") {
    // NEAR wallets are typically detected through the wallet selector
    // rather than window objects
    wallets.push({
      name: "NEAR Wallet",
      icon: "/logos/near.png",
      adapter: "near",
    });
    
    wallets.push({
      name: "Sender",
      icon: "/logos/near.png",
      adapter: "sender",
    });
    
    wallets.push({
      name: "Meteor",
      icon: "/logos/near.png",
      adapter: "meteor",
    });
  }
  
  return wallets;
};