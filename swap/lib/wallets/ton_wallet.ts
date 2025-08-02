import { TonConnectUI, Wallet } from "@tonconnect/ui-react";

export interface TonWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: any) => Promise<any>;
}

export class TonWalletManager implements TonWalletInterface {
  private tonConnectUI: TonConnectUI | null = null;
  private wallet: Wallet | null = null;
  
  constructor() {
    // Initialize TON Connect UI
    if (typeof window !== "undefined") {
      this.tonConnectUI = new TonConnectUI({
        manifestUrl: "https://unite-defi.com/tonconnect-manifest.json"
      });
    }
  }
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[TonWallet] Connecting to TON wallet...");
    
    try {
      if (!this.tonConnectUI) {
        throw new Error("TON Connect UI not initialized");
      }
      
      // Connect wallet using TON Connect UI
      const connectedWallet = await this.tonConnectUI.connectWallet();
      
      if (!connectedWallet) {
        throw new Error("Failed to connect TON wallet");
      }
      
      this.wallet = connectedWallet;
      
      return {
        address: connectedWallet.account.address,
        publicKey: connectedWallet.account.publicKey || "",
      };
    } catch (error) {
      console.error("[TonWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[TonWallet] Disconnecting from TON wallet...");
    
    if (this.tonConnectUI) {
      await this.tonConnectUI.disconnect();
    }
    
    this.wallet = null;
  }

  isConnected(): boolean {
    return !!this.wallet;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Fetch balance from TON testnet
      const response = await fetch(
        `https://testnet.toncenter.com/api/v2/getAddressBalance?address=${this.wallet.account.address}`,
        {
          headers: {
            "X-API-Key": "testnet", // Use testnet API key
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      
      const data = await response.json();
      const balance = data.result || "0";
      
      return {
        amount: balance,
        decimals: 9, // TON has 9 decimals
      };
    } catch (error) {
      console.error("[TonWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 9,
      };
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this.wallet || !this.tonConnectUI) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[TonWallet] Signing transaction:", transaction);
    
    try {
      // Send transaction using TON Connect UI
      const result = await this.tonConnectUI.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error("[TonWallet] Transaction signing error:", error);
      throw error;
    }
  }
  
  private getAvailableWallets(): any[] {
    const wallets = [];
    
    // Check for Tonkeeper
    if (typeof window !== "undefined" && (window as any).tonkeeper) {
      wallets.push({
        name: "Tonkeeper",
        available: true,
      });
    }
    
    // Check for OpenMask
    if (typeof window !== "undefined" && (window as any).openmask) {
      wallets.push({
        name: "OpenMask",
        available: true,
      });
    }
    
    // Check for TON extension
    if (typeof window !== "undefined" && (window as any).ton) {
      wallets.push({
        name: "TON Wallet",
        available: true,
      });
    }
    
    return wallets;
  }
}

// Wallet detection utilities
export const detectTonWallets = () => {
  const wallets = [];
  
  // Check for Tonkeeper
  if (typeof window !== "undefined" && ((window as any).tonkeeper || (window as any).ton)) {
    wallets.push({
      name: "Tonkeeper",
      icon: "/logos/ton.png",
      adapter: "tonkeeper",
    });
  }
  
  // Check for OpenMask
  if (typeof window !== "undefined" && (window as any).openmask) {
    wallets.push({
      name: "OpenMask",
      icon: "/logos/ton.png",
      adapter: "openmask",
    });
  }
  
  return wallets;
};