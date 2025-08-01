"use client";

import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { formatAddress, formatTxHash, getExplorerAddressUrl, getExplorerTxUrl } from "@/lib/chains";

interface ExplorerLinkProps {
  value?: string;
  type: "address" | "tx";
  chainId?: number;
  className?: string;
  showCopy?: boolean;
}

export function ExplorerLink({ value, type, chainId, className = "", showCopy = true }: ExplorerLinkProps) {
  const [copied, setCopied] = useState(false);

  if (!value) return <span className="text-muted-foreground">-</span>;

  const displayValue = type === "address" ? formatAddress(value) : formatTxHash(value);
  const explorerUrl = type === "address" 
    ? getExplorerAddressUrl(chainId, value)
    : getExplorerTxUrl(chainId, value);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className="font-mono text-sm">{displayValue}</span>
      
      {showCopy && (
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-muted rounded transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
      )}
      
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 hover:bg-muted rounded transition-colors"
        title="View in explorer"
      >
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </a>
    </div>
  );
}