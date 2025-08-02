"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Code,
  FileText,
  Trophy,
  Github,
  Twitter,
  Play,
} from "lucide-react";

// Dynamically import Globe to avoid SSR issues with Three.js
const Globe = dynamic(() => import("@/components/globe"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-96 h-96 rounded-full bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-800/30 animate-spin-slow"></div>
    </div>
  ),
});

export default function HomePage() {
  const supportedChains = [
    // Non-EVM Chains
    { name: "Aptos", logo: "/logos/aptos.png" },
    { name: "Sui", logo: "/logos/sui.png" },
    { name: "Cardano", logo: "/logos/cardano.png" },
    { name: "Stellar", logo: "/logos/stellar.png" },
    { name: "Osmosis", logo: "/logos/osmosis.png" },
    { name: "Secret Network", logo: "/logos/secret.png" },
    { name: "XRP Ledger", logo: "/logos/xrp.png" },
    { name: "TON", logo: "/logos/ton.png" },
    { name: "Near", logo: "/logos/near.png" },
    { name: "Polkadot", logo: "/logos/polkadot.png" },
    { name: "Starknet", logo: "/logos/starknet.png" },
    // EVM Chains
    { name: "Etherlink", logo: "/logos/etherlink.png" },
    { name: "Monad", logo: "/logos/monad.png" },
    { name: "Injective EVM", logo: "/logos/injective.png" },
    { name: "Aurora", logo: "/logos/aurora.jpg" },
    { name: "BNB", logo: "/logos/bnb.png" },
    { name: "Optimism", logo: "/logos/optimism.png" },
    { name: "Polygon", logo: "/logos/polygon.png" },
    { name: "Scroll", logo: "/logos/scroll.png" },
    { name: "Celo", logo: "/logos/celo.png" },
    { name: "Unichain", logo: "/logos/unichain.jpg" },
    { name: "Flow EVM", logo: "/logos/flow.jpg" },
    { name: "Sei", logo: "/logos/sei.png" },
    { name: "Base", logo: "/logos/base.png" },
    { name: "Arbitrum", logo: "/logos/arbitrum.png" },
    { name: "Ethereum", logo: "/logos/ethereum.png" },
  ];

  return (
    <div className="flex-1">
      <section className="min-h-screen relative overflow-hidden">
        {/* Globe as background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px]">
            <Globe />
          </div>
        </div>

        {/* Content on top */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              UniteDeFi
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Solving Cross chain Fragmentation
            </p>
            <p className="text-lg md:text-xl text-gray-400 mb-12">
              Powered by 1inch Fusion Extensions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link
                href="https://swap.unite-defi.com/"
                target="_blank"
                className="group bg-violet-900/20 backdrop-blur-sm border border-violet-800/50 rounded-xl p-6 hover:bg-violet-900/30 hover:border-violet-700 transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <span className="text-violet-400 group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Try Unite DeFi</h3>
                <p className="text-gray-400 text-sm">
                  Swap assets seamlessly across any blockchain
                </p>
              </Link>

              <Link
                href="http://logs.unite-defi.com/"
                target="_blank"
                className="group bg-pink-900/20 backdrop-blur-sm border border-pink-800/50 rounded-xl p-6 hover:bg-pink-900/30 hover:border-pink-700 transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6" />
                  </div>
                  <span className="text-pink-400 group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">App Infra Logs</h3>
                <p className="text-gray-400 text-sm">
                  Track relayers, resolvers & swap history
                </p>
              </Link>

              <Link
                href="http://docs.unite-defi.com/"
                target="_blank"
                className="group bg-blue-900/20 backdrop-blur-sm border border-blue-800/50 rounded-xl p-6 hover:bg-blue-900/30 hover:border-blue-700 transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-blue-400 group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Documentation</h3>
                <p className="text-gray-400 text-sm">
                  Learn everything about Unite DeFi protocol
                </p>
              </Link>

              <Link
                href="https://www.canva.com/design/DAGu8bzXpPE/N_SC68Tg0bJe1fldDv2fzg/watch?utm_content=DAGu8bzXpPE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h1b7111a15d"
                target="_blank"
                className="group bg-green-900/20 backdrop-blur-sm border border-green-800/50 rounded-xl p-6 hover:bg-green-900/30 hover:border-green-700 transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6" />
                  </div>
                  <span className="text-green-400 group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Watch Video</h3>
                <p className="text-gray-400 text-sm">
                  See Unite DeFi in action with demo video
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Supporting All Major Blockchains
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {supportedChains.map((chain, index) => (
              <div
                key={chain.name}
                className="bg-gradient-to-br from-violet-900/10 to-purple-900/10 backdrop-blur-sm border border-violet-800/30 rounded-lg p-4 text-center hover:from-violet-900/20 hover:to-purple-900/20 hover:border-violet-700/50 transition-all transform hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <img
                    src={chain.logo}
                    alt={chain.name}
                    className="w-10 h-10 object-contain rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-300">{chain.name}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">And many more coming soon...</p>
            <div className="flex justify-center space-x-4">
              <span className="text-violet-400">Testnet Support</span>
              <span className="text-gray-600">•</span>
              <span className="text-purple-400">26 Chains Supported</span>
              <span className="text-gray-600">•</span>
              <span className="text-pink-400">Truly Interoperable</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-violet-900/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Built at ETHGlobal Unite DeFi 2025
          </h2>
          <Link
            href="https://ethglobal.com/showcase/unite-defi-mb1f4"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all transform hover:scale-105 text-lg font-semibold"
          >
            <Trophy className="w-6 h-6" />
            <span>View ETHGlobal Showcase</span>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-violet-900/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 UniteDeFi. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="https://x.com/1inchUniteDefi"
              target="_blank"
              className="text-gray-400 hover:text-violet-400 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/UniteDefi"
              target="_blank"
              className="text-gray-400 hover:text-violet-400 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(5px);
          }
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
