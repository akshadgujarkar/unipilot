import { createPublicClient, http } from "viem";
import { unichainSepolia } from "./chains";

/**
 * Reusable read-only Viem public client connected to Unichain Sepolia (Chain ID 1301).
 */
export const unichainPublicClient = createPublicClient({
  chain: unichainSepolia,
  transport: http(
    process.env.NEXT_PUBLIC_UNICHAIN_SEPOLIA_RPC ||
      "https://sepolia.unichain.org"
  ),
});

