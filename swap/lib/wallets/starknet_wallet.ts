import { connect, disconnect, StarknetWindowObject } from "starknetkit";

export interface StarknetWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: any) => Promise<any>;
}

export class StarknetWalletManager implements StarknetWalletInterface {
  private wallet: StarknetWindowObject | null = null;
  private address: string | null = null;
  
  async connect(walletId?: string): Promise<{ address: string; publicKey: string }> {
    console.log("[StarknetWallet] Connecting to Starknet wallet...");
    
    try {
      // Connect to Starknet wallet
      const result = await connect({
        modalMode: walletId ? "neverAsk" : "alwaysAsk",
        modalTheme: "dark",
        webWalletUrl: "https://web.argent.xyz",
        argentMobileOptions: {
          dappName: "UniteDefi",
          projectId: "unite-defi",
          url: "https://unitedefi.com",
        },
      });
      
      if (!result || !result.wallet) {
        throw new Error("Failed to connect to Starknet wallet");
      }
      
      this.wallet = result.wallet;
      
      // Get the wallet address
      const wallet = result.wallet;
      if (!wallet) {
        throw new Error("No wallet found");
      }
      
      // Enable wallet if needed
      if (!(wallet as any).isConnected) {
        await (wallet as any).enable();
      }
      
      // Get the address from the wallet
      const address = (wallet as any).selectedAddress || (wallet as any).account?.address;
      
      if (!address) {
        throw new Error("No address found in wallet");
      }
      
      this.address = address;
      
      return {
        address: address,
        publicKey: "", // Starknet doesn't expose public key directly
      };
    } catch (error) {
      console.error("[StarknetWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[StarknetWallet] Disconnecting from Starknet wallet...");
    
    try {
      await disconnect();
      this.wallet = null;
      this.address = null;
    } catch (error) {
      console.error("[StarknetWallet] Disconnect error:", error);
    }
  }

  isConnected(): boolean {
    return !!this.wallet && !!this.address;
  }

  async getBalance(): Promise<{ amount: string; decimals: number }> {
    if (!this.wallet || !this.address) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // ETH token address on Starknet testnet
      const ETH_TOKEN_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
      
      // For now, return a mock balance
      // In a real implementation, you'd use the Starknet SDK to fetch the balance
      console.log("[StarknetWallet] Fetching balance for", this.address);
      
      return {
        amount: "0",
        decimals: 18, // ETH has 18 decimals on Starknet
      };
    } catch (error) {
      console.error("[StarknetWallet] Error fetching balance:", error);
      return {
        amount: "0",
        decimals: 18,
      };
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    
    console.log("[StarknetWallet] Signing transaction:", transaction);
    
    try {
      // For now, return a mock result
      // In a real implementation, you'd use the wallet's execute method
      console.log("[StarknetWallet] Would execute transaction:", transaction);
      return { transactionHash: "0x123..." };
    } catch (error) {
      console.error("[StarknetWallet] Transaction signing error:", error);
      throw error;
    }
  }
}

// Wallet detection utilities
export const detectStarknetWallets = () => {
  const wallets = [];
  
  // Check for Argent X
  if (typeof window !== "undefined" && (window as any).starknet_argentX) {
    wallets.push({
      name: "Argent X",
      icon: "/logos/starknet.png",
      adapter: "argentX",
    });
  }
  
  // Check for Braavos
  if (typeof window !== "undefined" && (window as any).starknet_braavos) {
    wallets.push({
      name: "Braavos",
      icon: "/logos/starknet.png",
      adapter: "braavos",
    });
  }
  
  return wallets;
};