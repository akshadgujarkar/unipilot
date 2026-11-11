import { erc20Abi, formatUnits, type Address } from "viem";
import {
  findVerifiedToken,
  isVerifiedTokenAddress,
  VERIFIED_ERC20_TOKENS,
} from "@/config/tokens";
import { unichainSepolia } from "./chains";
import { unichainPublicClient } from "./clients";
import { validateEvmAddress } from "./validation";

export interface TokenMetadataResult {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupplyRaw: string;
  totalSupplyFormatted: string;
  isVerified: boolean;
  chainId: number;
  network: string;
  isTestnet: boolean;
  explorerUrl: string;
}

export interface TokenBalanceResult {
  walletAddress: Address;
  tokenAddress: Address;
  symbol: string;
  name: string;
  decimals: number;
  balanceRaw: string;
  balanceFormatted: string;
  isVerified: boolean;
  chainId: number;
  network: string;
  isTestnet: boolean;
  explorerUrl: string;
}

/**
 * Resolves a verified symbol (e.g. "USDC", "WETH") or raw EVM address into an ERC-20 contract address.
 */
export function resolveErc20Address(tokenInput: string): Address {
  const verified = findVerifiedToken(tokenInput);
  if (verified) {
    if (verified.isNative || !verified.address) {
      throw new Error(
        `"${verified.symbol}" is the native gas token on ${unichainSepolia.name}. Use getWalletBalance for native ETH or specify "WETH" for Wrapped Ether.`
      );
    }
    return verified.address;
  }

  const supportedSymbols = VERIFIED_ERC20_TOKENS.map((t) => t.symbol).join(", ");
  try {
    return validateEvmAddress(tokenInput, "token address");
  } catch {
    throw new Error(
      `Unrecognized token "${tokenInput}". Provide a valid 0x ERC-20 contract address or a verified Unichain Sepolia symbol (${supportedSymbols}).`
    );
  }
}

/**
 * Ensures the target address has deployed smart-contract bytecode on Unichain Sepolia.
 */
async function ensureContractDeployed(address: Address): Promise<void> {
  const bytecode = await unichainPublicClient.getCode({ address });
  if (!bytecode || bytecode === "0x") {
    throw new Error(
      `No smart contract found at ${address} on ${unichainSepolia.name} (Chain ID ${unichainSepolia.id}).`
    );
  }
}

/**
 * Reads on-chain ERC-20 metadata (name, symbol, decimals, totalSupply) from Unichain Sepolia.
 */
export async function getTokenMetadata(
  tokenInput: string
): Promise<TokenMetadataResult> {
  const address = resolveErc20Address(tokenInput);
  await ensureContractDeployed(address);

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    unichainPublicClient.readContract({
      address,
      abi: erc20Abi,
      functionName: "name",
    }),
    unichainPublicClient.readContract({
      address,
      abi: erc20Abi,
      functionName: "symbol",
    }),
    unichainPublicClient.readContract({
      address,
      abi: erc20Abi,
      functionName: "decimals",
    }),
    unichainPublicClient.readContract({
      address,
      abi: erc20Abi,
      functionName: "totalSupply",
    }),
  ]);

  return {
    address,
    name,
    symbol,
    decimals,
    totalSupplyRaw: totalSupply.toString(),
    totalSupplyFormatted: formatUnits(totalSupply, decimals),
    isVerified: isVerifiedTokenAddress(address),
    chainId: unichainSepolia.id,
    network: unichainSepolia.name,
    isTestnet: true,
    explorerUrl: `${unichainSepolia.blockExplorers.default.url}/token/${address}`,
  };
}

/**
 * Reads the ERC-20 balance and metadata for a wallet on Unichain Sepolia.
 */
export async function getTokenBalance(
  rawWalletAddress: string,
  tokenInput: string
): Promise<TokenBalanceResult> {
  const walletAddress = validateEvmAddress(rawWalletAddress, "wallet address");
  const metadata = await getTokenMetadata(tokenInput);

  const rawBalance = await unichainPublicClient.readContract({
    address: metadata.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [walletAddress],
  });

  return {
    walletAddress,
    tokenAddress: metadata.address,
    symbol: metadata.symbol,
    name: metadata.name,
    decimals: metadata.decimals,
    balanceRaw: rawBalance.toString(),
    balanceFormatted: formatUnits(rawBalance, metadata.decimals),
    isVerified: metadata.isVerified,
    chainId: unichainSepolia.id,
    network: unichainSepolia.name,
    isTestnet: true,
    explorerUrl: `${unichainSepolia.blockExplorers.default.url}/token/${metadata.address}?a=${walletAddress}`,
  };
}

