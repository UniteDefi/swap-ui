import type { Metadata } from "next";
import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "UniteDefi",
  description:
    "One universal truly interoperable wallet for all blockchains powered by 1inch Fusion Extensions",
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
        <Layout> {children}</Layout>
      </body>
    </html>
  );
}
