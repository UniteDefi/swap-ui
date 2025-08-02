import * as freighter from "@stellar/freighter-api";
import { Horizon, Networks } from "@stellar/stellar-sdk";

export interface StellarWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: any) => Promise<any>;
}

export class StellarWalletManager implements StellarWalletInterface {
  private publicKey: string | null = null;
  private server: Horizon.Server;
  
  constructor() {
    // Initialize Stellar server for testnet
    this.server = new Horizon.Server("https://horizon-testnet.stellar.org");
  }
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[StellarWallet] Connecting to Stellar wallet...");
    
    try {
      // Check if Freighter is available
      const freighterConnected = await freighter.isConnected();
      
      if (!freighterConnected) {
        // Request access to Freighter
        await freighter.requestAccess();
      }
      
      // Get the public key
      const publicKey = await (freighter as any).getPublicKey();
      
      if (!publicKey) {
        throw new Error("Failed to get public key from wallet");
      }
      
      this.publicKey = publicKey;
      
      return {
        address: publicKey, // In Stellar, the public key is the address
        publicKey: publicKey,
      };
    } catch (error) {
      console.error("[StellarWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[StellarWallet] Disconnecting from Stellar wallet...");
    this.publicKey = null;
  }

  isConnected(): boolean {
    return !!this.publicKey;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.publicKey) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Load account from Stellar network
      const account = await this.server.loadAccount(this.publicKey);
      
      // Find XLM balance
      const xlmBalance = account.balances.find(
        (balance: any) => balance.asset_type === "native"
      );
      
      const amount = xlmBalance ? xlmBalance.balance : "0";
      
      return {
        amount: amount,
        decimals: 7, // XLM has 7 decimals
      };
    } catch (error) {
      console.error("[StellarWallet] Error fetching balance:", error);
      // If account doesn't exist, return 0 balance
      return {
        amount: "0",
        decimals: 7,
      };
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this.publicKey) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[StellarWallet] Signing transaction:", transaction);
    
    try {
      // Sign the transaction using Freighter
      const signedTransaction = await freighter.signTransaction(
        transaction.toXDR(), // Convert transaction to XDR format
        {
          networkPassphrase: Networks.TESTNET,
          address: this.publicKey,
        }
      );
      
      return signedTransaction;
    } catch (error) {
      console.error("[StellarWallet] Transaction signing error:", error);
      throw error;
    }
  }
}

// Wallet detection utilities
export const detectStellarWallets = () => {
  const wallets = [];
  
  // Check for Freighter wallet
  if (typeof window !== "undefined") {
    // Freighter injects itself into the window
    // We can check for it by trying to import the API
    try {
      wallets.push({
        name: "Freighter",
        icon: "/logos/stellar.png",
        adapter: "freighter",
      });
    } catch (error) {
      // Freighter not available
    }
  }
  
  // Check for Albedo wallet (web-based)
  if (typeof window !== "undefined" && (window as any).albedo) {
    wallets.push({
      name: "Albedo",
      icon: "/logos/stellar.png",
      adapter: "albedo",
    });
  }
  
  return wallets;
};