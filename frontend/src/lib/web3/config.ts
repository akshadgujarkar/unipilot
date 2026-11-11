import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { unichainSepolia } from "./chains";

export const config = createConfig({
  chains: [unichainSepolia],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [unichainSepolia.id]: http(
      process.env.NEXT_PUBLIC_UNICHAIN_SEPOLIA_RPC || "https://sepolia.unichain.org"
    ),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

