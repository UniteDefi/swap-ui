import { Header } from "@/components/layout/header";
import { GradientWaves } from "@/components/ui/gradient-waves";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
      <GradientWaves />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 flex-1 flex items-center justify-center" style={{ paddingTop: "var(--header-height)" }}>
          <div className="text-center max-w-4xl">
            <h1 className="text-6xl font-bold font-orbitron mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cross-Chain Swaps Made Simple
            </h1>
            <p className="text-gray-400 text-xl mb-8 leading-relaxed">
              UniteDefi enables seamless token swaps across multiple blockchains with professional-grade
              Dutch auction pricing and decentralized execution.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/swap"
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Launch App
              </a>
              <a
                href="#docs"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-semibold transition-all duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}