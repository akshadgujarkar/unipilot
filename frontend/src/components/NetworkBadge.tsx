"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { unichainSepolia } from "@/lib/web3/chains";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

export function NetworkBadge() {
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-slate-500" />
        <span>Target: Unichain Sepolia (1301)</span>
      </div>
    );
  }

  const isCorrectNetwork = chain?.id === unichainSepolia.id;

  if (isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/60 text-xs text-purple-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
        <span className="font-medium">Unichain Sepolia</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-700/80 text-xs text-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>Wrong Network ({chain?.name || `Chain ${chain?.id}`})</span>
      </div>
      <button
        onClick={() => switchChain({ chainId: unichainSepolia.id })}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-medium text-white transition-all shadow-sm"
      >
        <RefreshCw className={`w-3 h-3 ${isPending ? "animate-spin" : ""}`} />
        <span>Switch to Unichain</span>
      </button>
    </div>
  );
}

