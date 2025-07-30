import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { http } from "viem";
import { supportedChains, monadTestnet, etherlinkTestnet, seiTestnet } from "./chains";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";

const metadata = {
  name: "UniteDefi",
  description: "Cross-chain swap platform with Dutch auction pricing",
  url: "https://unitedefi.com",
  icons: ["https://unitedefi.com/icon.png"],
};

// Configure chains with custom RPC URLs
const chains = supportedChains;

const transports = {
  [11155111]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`), // Sepolia
  [80002]: http(`https://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}`), // Polygon Amoy
  [84532]: http(`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`), // Base Sepolia
  [421614]: http(`https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`), // Arbitrum Sepolia
  [97]: http("https://data-seed-prebsc-1-s1.binance.org:8545"), // BSC Testnet
  [monadTestnet.id]: http("https://testnet.monad.xyz"),
  [etherlinkTestnet.id]: http("https://node.ghostnet.etherlink.com"),
  [seiTestnet.id]: http("https://evm-rpc-arctic-1.sei-apis.com"),
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