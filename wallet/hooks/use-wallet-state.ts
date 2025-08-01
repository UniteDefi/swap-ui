"use client";

import { useState, useEffect } from "react";
import { WalletManager } from "@/lib/wallet-manager";
import { WalletState, EncryptedWallet } from "@/lib/wallet-types";

export function useWalletState() {
  const [walletState, setWalletState] = useState<WalletState>({
    isInitialized: false,
    isUnlocked: false,
    currentWallet: null,
    wallets: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkWalletState();
  }, []);

  const checkWalletState = () => {
    setIsLoading(true);
    
    try {
      const hasWallets = WalletManager.hasWallets();
      const wallets = WalletManager.getStoredWallets();
      const currentWalletId = WalletManager.getCurrentWalletId();
      const currentWallet = currentWalletId 
        ? wallets.find(w => w.id === currentWalletId) || null
        : null;

      setWalletState({
        isInitialized: hasWallets,
        isUnlocked: false, // Always start locked
        currentWallet,
        wallets,
      });
    } catch (error) {
      console.error("[useWalletState] Error checking wallet state:", error);
      setWalletState({
        isInitialized: false,
        isUnlocked: false,
        currentWallet: null,
        wallets: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unlockWallet = async (walletId: string, password: string): Promise<boolean> => {
    try {
      const wallet = walletState.wallets.find(w => w.id === walletId);
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const mnemonic = WalletManager.decryptMnemonic(wallet.encryptedMnemonic, password);
      const accounts = await WalletManager.deriveWalletAccounts(mnemonic);
      
      const unlockedWallet: EncryptedWallet = {
        ...wallet,
        accounts,
      };

      setWalletState(prev => ({
        ...prev,
        isUnlocked: true,
        currentWallet: unlockedWallet,
      }));

      WalletManager.setCurrentWallet(walletId);
      return true;
    } catch (error) {
      console.error("[useWalletState] Failed to unlock wallet:", error);
      return false;
    }
  };

  const lockWallet = () => {
    setWalletState(prev => ({
      ...prev,
      isUnlocked: false,
      currentWallet: prev.currentWallet ? {
        ...prev.currentWallet,
        accounts: [], // Clear sensitive data
      } : null,
    }));
  };

  const createWallet = async (mnemonic: string, password: string, name?: string): Promise<boolean> => {
    try {
      const wallet = WalletManager.encryptWallet(mnemonic, password, name);
      WalletManager.saveWallet(wallet);
      
      // Refresh state
      checkWalletState();
      return true;
    } catch (error) {
      console.error("[useWalletState] Failed to create wallet:", error);
      return false;
    }
  };

  const exportWallets = (password: string): string => {
    return WalletManager.exportWallets(password);
  };

  return {
    walletState,
    isLoading,
    unlockWallet,
    lockWallet,
    createWallet,
    exportWallets,
    refreshState: checkWalletState,
  };
}