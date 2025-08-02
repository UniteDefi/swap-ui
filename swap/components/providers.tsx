"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type State, WagmiProvider } from "wagmi";
import { wagmiAdapter } from "@/lib/config/wagmi";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { NonEvmWalletProvider } from "@/lib/context/non_evm_wallet_context";

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <NonEvmWalletProvider>
          {children}
          <Toaster />
        </NonEvmWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}