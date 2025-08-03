"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { NonEvmChain } from "@/lib/config/non_evm_chains";

declare global {
  interface Window {
    __nonEvmWalletManagers?: Record<string, unknown>;
  }
}

export interface NonEvmWallet {
  address: string;
  chain: NonEvmChain;
  walletType: string;
  balance?: {
    amount: string;
    decimals: number;
    symbol: string;
  };
}

interface NonEvmWalletContextType {
  wallets: NonEvmWallet[];
  isConnected: boolean;
  isConnecting: boolean;
  connect: (walletType: string, chainId: string) => Promise<void>;
  disconnect: (walletAddress?: string) => void;
  disconnectAll: () => void;
  getWallet: (walletType: string, chainId: string) => NonEvmWallet | undefined;
}

const NonEvmWalletContext = createContext<NonEvmWalletContextType | undefined>(undefined);

export function NonEvmWalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<NonEvmWallet[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async (walletType: string, chainId: string) => {
    setIsConnecting(true);
    try {
      console.log("[NonEvmWallet] Connecting to", walletType, "on chain", chainId);
      
      let walletManager: { connect: () => Promise<{ address: string; publicKey: string }> };
      let connection: { address: string; publicKey: string };
      // Find the chain configuration
      const { nonEvmChains } = await import("@/lib/config/non_evm_chains");
      const chain = nonEvmChains.find(c => c.id === chainId);
      
      if (!chain) {
        throw new Error(`Chain ${chainId} not found`);
      }
      
      switch (walletType) {
        case "aptos": {
          const { AptosWalletManager } = await import("@/lib/wallets/aptos_wallet");
          walletManager = new AptosWalletManager();
          connection = await walletManager.connect();
          break;
        }
        case "sui": {
          const { SuiWalletManager } = await import("@/lib/wallets/sui_wallet");
          walletManager = new SuiWalletManager();
          connection = await walletManager.connect();
          break;
        }
        case "starknet": {
          const { StarknetWalletManager } = await import("@/lib/wallets/starknet_wallet");
          walletManager = new StarknetWalletManager();
          connection = await walletManager.connect();
          break;
        }
        case "stellar": {
          const { StellarWalletManager } = await import("@/lib/wallets/stellar_wallet");
          walletManager = new StellarWalletManager();
          connection = await walletManager.connect();
          break;
        }
        case "cosmos": {
          const { CosmosWalletManager } = await import("@/lib/wallets/cosmos_wallet");
          walletManager = new CosmosWalletManager(chainId);
          connection = await walletManager.connect();
          break;
        }
        case "xrpl": {
          const { XrplWalletManager } = await import("@/lib/wallets/xrpl_wallet");
          walletManager = new XrplWalletManager();
          connection = await walletManager.connect();
          break;
        }
        case "icp": {
          const { IcpWalletAdapter } = await import("@/lib/wallets/icp_wallet");
          const icpWallet = new IcpWalletAdapter();
          await icpWallet.connect();
          connection = { address: icpWallet.getAddress() || "", publicKey: "" };
          walletManager = icpWallet as any;
          break;
        }
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }
      
      // Add the wallet to the list
      if (connection && chain) {
        const newWallet: NonEvmWallet = {
          address: connection.address,
          chain: chain,
          walletType: walletType,
        };
        
        setWallets(prev => {
          // Check if this wallet already exists
          const exists = prev.find(w => 
            w.address === newWallet.address && 
            w.walletType === newWallet.walletType &&
            w.chain.id === newWallet.chain.id
          );
          
          if (exists) {
            console.log("[NonEvmWallet] Wallet already connected");
            return prev;
          }
          
          return [...prev, newWallet];
        });
        
        // Store the wallet manager for future use (sign transactions, etc.)
        if (!window.__nonEvmWalletManagers) {
          (window as unknown as { __nonEvmWalletManagers: Record<string, object> }).__nonEvmWalletManagers = {};
        }
        (window as unknown as { __nonEvmWalletManagers: Record<string, object> }).__nonEvmWalletManagers[`${walletType}-${chain.id}`] = walletManager;
      }
    } catch (error) {
      console.error("[NonEvmWallet] Connection error:", error);
      
      const { formatWalletError } = await import("@/lib/utils/wallet_errors");
      const errorMessage = formatWalletError(error);
      alert(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = (walletAddress?: string) => {
    if (walletAddress) {
      setWallets(prev => prev.filter(w => w.address !== walletAddress));
    } else {
      // Disconnect the most recently connected wallet
      setWallets(prev => prev.slice(0, -1));
    }
  };
  
  const disconnectAll = () => {
    setWallets([]);
    if (window.__nonEvmWalletManagers) {
      window.__nonEvmWalletManagers = {};
    }
  };
  
  const getWallet = (walletType: string, chainId: string) => {
    return wallets.find(w => w.walletType === walletType && w.chain.id === chainId);
  };

  return (
    <NonEvmWalletContext.Provider
      value={{
        wallets,
        isConnected: wallets.length > 0,
        isConnecting,
        connect,
        disconnect,
        disconnectAll,
        getWallet,
      }}
    >
      {children}
    </NonEvmWalletContext.Provider>
  );
}

export function useNonEvmWallet() {
  const context = useContext(NonEvmWalletContext);
  if (!context) {
    throw new Error("useNonEvmWallet must be used within NonEvmWalletProvider");
  }
  return context;
}