import { getTokenBalance, getTokenMetadata } from "@/lib/web3/erc20";
import { getNetworkStatus } from "@/lib/web3/validation";
import { getWalletBalance } from "@/lib/web3/wallet";
import type { AgentContext } from "./prompts";
import {
  GetNetworkStatusArgsSchema,
  GetTokenBalanceArgsSchema,
  GetTokenMetadataArgsSchema,
  GetWalletBalanceArgsSchema,
} from "./tools";

export interface ExecutedToolCall {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
  success: boolean;
}

function buildValidationError(name: string, rawArgs: Record<string, unknown>, fieldErrors: unknown): ExecutedToolCall {
  return {
    name,
    args: rawArgs,
    success: false,
    result: {
      error: `Invalid arguments for ${name}`,
      details: fieldErrors,
    },
  };
}

/**
 * Validates model-generated tool arguments via Zod and dispatches execution
 * to the appropriate deterministic Web3 helper.
 */
export async function dispatchToolCall(
  name: string,
  rawArgs: Record<string, unknown> = {},
  context?: AgentContext
): Promise<ExecutedToolCall> {
  try {
    switch (name) {
      case "getWalletBalance": {
        const parsed = GetWalletBalanceArgsSchema.safeParse(rawArgs);
        if (!parsed.success) {
          return buildValidationError(name, rawArgs, parsed.error.flatten().fieldErrors);
        }
        const balanceResult = await getWalletBalance(parsed.data.address);
        return {
          name,
          args: { address: parsed.data.address },
          success: true,
          result: balanceResult,
        };
      }

      case "getTokenBalance": {
        const parsed = GetTokenBalanceArgsSchema.safeParse(rawArgs);
        if (!parsed.success) {
          return buildValidationError(name, rawArgs, parsed.error.flatten().fieldErrors);
        }
        const tokenBalance = await getTokenBalance(
          parsed.data.walletAddress,
          parsed.data.token
        );
        return {
          name,
          args: {
            walletAddress: parsed.data.walletAddress,
            token: parsed.data.token,
          },
          success: true,
          result: tokenBalance,
        };
      }

      case "getTokenMetadata": {
        const parsed = GetTokenMetadataArgsSchema.safeParse(rawArgs);
        if (!parsed.success) {
          return buildValidationError(name, rawArgs, parsed.error.flatten().fieldErrors);
        }
        const metadata = await getTokenMetadata(parsed.data.token);
        return {
          name,
          args: { token: parsed.data.token },
          success: true,
          result: metadata,
        };
      }

      case "getNetworkStatus": {
        const parsed = GetNetworkStatusArgsSchema.safeParse(rawArgs);
        if (!parsed.success) {
          return buildValidationError(name, rawArgs, parsed.error.flatten().fieldErrors);
        }
        // Prefer deterministic session chainId from connected wallet when present
        const chainIdToValidate = context?.chainId ?? parsed.data.connectedChainId;
        const status = await getNetworkStatus(chainIdToValidate);
        return {
          name,
          args: chainIdToValidate !== undefined ? { connectedChainId: chainIdToValidate } : {},
          success: true,
          result: status,
        };
      }

      default:
        return {
          name,
          args: rawArgs,
          success: false,
          result: {
            error: `Unknown or unsupported tool: "${name}"`,
          },
        };
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected tool execution error";
    return {
      name,
      args: rawArgs,
      success: false,
      result: { error: message },
    };
  }
}
