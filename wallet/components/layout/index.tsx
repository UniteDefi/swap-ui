import { Header } from "@/components/layout/header";
import { GradientWaves } from "@/components/ui/gradient-waves";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-black bg-gradient-to-br from-black via-violet-950/20 to-purple-950/30">
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
        <GradientWaves />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          {children}
        </div>
      </div>
    </main>
  );
}
