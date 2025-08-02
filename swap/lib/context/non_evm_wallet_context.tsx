"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { NonEvmChain } from "@/lib/config/non_evm_chains";

interface NonEvmWallet {
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
  wallet: NonEvmWallet | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (walletType: string, chainId: string) => Promise<void>;
  disconnect: () => void;
}

const NonEvmWalletContext = createContext<NonEvmWalletContextType | undefined>(undefined);

export function NonEvmWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<NonEvmWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async (walletType: string, chainId: string) => {
    setIsConnecting(true);
    try {
      console.log("[NonEvmWallet] Connecting to", walletType, "on chain", chainId);
      
      // TODO: Implement actual wallet connections for each type
      // This is a placeholder implementation
      switch (walletType) {
        case "aptos":
          // TODO: Implement Aptos wallet connection
          break;
        case "sui":
          // TODO: Implement Sui wallet connection
          break;
        case "cardano":
          // TODO: Implement Cardano wallet connection
          break;
        case "stellar":
          // TODO: Implement Stellar wallet connection
          break;
        case "cosmos":
          // TODO: Implement Cosmos wallet connection (Keplr)
          break;
        case "xrpl":
          // TODO: Implement XRPL wallet connection
          break;
        case "ton":
          // TODO: Implement TON wallet connection
          break;
        case "near":
          // TODO: Implement NEAR wallet connection
          break;
        case "polkadot":
          // TODO: Implement Polkadot wallet connection
          break;
        case "starknet":
          // TODO: Implement Starknet wallet connection
          break;
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }
    } catch (error) {
      console.error("[NonEvmWallet] Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
  };

  return (
    <NonEvmWalletContext.Provider
      value={{
        wallet,
        isConnected: !!wallet,
        isConnecting,
        connect,
        disconnect,
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