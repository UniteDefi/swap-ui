"use client";

import Image from "next/image";

interface TokenLogoProps {
  token: string;
  chain: string;
  chainId?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Map chain names to logo filenames
const chainLogoMap: Record<string, string> = {
  "Polygon Amoy": "polygon",
  "Arbitrum Sepolia": "arbitrum",
  "Base Sepolia": "base",
  "BNB Testnet": "bnb",
  "Ethereum Sepolia": "ethereum",
  "Monad Testnet": "monad",
  "Etherlink Testnet": "etherlink",
  "Sei Testnet": "sei",
};

// Map token symbols to logo filenames
const tokenLogoMap: Record<string, string> = {
  "USDT": "usdt",
  "DAI": "dai",
  "ETH": "ethereum",
};

export function TokenLogo({ token, chain, size = "md", className = "" }: TokenLogoProps) {
  const sizeMap = {
    sm: { main: 24, badge: 12 },
    md: { main: 32, badge: 16 },
    lg: { main: 40, badge: 20 },
  };

  const dimensions = sizeMap[size];
  const tokenLogo = tokenLogoMap[token] || "ethereum"; // Default to ETH logo
  const chainLogo = chainLogoMap[chain] || "ethereum"; // Default to ETH logo

  return (
    <div className={`relative inline-block ${className}`} style={{ width: dimensions.main, height: dimensions.main }}>
      {/* Main token logo */}
      <Image
        src={`/logos/${tokenLogo}.png`}
        alt={token}
        width={dimensions.main}
        height={dimensions.main}
        className="rounded-full"
      />
      
      {/* Chain badge in bottom-right */}
      <div 
        className="absolute -bottom-1 -right-1 bg-background rounded-full border border-border"
        style={{ width: dimensions.badge, height: dimensions.badge }}
      >
        <Image
          src={`/logos/${chainLogo}.png`}
          alt={chain}
          width={dimensions.badge}
          height={dimensions.badge}
          className="rounded-full"
        />
      </div>
    </div>
  );
}