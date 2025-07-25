"use client";

import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import Image from "next/image";

export function Header() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  return (
    <header className="border-b border-gray-800 bg-[#0e0e15]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="UniteDefi Logo"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <h1 className="text-xl font-bold text-white font-orbitron">
              UniteDefi
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => open()}
              variant="default"
              className={`min-w-[140px] ${isConnected ? "bg-gray-800 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"} rounded-xl`}
            >
              {isConnected && address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}