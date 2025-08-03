import { useEffect, useState, useMemo } from "react";

interface TokenPriceData {
  usd: number;
  usd_24h_change: number;
  symbol: string;
  name: string;
}

export function useTokenPrices(tokenIds: string[]) {
  const [prices, setPrices] = useState<Record<string, TokenPriceData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenIdsString = useMemo(() => tokenIds.join(","), [tokenIds]);

  useEffect(() => {
    if (!tokenIds || tokenIds.length === 0) {
      setPrices({});
      return;
    }

    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/coingecko", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenIds }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch prices");
        }

        const data = await response.json();
        setPrices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch prices");
        console.error("Error fetching token prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(interval);
  }, [tokenIdsString, tokenIds]);

  return { prices, loading, error };
}

export function useTokenPrice(tokenId: string | null) {
  const { prices, loading, error } = useTokenPrices(tokenId ? [tokenId] : []);
  
  return {
    price: tokenId && prices[tokenId] ? prices[tokenId] : null,
    loading,
    error,
  };
}