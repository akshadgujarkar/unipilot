"use client";

import { WalletCard } from "@/components/WalletCard";
import { ChatInterface } from "@/components/ChatInterface";
import { Bot, Shield, Cpu, Activity, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Intro */}
      <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-purple-950/20 via-slate-900/40 to-slate-950/60 p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-xs font-semibold text-purple-300 mb-4">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Phase 3 Milestone • Web3 & ERC-20 Integration Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Your Autonomous Copilot for <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200 bg-clip-text text-transparent">Uniswap on Unichain</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            UniPilot combines Gemini AI agents with live on-chain Uniswap liquidity data. 
            Analyze liquidity pools, calculate slippage, obtain real swap quotes, and prepare transactions with strict user approval.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Unichain Sepolia (1301)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>User-Approval Model</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Viem + Wagmi Web3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Wallet Details & AI Agent Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Wallet Status */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span>Account & Network</span>
            </h2>
            <WalletCard />
          </div>

          {/* Security Guarantee Box */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-semibold text-slate-200 mb-1">Non-Custodial Architecture</h4>
                <p className="text-slate-400 leading-relaxed">
                  UniPilot never holds your private keys or signs transactions directly. 
                  Every swap prepared by the AI must be reviewed and signed manually in your MetaMask wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live AI Assistant */}
        <div className="lg:col-span-7">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>AI Trading Assistant</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-normal">
              ETH, ERC-20 Balances, Metadata & Chain Validation
            </span>
          </h2>

          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

