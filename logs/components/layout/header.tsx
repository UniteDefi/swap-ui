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
              <span className="text-xs text-gray-500 font-medium">Logs Dashboard</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/analytics" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Analytics
            </Link>
            <Link 
              href="/settings" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}