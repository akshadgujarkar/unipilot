"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useAccount } from "wagmi";
import {
  Bot,
  Send,
  Loader2,
  Wrench,
  AlertCircle,
  Sparkles,
  Trash2,
  User,
  CheckCircle2,
} from "lucide-react";

export interface ExecutedToolCall {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
  success: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ExecutedToolCall[];
  isError?: boolean;
}

const STARTER_PROMPTS = [
  "Check my ETH and USDC balances",
  "Get token metadata for USDC",
  "Check Unichain Sepolia network status",
];

export function ChatInterface() {
  const { address, chain, isConnected } = useAccount();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am UniPilot AI, your DeFi trading assistant on Unichain Sepolia. Connect your MetaMask wallet and ask me to check your live ETH balance or explore what we can do.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Send clean conversation history (excluding welcome/error UI placeholders if desired, or only user/assistant text)
      const payloadMessages = nextMessages
        .filter((m) => m.id !== "welcome" && !m.isError)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          walletAddress: isConnected ? address : undefined,
          chainId: isConnected ? chain?.id : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        toolCalls: Array.isArray(data.toolCalls) ? data.toolCalls : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to communicate with UniPilot AI.";
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Conversation cleared. Ask me to check your live Unichain Sepolia ETH balance anytime.",
      },
    ]);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Top Bar */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Gemini Agent Active</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {isConnected && address
              ? `Context: ${address.slice(0, 6)}...${address.slice(-4)}`
              : "No wallet linked"}
          </span>
        </div>
        <button
          onClick={handleClear}
          title="Clear conversation"
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.isError
                    ? "bg-red-950 border border-red-800 text-red-400"
                    : "bg-purple-600 text-white"
                }`}
              >
                {msg.isError ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
            )}

            <div className="max-w-[82%] space-y-2">
              {/* Tool call indicator badges */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.toolCalls.map((tc, idx) => (
                    <div
                      key={`${msg.id}-tool-${idx}`}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                        tc.success
                          ? "bg-purple-950/50 border-purple-800/60 text-purple-300"
                          : "bg-amber-950/50 border-amber-800/60 text-amber-300"
                      }`}
                    >
                      <Wrench className="w-3 h-3" />
                      <span>{tc.name}()</span>
                      {tc.success && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-purple-600/30 border border-purple-500/30 text-purple-50"
                    : msg.isError
                    ? "rounded-tl-sm bg-red-950/40 border border-red-800/60 text-red-200"
                    : "rounded-tl-sm bg-slate-800/70 border border-slate-700/60 text-slate-200"
                }`}
              >
                {msg.content}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-slate-800/60 border border-slate-700/60 px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>UniPilot is thinking & checking on-chain data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts & Input */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => void sendMessage(prompt)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-purple-300 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-2.5 h-2.5 text-purple-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask UniPilot (e.g., Check my ETH balance on Unichain Sepolia)..."
            className="w-full rounded-xl bg-slate-950/90 border border-slate-800 focus:border-purple-500/70 pl-4 pr-12 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="absolute right-2 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

