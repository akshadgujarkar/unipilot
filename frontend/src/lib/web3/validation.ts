import { formatGwei, getAddress, isAddress, type Address } from "viem";
import { unichainSepolia } from "./chains";
import { unichainPublicClient } from "./clients";

export interface ChainValidationResult {
  isValid: boolean;
  expectedChainId: number;
  expectedChainName: string;
  actualChainId: number | null;
  message: string;
}

export interface NetworkStatusResult {
  chainId: number;
  network: string;
  isTestnet: boolean;
  blockNumber: string;
  gasPriceWei: string;
  gasPriceGwei: string;
  explorerUrl: string;
  walletChainValidation: ChainValidationResult;
}

/**
 * Validates an EVM wallet or contract address and returns its EIP-55 checksummed form.
 */
export function validateEvmAddress(
  rawAddress: string,
  label = "address"
): Address {
  const trimmed = rawAddress.trim();
  if (!isAddress(trimmed)) {
    throw new Error(`Invalid EVM ${label}: "${rawAddress}"`);
  }
  return getAddress(trimmed);
}

/**
 * Validates that a connected wallet's chain ID matches Unichain Sepolia (1301).
 */
export function validateTargetChain(
  connectedChainId?: number | null
): ChainValidationResult {
  if (connectedChainId === undefined || connectedChainId === null) {
    return {
      isValid: false,
      expectedChainId: unichainSepolia.id,
      expectedChainName: unichainSepolia.name,
      actualChainId: null,
      message: `No connected wallet chain ID provided. Expected ${unichainSepolia.name} (${unichainSepolia.id}).`,
    };
  }

  const isValid = connectedChainId === unichainSepolia.id;
  return {
    isValid,
    expectedChainId: unichainSepolia.id,
    expectedChainName: unichainSepolia.name,
    actualChainId: connectedChainId,
    message: isValid
      ? `Connected to ${unichainSepolia.name} (Chain ID ${unichainSepolia.id}).`
      : `Wrong network detected (Chain ID ${connectedChainId}). Please switch to ${unichainSepolia.name} (Chain ID ${unichainSepolia.id}).`,
  };
}

/**
 * Reads live Unichain Sepolia network telemetry (block height & gas price)
 * and evaluates connected chain validity.
 */
export async function getNetworkStatus(
  connectedChainId?: number | null
): Promise<NetworkStatusResult> {
  const [blockNumber, gasPriceWei] = await Promise.all([
    unichainPublicClient.getBlockNumber(),
    unichainPublicClient.getGasPrice(),
  ]);

  return {
    chainId: unichainSepolia.id,
    network: unichainSepolia.name,
    isTestnet: true,
    blockNumber: blockNumber.toString(),
    gasPriceWei: gasPriceWei.toString(),
    gasPriceGwei: formatGwei(gasPriceWei),
    explorerUrl: unichainSepolia.blockExplorers.default.url,
    walletChainValidation: validateTargetChain(connectedChainId),
  };
}

