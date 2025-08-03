import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { http } from "viem";
import { 
  supportedChains, 
  monadTestnet, 
  etherlinkTestnet, 
  seiTestnet,
  injectiveTestnet,
  auroraTestnet,
  flowTestnet,
  unichainSepolia
} from "./chains";
import {
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  polygonAmoy,
  scrollSepolia,
  celoAlfajores,
  bscTestnet
} from "viem/chains";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "9MExjLYju7RbwL5KDizzG";

const metadata = {
  name: "UniteDefi",
  description: "Cross-chain swap platform with Dutch auction pricing",
  url: "https://unitedefi.com",
  icons: ["https://unitedefi.com/icon.png"],
};

// Configure chains with custom RPC URLs - ensure we always have at least one chain
const chains = supportedChains.length > 0 ? supportedChains : [sepolia];

const transports = {
  [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  [polygonAmoy.id]: http(`https://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}`),
  [scrollSepolia.id]: http(`https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  [celoAlfajores.id]: http(`https://celo-alfajores.g.alchemy.com/v2/${alchemyApiKey}`),
  [unichainSepolia.id]: http(`https://unichain-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  [flowTestnet.id]: http(`https://flow-testnet.g.alchemy.com/v2/${alchemyApiKey}`),
  [seiTestnet.id]: http(`https://sei-testnet.g.alchemy.com/v2/${alchemyApiKey}`),
  [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
  [auroraTestnet.id]: http("https://testnet.aurora.dev"),
  [injectiveTestnet.id]: http("https://testnet.sentry.chain.json-rpc.injective.network"),
  [etherlinkTestnet.id]: http("https://node.ghostnet.etherlink.com"),
  [monadTestnet.id]: http("https://rpc.ankr.com/monad_testnet"),
};

export const wagmiAdapter = new WagmiAdapter({
  networks: [...chains],
  projectId,
  ssr: true,
  transports,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [...chains] as any,
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