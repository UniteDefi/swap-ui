"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import { useNonEvmWallet } from "./non_evm_wallet_context";

export type WalletType = "evm" | "non-evm";

export interface ConnectedWallet {
  id: string; // unique identifier
  type: WalletType;
  address: string;
  chainId: number | string;
  chainName: string;
  chainLogo?: string;
  walletType?: string; // for non-EVM: aptos, sui, etc.
}

interface MultiWalletContextType {
  wallets: ConnectedWallet[];
  primaryWallet: ConnectedWallet | null;
  isAnyConnected: boolean;
  totalConnected: number;
  addWallet: (wallet: ConnectedWallet) => void;
  removeWallet: (walletId: string) => void;
  setPrimaryWallet: (walletId: string) => void;
  getWalletsByType: (type: WalletType) => ConnectedWallet[];
}

const MultiWalletContext = createContext<MultiWalletContextType | undefined>(undefined);

export function MultiWalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const [primaryWalletId, setPrimaryWalletId] = useState<string | null>(null);
  
  // EVM wallet from wagmi
  const { address: evmAddress, isConnected: evmConnected, chain } = useAccount();
  
  // Non-EVM wallets from NonEvmWalletContext
  const { wallets: nonEvmWallets } = useNonEvmWallet();

  // Sync EVM wallet
  useEffect(() => {
    if (evmConnected && evmAddress && chain) {
      const evmWalletId = `evm-${evmAddress}`;
      
      setWallets(prev => {
        const existingEvmWallet = prev.find(w => w.id === evmWalletId);
        
        if (!existingEvmWallet) {
          const evmWallet: ConnectedWallet = {
            id: evmWalletId,
            type: "evm",
            address: evmAddress,
            chainId: chain.id,
            chainName: chain.name,
          };
          
          // Set as primary if no primary wallet exists
          if (!primaryWalletId) {
            setPrimaryWalletId(evmWalletId);
          }
          
          return [...prev, evmWallet];
        }
        return prev;
      });
    } else {
      // Remove EVM wallets if disconnected
      setWallets(prev => prev.filter(w => w.type !== "evm"));
      if (primaryWalletId?.startsWith("evm-")) {
        setPrimaryWalletId(null);
      }
    }
  }, [evmConnected, evmAddress, chain, primaryWalletId]);

  // Sync Non-EVM wallets
  useEffect(() => {
    setWallets(prev => {
      const currentNonEvmIds = prev.filter(w => w.type === "non-evm").map(w => w.id);
      const newNonEvmIds = nonEvmWallets.map(w => `non-evm-${w.walletType}-${w.address}`);
      
      // Remove disconnected non-EVM wallets
      const toRemove = currentNonEvmIds.filter(id => !newNonEvmIds.includes(id));
      let updatedWallets = prev.filter(w => !toRemove.includes(w.id));
      
      // Add new non-EVM wallets
      nonEvmWallets.forEach(nonEvmWallet => {
        const walletId = `non-evm-${nonEvmWallet.walletType}-${nonEvmWallet.address}`;
        const exists = updatedWallets.find(w => w.id === walletId);
        
        if (!exists) {
          const wallet: ConnectedWallet = {
            id: walletId,
            type: "non-evm",
            address: nonEvmWallet.address,
            chainId: nonEvmWallet.chain.id,
            chainName: nonEvmWallet.chain.name,
            walletType: nonEvmWallet.walletType,
          };
          updatedWallets = [...updatedWallets, wallet];
          
          // Set as primary if no primary wallet exists
          if (!primaryWalletId) {
            setPrimaryWalletId(walletId);
          }
        }
      });
      
      return updatedWallets;
    });
  }, [nonEvmWallets, primaryWalletId]);

  const addWallet = (wallet: ConnectedWallet) => {
    setWallets(prev => {
      const exists = prev.find(w => w.id === wallet.id);
      if (exists) return prev;
      return [...prev, wallet];
    });
    
    // Set as primary if no primary wallet exists
    if (!primaryWalletId) {
      setPrimaryWalletId(wallet.id);
    }
  };

  const removeWallet = (walletId: string) => {
    setWallets(prev => prev.filter(w => w.id !== walletId));
    
    // Update primary wallet if removed
    if (primaryWalletId === walletId) {
      const remaining = wallets.filter(w => w.id !== walletId);
      setPrimaryWalletId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const setPrimaryWallet = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (wallet) {
      setPrimaryWalletId(walletId);
    }
  };

  const getWalletsByType = (type: WalletType) => {
    return wallets.filter(w => w.type === type);
  };

  const primaryWallet = wallets.find(w => w.id === primaryWalletId) || wallets[0] || null;

  return (
    <MultiWalletContext.Provider
      value={{
        wallets,
        primaryWallet,
        isAnyConnected: wallets.length > 0,
        totalConnected: wallets.length,
        addWallet,
        removeWallet,
        setPrimaryWallet,
        getWalletsByType,
      }}
    >
      {children}
    </MultiWalletContext.Provider>
  );
}

export function useMultiWallet() {
  const context = useContext(MultiWalletContext);
  if (!context) {
    throw new Error("useMultiWallet must be used within MultiWalletProvider");
  }
  return context;
}