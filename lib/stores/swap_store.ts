import { create } from "zustand";
import type { Token } from "@/components/features/swap/token_input";

interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  isDutchAuction: boolean;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  setIsDutchAuction: (isDutchAuction: boolean) => void;
  resetSwap: () => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  fromToken: null,
  toToken: null,
  fromAmount: "",
  toAmount: "",
  slippage: 0.5,
  isDutchAuction: false,
  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setFromAmount: (amount) => set({ fromAmount: amount }),
  setToAmount: (amount) => set({ toAmount: amount }),
  setSlippage: (slippage) => set({ slippage }),
  setIsDutchAuction: (isDutchAuction) => set({ isDutchAuction }),
  resetSwap: () =>
    set({
      fromToken: null,
      toToken: null,
      fromAmount: "",
      toAmount: "",
      slippage: 0.5,
      isDutchAuction: false,
    }),
}));