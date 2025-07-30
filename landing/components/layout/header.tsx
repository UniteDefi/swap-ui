"use client";

import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/30 bg-[#0e0e15]/40 backdrop-blur-xl backdrop-saturate-150">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="UniteDefi Logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <h1 className="ml-3 text-xl font-bold text-white font-orbitron">
            UniteDefi
          </h1>
        </div>
      </div>
    </header>
  );
}
