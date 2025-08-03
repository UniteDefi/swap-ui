import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window extends KeplrWindow {
    // Extending KeplrWindow interface
  }
}

interface CosmosBalance {
  denom: string;
  amount: string;
}

interface CosmosBalanceResponse {
  balances: CosmosBalance[];
}

interface SignDoc {
  bodyBytes: Uint8Array;
  authInfoBytes: Uint8Array;
  chainId: string;
  accountNumber: bigint;
}

interface CosmosTransaction {
  signDoc: SignDoc;
}

interface CosmosSignedTransaction {
  signed: SignDoc;
  signature: {
    pub_key: unknown;
    signature: string;
  };
}

export interface CosmosWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: CosmosTransaction) => Promise<CosmosSignedTransaction>;
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
        const { createWalletNotFoundError } = await import("@/lib/utils/wallet_errors");
        throw createWalletNotFoundError("Cosmos", ["keplr"]);
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
      
      const data: CosmosBalanceResponse = await response.json();
      const balance = data.balances?.find((b: CosmosBalance) => b.denom === denom);
      
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

  async signTransaction(transaction: CosmosTransaction): Promise<CosmosSignedTransaction> {
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
    interface ChainConfig {
      chainId: string;
      chainName: string;
      rpc: string;
      rest: string;
      bip44: {
        coinType: number;
      };
      bech32Config: {
        bech32PrefixAccAddr: string;
        bech32PrefixAccPub: string;
        bech32PrefixValAddr: string;
        bech32PrefixValPub: string;
        bech32PrefixConsAddr: string;
        bech32PrefixConsPub: string;
      };
      currencies: Array<{
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
      }>;
      feeCurrencies: Array<{
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
      }>;
      stakeCurrency: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
      };
    }
    
    const chainConfigs: Record<string, ChainConfig> = {
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
      "osmosis-testnet": {
        chainId: "osmo-test-5",
        chainName: "Osmosis Testnet",
        rpc: "https://rpc.testnet.osmosis.zone",
        rest: "https://lcd.testnet.osmosis.zone",
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
      "secret-testnet": {
        chainId: "pulsar-3",
        chainName: "Secret Network Testnet",
        rpc: "https://rpc.testnet.secretsaturn.net",
        rest: "https://lcd.testnet.secretsaturn.net",
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
    
    const config = chainConfigs[this.chainId];
    if (!config) {
      throw new Error(`There is no modular chain info for ${this.chainId}. Please contact support.`);
    }
    return config;
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
  if (typeof window !== "undefined" && (window as unknown as { leap?: unknown }).leap) {
    wallets.push({
      name: "Leap",
      icon: "/logos/osmosis.png",
      adapter: "leap",
    });
  }
  
  return wallets;
};