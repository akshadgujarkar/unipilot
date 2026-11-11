import type { Metadata } from "next";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniPilot AI — DeFi Trading Assistant",
  description: "AI-powered DeFi trading assistant on Unichain Sepolia Testnet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0e14] text-slate-100 min-h-screen flex flex-col selection:bg-purple-500 selection:text-white antialiased">
        <Providers>
          <Header />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
            <p>UniPilot AI • Experimental DeFi Copilot on Unichain Sepolia (1301) • User-Approval Architecture</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

