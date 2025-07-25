"use client";

import { Header } from "@/components/layout/header";
import { SwapCard } from "./swap_card";

export function SwapContainer() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <div id="gradient-canvas" className="absolute inset-0 opacity-30" />
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[480px] mx-auto">
            <SwapCard />
          </div>
        </div>
      </div>
    </div>
  );
}