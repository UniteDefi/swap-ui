"use client";

import { useWalletState } from "@/hooks/use-wallet-state";
import { OnboardingFlow } from "./onboarding-flow";
import { UnlockWallet } from "./unlock-wallet";

interface WalletGuardProps {
  children: React.ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
  const { walletState, isLoading } = useWalletState();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading wallet...</div>
      </div>
    );
  }

  // Show onboarding if no wallets exist
  if (!walletState.isInitialized) {
    return <OnboardingFlow />;
  }

  // Show unlock screen if wallet exists but is locked
  if (!walletState.isUnlocked) {
    return <UnlockWallet />;
  }

  // Wallet is unlocked, show the main app
  return <>{children}</>;
}