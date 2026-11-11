import { formatEther, type Address } from "viem";
import { unichainSepolia } from "./chains";
import { unichainPublicClient } from "./clients";
import { validateEvmAddress } from "./validation";

export interface WalletBalanceResult {
  address: Address;
  balanceWei: string;
  balanceEth: string;
  symbol: string;
  chainId: number;
  network: string;
  isTestnet: boolean;
  explorerUrl: string;
}

/**
 * Retrieves the live native ETH balance of an address on Unichain Sepolia.
 * Validates the EVM address format before issuing an RPC query.
 */
export async function getWalletBalance(
  rawAddress: string
): Promise<WalletBalanceResult> {
  const address = validateEvmAddress(rawAddress, "wallet address");
  const balanceWei = await unichainPublicClient.getBalance({ address });

  return {
    address,
    balanceWei: balanceWei.toString(),
    balanceEth: formatEther(balanceWei),
    symbol: unichainSepolia.nativeCurrency.symbol,
    chainId: unichainSepolia.id,
    network: unichainSepolia.name,
    isTestnet: true,
    explorerUrl: `${unichainSepolia.blockExplorers.default.url}/address/${address}`,
  };
}
