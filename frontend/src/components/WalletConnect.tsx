"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut, Copy, Check, Loader2 } from "lucide-react";

export function WalletConnect() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    // Find MetaMask or injected connector
    const injectedConnector =
      connectors.find((c) => c.id === "metaMask") ||
      connectors.find((c) => c.type === "injected") ||
      connectors[0];

    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  if (isConnecting || isPending) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/50 border border-purple-500/50 text-sm font-medium text-white cursor-not-allowed"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Connecting...</span>
      </button>
    );
  }

  if (isConnected && address) {
    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 pr-2">
        <button
          onClick={handleCopy}
          title="Copy address"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs font-mono text-slate-200 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{truncatedAddress}</span>
        </button>
        <button
          onClick={() => disconnect()}
          title="Disconnect wallet"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-purple-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect MetaMask</span>
    </button>
  );
}

