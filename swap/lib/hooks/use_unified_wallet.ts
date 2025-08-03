import { useAccount } from "wagmi";
import { useNonEvmWallet } from "@/lib/context/non_evm_wallet_context";

export type WalletType = "evm" | "non-evm";

export interface UnifiedWallet {
  address: string | undefined;
  isConnected: boolean;
  walletType: WalletType | null;
  chainId: number | string | undefined;
  chainName: string | undefined;
  disconnect: () => void;
}

export function useUnifiedWallet(): UnifiedWallet {
  // EVM wallet state
  const { address: evmAddress, isConnected: evmConnected, chain } = useAccount();
  
  // Non-EVM wallet state
  const { wallets: nonEvmWallets, isConnected: nonEvmConnected, disconnect: nonEvmDisconnect } = useNonEvmWallet();
  
  // Determine which wallet is connected (prefer EVM, then first non-EVM)
  if (evmConnected && evmAddress) {
    return {
      address: evmAddress,
      isConnected: true,
      walletType: "evm",
      chainId: chain?.id,
      chainName: chain?.name,
      disconnect: () => {
        // EVM disconnect is handled by AppKit
        console.log("[UnifiedWallet] Disconnecting EVM wallet");
      },
    };
  }
  
  if (nonEvmConnected && nonEvmWallets.length > 0) {
    const primaryNonEvmWallet = nonEvmWallets[0];
    return {
      address: primaryNonEvmWallet.address,
      isConnected: true,
      walletType: "non-evm",
      chainId: primaryNonEvmWallet.chain.id,
      chainName: primaryNonEvmWallet.chain.name,
      disconnect: () => nonEvmDisconnect(primaryNonEvmWallet.address),
    };
  }
  
  return {
    address: undefined,
    isConnected: false,
    walletType: null,
    chainId: undefined,
    chainName: undefined,
    disconnect: () => {},
  };
}