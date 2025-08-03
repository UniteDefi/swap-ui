import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";
// Define the types locally since the extension types might not be available
interface InjectedAccountWithMeta {
  address: string;
  meta: {
    name?: string;
    source: string;
  };
}

interface PolkadotAccountInfo {
  data: {
    free: {
      toString: () => string;
    };
    reserved: {
      toString: () => string;
    };
  };
  nonce: number;
}

interface PolkadotTransaction {
  signAsync: (
    address: string,
    options: { signer: unknown }
  ) => Promise<{
    signature: string;
    signedTransaction: string;
  }>;
}

export interface PolkadotWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: PolkadotTransaction) => Promise<{
    signature: string;
    signedTransaction: string;
  }>;
}

export class PolkadotWalletManager implements PolkadotWalletInterface {
  private account: InjectedAccountWithMeta | null = null;
  private api: ApiPromise | null = null;
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[PolkadotWallet] Connecting to Polkadot wallet...");
    
    try {
      // Enable extensions
      const extensions = await web3Enable("UniteDefi");
      
      if (extensions.length === 0) {
        throw new Error("No Polkadot wallet extensions found. Please install Polkadot.js, Talisman, or SubWallet.");
      }
      
      // Get all accounts
      const accounts = await web3Accounts();
      
      if (accounts.length === 0) {
        throw new Error("No accounts found in Polkadot wallet");
      }
      
      // Use the first account
      this.account = accounts[0];
      
      // Initialize API connection to Westend testnet
      await this.initApi();
      
      return {
        address: this.account.address,
        publicKey: this.account.address, // Polkadot uses SS58 address format
      };
    } catch (error) {
      console.error("[PolkadotWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[PolkadotWallet] Disconnecting from Polkadot wallet...");
    this.account = null;
    
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
    }
  }

  isConnected(): boolean {
    return !!this.account;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.account || !this.api) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Query account balance
      const accountInfo = await this.api.query.system.account(this.account.address) as unknown as PolkadotAccountInfo;
      
      // Get free balance
      const balance = accountInfo.data.free.toString();
      
      return {
        amount: balance,
        decimals: 12, // DOT has 12 decimals (Planck units)
      };
    } catch (error) {
      console.error("[PolkadotWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 12,
      };
    }
  }

  async signTransaction(transaction: PolkadotTransaction): Promise<{
    signature: string;
    signedTransaction: string;
  }> {
    if (!this.account) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[PolkadotWallet] Signing transaction:", transaction);
    
    try {
      // Get injector for the account
      const injector = await web3FromAddress(this.account.address);
      
      // Sign the transaction
      const signedTransaction = await transaction.signAsync(
        this.account.address,
        { signer: injector.signer }
      );
      
      return signedTransaction;
    } catch (error) {
      console.error("[PolkadotWallet] Transaction signing error:", error);
      throw error;
    }
  }
  
  private async initApi() {
    try {
      // Connect to Westend testnet
      const wsProvider = new WsProvider("wss://westend-rpc.polkadot.io");
      this.api = await ApiPromise.create({ provider: wsProvider });
      
      // Wait for API to be ready
      await this.api.isReady;
    } catch (error) {
      console.error("[PolkadotWallet] Failed to initialize API:", error);
      throw error;
    }
  }
}

// Wallet detection utilities
export const detectPolkadotWallets = (): Array<{name: string; icon: string; adapter: string}> => {
  const wallets: Array<{name: string; icon: string; adapter: string}> = [];
  
  if (typeof window === "undefined") return wallets;
  
  interface InjectedWeb3 {
    [key: string]: unknown;
  }
  
  const injectedWeb3 = (window as unknown as { injectedWeb3?: InjectedWeb3 }).injectedWeb3;
  
  // Check for Polkadot.js extension
  if (injectedWeb3?.["polkadot-js"]) {
    wallets.push({
      name: "Polkadot.js",
      icon: "/logos/polkadot.png",
      adapter: "polkadot-js",
    });
  }
  
  // Check for Talisman wallet
  if (injectedWeb3?.talisman) {
    wallets.push({
      name: "Talisman",
      icon: "/logos/polkadot.png",
      adapter: "talisman",
    });
  }
  
  // Check for SubWallet
  if (injectedWeb3?.subwallet) {
    wallets.push({
      name: "SubWallet",
      icon: "/logos/polkadot.png",
      adapter: "subwallet",
    });
  }
  
  return wallets;
};