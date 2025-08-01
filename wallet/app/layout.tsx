import type { Metadata } from "next";
import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout";
import { WalletGuard } from "@/components/wallet/wallet-guard";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Unite DeFi Wallet",
  description:
    "Multi-chain wallet for decentralized finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.className} ${spaceGrotesk.variable} ${orbitron.variable} dark`}
      >
        <WalletGuard>
          <Layout>{children}</Layout>
        </WalletGuard>
      </body>
    </html>
  );
}
