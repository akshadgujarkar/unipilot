import { defineChain } from "viem";

/**
 * Official Unichain Sepolia Testnet specification
 * Chain ID: 1301
 * RPC: https://sepolia.unichain.org
 * Explorer: https://sepolia.uniscan.xyz
 */
export const unichainSepolia = defineChain({
  id: 1301,
  name: "Unichain Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_UNICHAIN_SEPOLIA_RPC ||
          "https://sepolia.unichain.org",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Uniscan",
      url: "https://sepolia.uniscan.xyz",
    },
  },
  testnet: true,
});

