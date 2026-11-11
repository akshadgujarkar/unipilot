import { Type, type FunctionDeclaration } from "@google/genai";
import { isAddress } from "viem";
import { z } from "zod";

/**
 * Zod validation schema for getWalletBalance tool arguments.
 */
export const GetWalletBalanceArgsSchema = z.object({
  address: z
    .string()
    .trim()
    .refine((val) => isAddress(val), {
      message: "Must be a valid EVM 0x wallet address",
    }),
});

/**
 * Zod validation schema for getTokenBalance tool arguments.
 */
export const GetTokenBalanceArgsSchema = z.object({
  walletAddress: z
    .string()
    .trim()
    .refine((val) => isAddress(val), {
      message: "Must be a valid EVM 0x wallet address",
    }),
  token: z
    .string()
    .trim()
    .min(1, "Provide a token symbol (e.g. USDC, WETH) or 0x contract address"),
});

/**
 * Zod validation schema for getTokenMetadata tool arguments.
 */
export const GetTokenMetadataArgsSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "Provide a token symbol (e.g. USDC, WETH) or 0x contract address"),
});

/**
 * Zod validation schema for getNetworkStatus tool arguments.
 */
export const GetNetworkStatusArgsSchema = z.object({
  connectedChainId: z.number().int().positive().optional(),
});

export type GetWalletBalanceArgs = z.infer<typeof GetWalletBalanceArgsSchema>;
export type GetTokenBalanceArgs = z.infer<typeof GetTokenBalanceArgsSchema>;
export type GetTokenMetadataArgs = z.infer<typeof GetTokenMetadataArgsSchema>;
export type GetNetworkStatusArgs = z.infer<typeof GetNetworkStatusArgsSchema>;

export const getWalletBalanceDeclaration: FunctionDeclaration = {
  name: "getWalletBalance",
  description:
    "Retrieves the live native ETH balance of an EVM wallet address on the Unichain Sepolia Testnet (Chain ID 1301).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: {
        type: Type.STRING,
        description:
          "The 0x-prefixed EVM wallet address whose Unichain Sepolia ETH balance should be checked.",
      },
    },
    required: ["address"],
  },
};

export const getTokenBalanceDeclaration: FunctionDeclaration = {
  name: "getTokenBalance",
  description:
    "Retrieves the live ERC-20 token balance and token metadata for an EVM wallet address on Unichain Sepolia (1301). Accepts verified symbols (USDC, WETH) or a 0x ERC-20 contract address.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      walletAddress: {
        type: Type.STRING,
        description: "The 0x-prefixed EVM wallet address to check.",
      },
      token: {
        type: Type.STRING,
        description:
          "Token symbol (e.g. 'USDC', 'WETH') or 0x-prefixed ERC-20 contract address on Unichain Sepolia.",
      },
    },
    required: ["walletAddress", "token"],
  },
};

export const getTokenMetadataDeclaration: FunctionDeclaration = {
  name: "getTokenMetadata",
  description:
    "Reads live on-chain ERC-20 token metadata (name, symbol, decimals, totalSupply) and verification status on Unichain Sepolia (1301). Accepts verified symbols (USDC, WETH) or a 0x ERC-20 contract address.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      token: {
        type: Type.STRING,
        description:
          "Token symbol (e.g. 'USDC', 'WETH') or 0x-prefixed ERC-20 contract address on Unichain Sepolia.",
      },
    },
    required: ["token"],
  },
};

export const getNetworkStatusDeclaration: FunctionDeclaration = {
  name: "getNetworkStatus",
  description:
    "Retrieves live Unichain Sepolia blockchain telemetry (latest block number, gas price in Gwei) and validates whether the connected wallet chain ID matches Unichain Sepolia (1301).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      connectedChainId: {
        type: Type.INTEGER,
        description:
          "Optional chain ID reported by the user's connected wallet for validation against 1301.",
      },
    },
  },
};

export const AGENT_TOOLS: FunctionDeclaration[] = [
  getWalletBalanceDeclaration,
  getTokenBalanceDeclaration,
  getTokenMetadataDeclaration,
  getNetworkStatusDeclaration,
];
