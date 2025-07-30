"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Code,
  Wallet,
  FileText,
  Trophy,
  Github,
  Twitter,
} from "lucide-react";

// Dynamically import Globe to avoid SSR issues with Three.js
const Globe = dynamic(() => import("@/components/globe"), {
  ssr: false,
  loading: () => (
    <div className="w-80 h-80 mx-auto mb-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-800/30 animate-spin-slow"></div>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const supportedChains = [
    "Aptos",
    "Bitcoin",
    "Injective",
    "Osmosis",
    "Sei",
    "Near",
    "Sui",
    "Tron",
    "Stellar",
    "Etherlink",
    "TON",
    "Monad",
    "Cardano",
    "XRP Ledger",
    "ICP",
    "Tezos",
    "Polkadot",
    "EOS",
    "Base",
    "Arbitrum",
    "Ethereum",
    "Polygon",
    "BNB",
  ];

  return (
    <div className="flex-1">
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* 3D Globe */}
          <div className="w-80 h-80 mx-auto mb-8 relative">
            <Globe />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            UniteDeFi
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            One Universal Truly Interoperable Wallet
          </p>
          <p className="text-lg md:text-xl text-gray-400 mb-12">
            Powered by 1inch Fusion Extensions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="https://swap.unite-defi.com/"
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
              <h3 className="text-xl font-bold mb-2">Cross-Chain Swap</h3>
              <p className="text-gray-400 text-sm">
                Swap assets seamlessly across any blockchain
              </p>
            </Link>

            <Link
              href="http://wallet.unite-defi.com"
              className="group bg-purple-900/20 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6 hover:bg-purple-900/30 hover:border-purple-700 transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-purple-400 group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Universal Wallet</h3>
              <p className="text-gray-400 text-sm">
                Create and manage your cross-chain wallet
              </p>
            </Link>

            <Link
              href="http://logs.unite-defi.com/"
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
              <h3 className="text-xl font-bold mb-2">Transaction Logs</h3>
              <p className="text-gray-400 text-sm">
                Track relayers, resolvers & swap history
              </p>
            </Link>

            <Link
              href="http://docs.unite-defi.com/"
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
                Learn how to use the protocol
              </p>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-violet-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-violet-400 rounded-full mt-2 animate-scroll"></div>
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
                key={chain}
                className="bg-gradient-to-br from-violet-900/10 to-purple-900/10 backdrop-blur-sm border border-violet-800/30 rounded-lg p-4 text-center hover:from-violet-900/20 hover:to-purple-900/20 hover:border-violet-700/50 transition-all transform hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {chain.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-300">{chain}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">And many more coming soon...</p>
            <div className="flex justify-center space-x-4">
              <span className="text-violet-400">$100k+ in Bounties</span>
              <span className="text-gray-600">•</span>
              <span className="text-purple-400">20+ Chains Supported</span>
              <span className="text-gray-600">•</span>
              <span className="text-pink-400">Truly Interoperable</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-violet-900/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Built at ETHGlobal Bangkok 2024
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
            © 2024 UniteDeFi. All rights reserved.
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