// Direct wallet detection without starknetkit modal
interface StarknetWallet {
  enable: () => Promise<void>;
  isConnected: boolean;
  selectedAddress?: string;
  account?: {
    address: string;
  };
}

interface StarknetTransaction {
  type: string;
  contractAddress: string;
  entrypoint: string;
  calldata: string[];
}

interface StarknetTransactionResult {
  transactionHash: string;
}

interface WindowWithStarknet extends Window {
  starknet_argentX?: StarknetWallet;
  starknet_braavos?: StarknetWallet;
  starknet?: StarknetWallet;
}

export interface StarknetWalletInterface {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getBalance: () => Promise<{ amount: string; decimals: number }>;
  signTransaction: (transaction: StarknetTransaction) => Promise<StarknetTransactionResult>;
}

export class StarknetWalletManager implements StarknetWalletInterface {
  private wallet: StarknetWallet | null = null;
  private address: string | null = null;
  
  async connect(): Promise<{ address: string; publicKey: string }> {
    console.log("[StarknetWallet] Connecting to Starknet wallet...");
    
    try {
      // Check for Argent X wallet
      if (typeof window !== "undefined" && (window as WindowWithStarknet).starknet_argentX) {
        const argentX = (window as WindowWithStarknet).starknet_argentX;
        
        if (argentX) {
          // Enable Argent X
          await argentX.enable();
          
          if (!argentX.isConnected) {
            throw new Error("Failed to connect to Argent X wallet");
          }
          
          // Get the address
          const address = argentX.selectedAddress || argentX.account?.address;
          
          if (!address) {
            throw new Error("No address found in Argent X wallet");
          }
          
          this.wallet = argentX;
          this.address = address;
          
          return {
            address: address,
            publicKey: "", // Starknet doesn't expose public key directly
          };
        }
      }
      
      // Check for Braavos wallet
      if (typeof window !== "undefined" && (window as WindowWithStarknet).starknet_braavos) {
        const braavos = (window as WindowWithStarknet).starknet_braavos;
        
        if (braavos) {
          // Enable Braavos
          await braavos.enable();
          
          if (!braavos.isConnected) {
            throw new Error("Failed to connect to Braavos wallet");
          }
          
          // Get the address
          const address = braavos.selectedAddress || braavos.account?.address;
          
          if (!address) {
            throw new Error("No address found in Braavos wallet");
          }
          
          this.wallet = braavos;
          this.address = address;
          
          return {
            address: address,
            publicKey: "", // Starknet doesn't expose public key directly
          };
        }
      }
      
      // Check for generic starknet wallet
      if (typeof window !== "undefined" && (window as WindowWithStarknet).starknet) {
        const starknet = (window as WindowWithStarknet).starknet;
        
        if (starknet) {
          // Enable wallet
          await starknet.enable();
          
          if (!starknet.isConnected) {
            throw new Error("Failed to connect to Starknet wallet");
          }
          
          // Get the address
          const address = starknet.selectedAddress || starknet.account?.address;
          
          if (!address) {
            throw new Error("No address found in Starknet wallet");
          }
          
          this.wallet = starknet;
          this.address = address;
          
          return {
            address: address,
            publicKey: "", // Starknet doesn't expose public key directly
          };
        }
      }
      
      const { createWalletNotFoundError } = await import("@/lib/utils/wallet_errors");
      throw createWalletNotFoundError("Starknet", ["argentX", "braavos"]);
    } catch (error) {
      console.error("[StarknetWallet] Connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("[StarknetWallet] Disconnecting from Starknet wallet...");
    
    try {
      // Starknet wallets don't have explicit disconnect methods typically
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
      // const ETH_TOKEN_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
      
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

  async signTransaction(transaction: StarknetTransaction): Promise<StarknetTransactionResult> {
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
  if (typeof window !== "undefined" && (window as WindowWithStarknet).starknet_argentX) {
    wallets.push({
      name: "Argent X",
      icon: "/logos/starknet.png",
      adapter: "argentX",
    });
  }
  
  // Check for Braavos
  if (typeof window !== "undefined" && (window as WindowWithStarknet).starknet_braavos) {
    wallets.push({
      name: "Braavos",
      icon: "/logos/starknet.png",
      adapter: "braavos",
    });
  }
  
  return wallets;
};