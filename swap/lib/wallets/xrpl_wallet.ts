import { Client, dropsToXrp } from "xrpl";

interface XrplTransaction {
  TransactionType: string;
  Account: string;
  Fee: string;
  Sequence?: number;
  LastLedgerSequence?: number;
  [key: string]: unknown;
}

interface XrplAccountInfo {
  result: {
    account_data: {
      Balance: string;
      Account: string;
      Sequence: number;
    };
    ledger_index: number;
  };
}

interface XrplSignedTransaction {
  id: string;
  signedTransaction: string;
}

interface XummWallet {
  payload: {
    createAndSubscribe: (transaction: XrplTransaction) => Promise<{ account?: string }>;
  };
}

interface GemWallet {
  request: (params: {
    method: string;
    params: unknown;
  }) => Promise<{ result?: { account?: string } }>;
}

interface WindowWithXrpl extends Window {
  xumm?: XummWallet;
  gemWallet?: GemWallet;
  crossmark?: unknown;
}

export interface XrplWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: XrplTransaction) => Promise<XrplSignedTransaction>;
}

export class XrplWalletManager implements XrplWalletInterface {
  private address: string | null = null;
  private publicKey: string | null = null;
  private client: Client;
  
  constructor() {
    // Initialize XRPL client for testnet
    this.client = new Client("wss://s.altnet.rippletest.net:51233");
  }
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[XrplWallet] Connecting to XRPL wallet...");
    
    try {
      // Check for available XRPL wallets
      const availableWallets = this.getAvailableWallets();
      
      if (availableWallets.length === 0) {
        throw new Error("No XRPL wallet found. Please install Xumm, GemWallet, or another XRPL wallet.");
      }
      
      // Try Xumm wallet first
      if ((window as WindowWithXrpl).xumm) {
        const xumm = (window as WindowWithXrpl).xumm;
        
        if (xumm) {
          // Request connection with a simplified sign-in transaction
          const account = await xumm.payload.createAndSubscribe({
            TransactionType: "SignIn",
            Account: "", // Will be filled by Xumm
            Fee: "10"
          });
          
          if (account?.account) {
            this.address = account.account;
            this.publicKey = account.account; // XRPL uses account address
            
            return {
              address: account.account,
              publicKey: account.account,
            };
          }
        }
      }
      
      // Try GemWallet
      if ((window as WindowWithXrpl).gemWallet) {
        const gemWallet = (window as WindowWithXrpl).gemWallet;
        
        if (gemWallet) {
          // Request connection
          const response = await gemWallet.request({
            method: "wallet_requestPermissions",
            params: [
              {
                networks: ["xrpl:testnet"]
              }
            ]
          });
          
          if (response?.result?.account) {
            this.address = response.result.account;
            this.publicKey = response.result.account;
            
            return {
              address: response.result.account,
              publicKey: response.result.account,
            };
          }
        }
      }
      
      throw new Error("Failed to connect to XRPL wallet");
    } catch (error) {
      console.error("[XrplWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[XrplWallet] Disconnecting from XRPL wallet...");
    this.address = null;
    this.publicKey = null;
    
    if (this.client.isConnected()) {
      await this.client.disconnect();
    }
  }

  isConnected(): boolean {
    return !!this.address;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.address) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Connect to XRPL if not connected
      if (!this.client.isConnected()) {
        await this.client.connect();
      }
      
      // Get account info
      const accountInfo = await this.client.request({
        command: "account_info",
        account: this.address,
        ledger_index: "validated"
      }) as XrplAccountInfo;
      
      // Convert drops to XRP
      const balance = dropsToXrp(accountInfo.result.account_data.Balance.toString());
      
      return {
        amount: balance.toString(),
        decimals: 6, // XRP has 6 decimals
      };
    } catch (error) {
      console.error("[XrplWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 6,
      };
    }
  }

  async signTransaction(transaction: XrplTransaction): Promise<XrplSignedTransaction> {
    if (!this.address) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[XrplWallet] Signing transaction:", transaction);
    
    try {
      // Try Xumm wallet signing
      if ((window as WindowWithXrpl).xumm) {
        const xumm = (window as WindowWithXrpl).xumm;
        
        if (xumm) {
          const payload = await xumm.payload.createAndSubscribe(transaction);
          return {
            id: "xumm-transaction",
            signedTransaction: JSON.stringify(payload)
          };
        }
      }
      
      // Try GemWallet signing
      if ((window as WindowWithXrpl).gemWallet) {
        const gemWallet = (window as WindowWithXrpl).gemWallet;
        
        if (gemWallet) {
          const response = await gemWallet.request({
            method: "xrpl_signTransaction",
            params: {
              transaction: transaction
            }
          });
          
          return {
            id: "gemwallet-transaction",
            signedTransaction: JSON.stringify(response.result)
          };
        }
      }
      
      throw new Error("No wallet available for signing");
    } catch (error) {
      console.error("[XrplWallet] Transaction signing error:", error);
      throw error;
    }
  }
  
  private getAvailableWallets(): string[] {
    const wallets: string[] = [];
    
    if (typeof window === "undefined") return wallets;
    
    const windowWithXrpl = window as WindowWithXrpl;
    
    // Check for Xumm wallet
    if (windowWithXrpl.xumm) {
      wallets.push("xumm");
    }
    
    // Check for GemWallet
    if (windowWithXrpl.gemWallet) {
      wallets.push("gemWallet");
    }
    
    // Check for Crossmark wallet
    if (windowWithXrpl.crossmark) {
      wallets.push("crossmark");
    }
    
    return wallets;
  }
}

// Wallet detection utilities
export const detectXrplWallets = (): Array<{name: string; icon: string; adapter: string}> => {
  const wallets: Array<{name: string; icon: string; adapter: string}> = [];
  
  if (typeof window === "undefined") return wallets;
  
  const windowWithXrpl = window as WindowWithXrpl;
  
  // Check for Xumm wallet
  if (windowWithXrpl.xumm) {
    wallets.push({
      name: "Xumm",
      icon: "/logos/xrp.png",
      adapter: "xumm",
    });
  }
  
  // Check for GemWallet
  if (windowWithXrpl.gemWallet) {
    wallets.push({
      name: "GemWallet",
      icon: "/logos/xrp.png",
      adapter: "gemWallet",
    });
  }
  
  // Check for Crossmark wallet
  if (windowWithXrpl.crossmark) {
    wallets.push({
      name: "Crossmark",
      icon: "/logos/xrp.png",
      adapter: "crossmark",
    });
  }
  
  return wallets;
};