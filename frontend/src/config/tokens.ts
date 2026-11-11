import { getAddress, isAddress, type Address } from "viem";
import { unichainSepolia } from "@/lib/web3/chains";

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  isNative: boolean;
  /** Contract address for ERC-20 tokens; null for native ETH */
  address: Address | null;
}

/**
 * Verified token registry for Unichain Sepolia Testnet (Chain ID 1301).
 * Addresses sourced from official Uniswap & Circle Unichain Sepolia documentation.
 */
export const UNICHAIN_SEPOLIA_TOKENS: Record<string, TokenInfo> = {
  ETH: {
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
    chainId: unichainSepolia.id,
    isNative: true,
    address: null,
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    chainId: unichainSepolia.id,
    isNative: false,
    address: getAddress("0x4200000000000000000000000000000000000006"),
  },
  USDC: {
    symbol: "USDC",
    name: "USDC",
    decimals: 6,
    chainId: unichainSepolia.id,
    isNative: false,
    address: getAddress("0x31d0220469e10c4E71834a79b1f276d740d3768F"),
  },
};

export const VERIFIED_ERC20_TOKENS: TokenInfo[] = Object.values(
  UNICHAIN_SEPOLIA_TOKENS
).filter((token) => !token.isNative && token.address !== null);

/**
 * Finds a verified token in the registry by symbol (case-insensitive) or address.
 */
export function findVerifiedToken(symbolOrAddress: string): TokenInfo | null {
  const query = symbolOrAddress.trim();
  if (!query) return null;

  const upperSymbol = query.toUpperCase();
  if (UNICHAIN_SEPOLIA_TOKENS[upperSymbol]) {
    return UNICHAIN_SEPOLIA_TOKENS[upperSymbol];
  }

  if (isAddress(query)) {
    const normalized = getAddress(query);
    return (
      Object.values(UNICHAIN_SEPOLIA_TOKENS).find(
        (token) => token.address !== null && token.address === normalized
      ) ?? null
    );
  }

  return null;
}

/**
 * Checks whether an address belongs to the verified ERC-20 token registry.
 */
export function isVerifiedTokenAddress(address: string): boolean {
  if (!isAddress(address)) return false;
  const normalized = getAddress(address);
  return VERIFIED_ERC20_TOKENS.some((token) => token.address === normalized);
}

