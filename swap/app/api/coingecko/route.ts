import { NextRequest, NextResponse } from "next/server";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get("ids");
    const symbols = searchParams.get("symbols");
    const action = searchParams.get("action");

    if (action === "search" && symbols) {
      // Search for tokens by symbol
      const response = await fetch(
        `${COINGECKO_API_URL}/search?query=${symbols}`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search tokens");
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    if (!ids) {
      return NextResponse.json(
        { error: "Token IDs are required" },
        { status: 400 }
      );
    }

    // Get prices for specific tokens
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch token prices");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("CoinGecko API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch token data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenIds, vsCurrency = "usd" } = body;

    if (!tokenIds || !Array.isArray(tokenIds) || tokenIds.length === 0) {
      return NextResponse.json(
        { error: "Token IDs array is required" },
        { status: 400 }
      );
    }

    // Get detailed market data for multiple tokens
    const idsString = tokenIds.join(",");
    console.log("[CoinGecko API] Requesting prices for:", idsString);
    
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=${vsCurrency}&ids=${idsString}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[CoinGecko API] Response error:", response.status, errorText);
      throw new Error(`Failed to fetch market data: ${response.status} ${errorText}`);
    }

    const data: TokenPrice[] = await response.json();
    
    // Transform data to a more convenient format
    const pricesMap = data.reduce((acc, token) => {
      acc[token.id] = {
        usd: token.current_price,
        usd_24h_change: token.price_change_percentage_24h,
        symbol: token.symbol,
        name: token.name,
      };
      return acc;
    }, {} as Record<string, {
      usd: number;
      usd_24h_change: number;
      symbol: string;
      name: string;
    }>);

    return NextResponse.json(pricesMap);
  } catch (error) {
    console.error("CoinGecko API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}