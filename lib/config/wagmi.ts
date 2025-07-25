import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { 
  arbitrumSepolia,
  baseSepolia,
  polygonAmoy,
  sepolia,
} from "viem/chains";
import { http } from "viem";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";

const metadata = {
  name: "UniteDefi",
  description: "Cross-chain swap platform with Dutch auction pricing",
  url: "https://unitedefi.com",
  icons: ["https://unitedefi.com/icon.png"],
};

// Configure chains with custom RPC URLs
const chains = [sepolia, polygonAmoy, baseSepolia, arbitrumSepolia] as const;

const transports = {
  [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  [polygonAmoy.id]: http(`https://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}`),
  [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
};

export const wagmiAdapter = new WagmiAdapter({
  networks: [...chains],
  projectId,
  ssr: true,
  transports,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [...chains],
  projectId,
  metadata,
  features: {
    email: false,
    socials: false,
    analytics: true,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-font-family": "Inter, sans-serif",
    "--w3m-accent": "#a855f7",
  },
});