"use client";

import { Header } from "@/components/layout/header";
import { SwapCard } from "./swap_card";
import { Suspense } from "react";
import { GradientWaves } from "@/components/ui/gradient-waves";

export function SwapContainer() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <GradientWaves />
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-[480px] mx-auto">
            <Suspense fallback={
              <div className="w-full h-[600px] bg-[#1b1b23] rounded-2xl animate-pulse" />
            }>
              <SwapCard />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}