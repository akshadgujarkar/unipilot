"use client";

import { Sparkles } from "lucide-react";
import { NetworkBadge } from "./NetworkBadge";
import { WalletConnect } from "./WalletConnect";

export function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                UniPilot<span className="text-purple-400">.AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-900/40 border border-purple-700/50 text-purple-300">
                Testnet
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Intelligent DeFi Copilot • Unichain Sepolia
            </p>
          </div>
        </div>

        {/* Web3 Actions */}
        <div className="flex items-center gap-3">
          <NetworkBadge />
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}

