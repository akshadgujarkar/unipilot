"use client";

import { WalletCard } from "@/components/WalletCard";
import { Bot, Shield, Cpu, Activity, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Intro */}
      <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-purple-950/20 via-slate-900/40 to-slate-950/60 p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-xs font-semibold text-purple-300 mb-4">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Phase 1 Milestone • Foundation Active</span>
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

        {/* Right Column: AI Assistant Preview (Phase 2 Target) */}
        <div className="lg:col-span-7">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>AI Trading Assistant (Phase 2 Preview)</span>
            </span>
            <span className="text-[11px] text-purple-400 font-normal">
              Next Milestone: Gemini Function Calling
            </span>
          </h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md p-6 flex flex-col justify-between min-h-[380px] shadow-xl">
            {/* Mock chat conversation preview */}
            <div className="space-y-4">
              {/* User prompt preview */}
              <div className="flex items-start gap-3 justify-end">
                <div className="max-w-md rounded-2xl rounded-tr-sm bg-purple-600/30 border border-purple-500/30 p-3.5 text-xs text-purple-100">
                  Analyze the ETH/USDC pool on Uniswap and prepare a swap of 0.01 ETH if conditions are safe.
                </div>
              </div>

              {/* Agent response preview */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-md rounded-2xl rounded-tl-sm bg-slate-800/60 border border-slate-700/60 p-3.5 text-xs text-slate-300 space-y-2">
                  <p>
                    I analyzed the Unichain Sepolia ETH/USDC pool. The current price impact is <strong>0.02%</strong> with estimated gas of <strong>~120k units</strong>.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                    <div>• Input: 0.01 ETH</div>
                    <div>• Estimated Output: ~32.45 USDC</div>
                    <div>• Max Slippage: 0.5%</div>
                    <div>• Status: Ready for your review & approval</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input placeholder */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled
                  placeholder="Connect wallet above to interact with UniPilot (AI active in Phase 2)..."
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-800 px-4 py-3 text-xs text-slate-400 placeholder-slate-600 cursor-not-allowed focus:outline-none"
                />
                <button
                  disabled
                  className="absolute right-2 p-1.5 rounded-lg bg-purple-900/40 text-purple-400 opacity-50 cursor-not-allowed"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

