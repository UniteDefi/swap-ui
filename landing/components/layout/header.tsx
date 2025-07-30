"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)]">
      <div className="absolute inset-0 bg-[#0e0e15]/40 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-800/30" />
      
      <div className="relative h-full container mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/20 blur-xl group-hover:bg-violet-500/30 transition-all duration-300" />
              <Image
                src="/logo.png"
                alt="UniteDefi"
                width={40}
                height={40}
                className="relative rounded-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-orbitron tracking-wider bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                UniteDefi
              </span>
              <span className="text-xs text-gray-500 font-medium">Cross-Chain Swaps</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link 
              href="#features" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              How it Works
            </Link>
            <Link 
              href="#docs" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Documentation
            </Link>
            <Link 
              href="/swap" 
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl text-white text-sm font-semibold transition-all duration-200"
            >
              Launch App
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}