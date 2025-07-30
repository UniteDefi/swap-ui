import { Header } from "@/components/layout/header";
import { GradientWaves } from "@/components/ui/gradient-waves";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
      <GradientWaves />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 flex-1 flex items-center justify-center" style={{ paddingTop: "var(--header-height)" }}>
          <div className="text-center">
            <h1 className="text-5xl font-bold font-orbitron mb-4 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Logs Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Monitor and analyze your cross-chain swap activities
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
