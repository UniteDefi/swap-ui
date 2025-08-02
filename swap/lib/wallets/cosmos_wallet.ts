import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useAccount, useConnect, useDisconnect } from "graz";

declare global {
  interface Window extends KeplrWindow {}
}

export interface CosmosWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: any) => Promise<any>;
}

export class CosmosWalletManager implements CosmosWalletInterface {
  private address: string | null = null;
  private chainId: string;
  
  constructor(chainId: string = "osmosis-1") {
    this.chainId = chainId;
  }
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[CosmosWallet] Connecting to Cosmos wallet...");
    
    try {
      // Check if Keplr is available
      if (!window.keplr) {
        throw new Error("Keplr wallet not found. Please install Keplr extension.");
      }
      
      // Suggest chain to Keplr if it's not already added
      await this.suggestChain();
      
      // Enable Keplr for the chain
      await window.keplr.enable(this.chainId);
      
      // Get the offline signer
      const offlineSigner = window.keplr.getOfflineSigner(this.chainId);
      
      // Get accounts
      const accounts = await offlineSigner.getAccounts();
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found in wallet");
      }
      
      const account = accounts[0];
      this.address = account.address;
      
      return {
        address: account.address,
        publicKey: Buffer.from(account.pubkey).toString("hex"),
      };
    } catch (error) {
      console.error("[CosmosWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[CosmosWallet] Disconnecting from Cosmos wallet...");
    this.address = null;
  }

  isConnected(): boolean {
    return !!this.address;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.address) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Get chain info
      const chainInfo = await this.getChainInfo();
      
      // Fetch balance from the appropriate RPC endpoint
      const rpcUrl = chainInfo.rpc;
      const denom = chainInfo.stakeCurrency.coinMinimalDenom;
      
      const response = await fetch(`${rpcUrl}/cosmos/bank/v1beta1/balances/${this.address}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      
      const data = await response.json();
      const balance = data.balances?.find((b: any) => b.denom === denom);
      
      return {
        amount: balance?.amount || "0",
        decimals: chainInfo.stakeCurrency.coinDecimals,
      };
    } catch (error) {
      console.error("[CosmosWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 6, // Default for most Cosmos chains
      };
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this.address || !window.keplr) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[CosmosWallet] Signing transaction:", transaction);
    
    try {
      // Get the offline signer
      const offlineSigner = window.keplr.getOfflineSigner(this.chainId);
      
      // Sign the transaction
      const signedTx = await offlineSigner.signDirect(
        this.address,
        transaction.signDoc
      );
      
      return signedTx;
    } catch (error) {
      console.error("[CosmosWallet] Transaction signing error:", error);
      throw error;
    }
  }
  
  private async suggestChain() {
    if (!window.keplr) return;
    
    // Get chain configuration
    const chainInfo = await this.getChainInfo();
    
    try {
      // Try to add the chain to Keplr
      await window.keplr.experimentalSuggestChain(chainInfo);
    } catch (error) {
      console.warn("[CosmosWallet] Chain suggestion failed:", error);
      // Chain might already be added
    }
  }
  
  private async getChainInfo() {
    // Chain configurations for different Cosmos chains
    const chainConfigs: Record<string, any> = {
      "osmosis-1": {
        chainId: "osmosis-1",
        chainName: "Osmosis",
        rpc: "https://rpc.osmosis.zone",
        rest: "https://lcd.osmosis.zone",
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "osmo",
          bech32PrefixAccPub: "osmopub",
          bech32PrefixValAddr: "osmovaloper",
          bech32PrefixValPub: "osmovaloperpub",
          bech32PrefixConsAddr: "osmovalcons",
          bech32PrefixConsPub: "osmovalconspub",
        },
        currencies: [
          {
            coinDenom: "OSMO",
            coinMinimalDenom: "uosmo",
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "OSMO",
            coinMinimalDenom: "uosmo",
            coinDecimals: 6,
          },
        ],
        stakeCurrency: {
          coinDenom: "OSMO",
          coinMinimalDenom: "uosmo",
          coinDecimals: 6,
        },
      },
      "injective-1": {
        chainId: "injective-1",
        chainName: "Injective",
        rpc: "https://rpc.injective.network",
        rest: "https://lcd.injective.network",
        bip44: {
          coinType: 60,
        },
        bech32Config: {
          bech32PrefixAccAddr: "inj",
          bech32PrefixAccPub: "injpub",
          bech32PrefixValAddr: "injvaloper",
          bech32PrefixValPub: "injvaloperpub",
          bech32PrefixConsAddr: "injvalcons",
          bech32PrefixConsPub: "injvalconspub",
        },
        currencies: [
          {
            coinDenom: "INJ",
            coinMinimalDenom: "inj",
            coinDecimals: 18,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "INJ",
            coinMinimalDenom: "inj",
            coinDecimals: 18,
          },
        ],
        stakeCurrency: {
          coinDenom: "INJ",
          coinMinimalDenom: "inj",
          coinDecimals: 18,
        },
      },
      "secret-4": {
        chainId: "secret-4",
        chainName: "Secret Network",
        rpc: "https://rpc.secret.express",
        rest: "https://lcd.secret.express",
        bip44: {
          coinType: 529,
        },
        bech32Config: {
          bech32PrefixAccAddr: "secret",
          bech32PrefixAccPub: "secretpub",
          bech32PrefixValAddr: "secretvaloper",
          bech32PrefixValPub: "secretvaloperpub",
          bech32PrefixConsAddr: "secretvalcons",
          bech32PrefixConsPub: "secretvalconspub",
        },
        currencies: [
          {
            coinDenom: "SCRT",
            coinMinimalDenom: "uscrt",
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "SCRT",
            coinMinimalDenom: "uscrt",
            coinDecimals: 6,
          },
        ],
        stakeCurrency: {
          coinDenom: "SCRT",
          coinMinimalDenom: "uscrt",
          coinDecimals: 6,
        },
      },
    };
    
    return chainConfigs[this.chainId] || chainConfigs["osmosis-1"];
  }
}

// Wallet detection utilities
export const detectCosmosWallets = () => {
  const wallets = [];
  
  // Check for Keplr wallet
  if (typeof window !== "undefined" && window.keplr) {
    wallets.push({
      name: "Keplr",
      icon: "/logos/osmosis.png", // Using osmosis logo for now
      adapter: "keplr",
    });
  }
  
  // Check for Leap wallet
  if (typeof window !== "undefined" && (window as any).leap) {
    wallets.push({
      name: "Leap",
      icon: "/logos/osmosis.png",
      adapter: "leap",
    });
  }
  
  return wallets;
};