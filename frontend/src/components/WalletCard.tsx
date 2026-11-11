"use client";

import { useAccount, useBalance } from "wagmi";
import { unichainSepolia } from "@/lib/web3/chains";
import { Wallet, ExternalLink, Coins, ShieldCheck, ArrowUpRight } from "lucide-react";

export function WalletCard() {
  const { address, isConnected, chain } = useAccount();

  const { data: balance, isLoading: isBalanceLoading, refetch } = useBalance({
    address,
    chainId: unichainSepolia.id,
  });

  if (!isConnected || !address) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 text-center shadow-xl">
        <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-800/50 flex items-center justify-center mx-auto mb-4 text-purple-400">
          <Wallet className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100 mb-1">Wallet Disconnected</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          Connect your MetaMask wallet to view real-time Unichain Sepolia testnet balances and prepare conversational AI swaps.
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Strict User-Approval Security Model</span>
        </div>
      </div>
    );
  }

  const formattedBalance = balance
    ? Number(balance.formatted).toFixed(4)
    : "0.0000";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Connected Wallet
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm text-slate-200">
              {address}
            </span>
            <a
              href={`https://sepolia.uniscan.xyz/address/${address}`}
              target="_blank"
              rel="noreferrer"
              title="View on Uniscan Explorer"
              className="text-slate-400 hover:text-purple-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-slate-300">
            Chain ID: {chain?.id ?? unichainSepolia.id}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Native ETH Balance */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Coins className="w-3.5 h-3.5 text-purple-400" />
              <span>Unichain Native ETH</span>
            </span>
            <button
              onClick={() => refetch()}
              className="text-[11px] text-purple-400 hover:underline"
            >
              Refresh
            </button>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {isBalanceLoading ? (
              <span className="text-slate-500 text-lg">Loading...</span>
            ) : (
              `${formattedBalance} ETH`
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Gas and native swap currency on Unichain Sepolia
          </p>
        </div>

        {/* Network & Bridge Links */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Need Testnet Funds?
            </span>
            <p className="text-[11px] text-slate-400">
              Obtain Sepolia testnet ETH from official faucets to test swaps and gas simulation.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <a
              href="https://sepolia.uniscan.xyz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Uniscan Explorer</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

