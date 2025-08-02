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
      
      let walletManager: any;
      let connection: { address: string; publicKey: string };
      let chain: NonEvmChain | undefined;
      
      // Find the chain configuration
      const { nonEvmChains } = await import("@/lib/config/non_evm_chains");
      chain = nonEvmChains.find(c => c.id === chainId);
      
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
        case "ton": {
          const { TonWalletManager } = await import("@/lib/wallets/ton_wallet");
          walletManager = new TonWalletManager();
          connection = await walletManager.connect();
          break;
        }
        case "starknet": {
          const { StarknetWalletManager } = await import("@/lib/wallets/starknet_wallet");
          walletManager = new StarknetWalletManager();
          connection = await walletManager.connect();
          break;
        }
        case "near": {
          const { NearWalletManager } = await import("@/lib/wallets/near_wallet");
          walletManager = new NearWalletManager();
          connection = await walletManager.connect();
          break;
        }
        case "cardano": {
          const { CardanoWalletManager } = await import("@/lib/wallets/cardano_wallet");
          walletManager = new CardanoWalletManager();
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
        case "polkadot": {
          const { PolkadotWalletManager } = await import("@/lib/wallets/polkadot_wallet");
          walletManager = new PolkadotWalletManager();
          connection = await walletManager.connect();
          break;
        }
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }
      
      // Set the wallet state
      if (connection && chain) {
        setWallet({
          address: connection.address,
          chain: chain,
          walletType: walletType,
        });
        
        // Store the wallet manager for future use (sign transactions, etc.)
        (window as any).__nonEvmWalletManager = walletManager;
      }
    } catch (error) {
      console.error("[NonEvmWallet] Connection error:", error);
      alert(error instanceof Error ? error.message : "Failed to connect wallet");
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