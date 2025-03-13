import { useChainId, useWaitForTransactionReceipt } from '@wagmi/vue';
import type { Address } from 'viem';

/**
 * Usage:
 * const txWait = useTxWait();
 * txWait.hash.value = '';
 * await txWait.wait();
 */
export default function useTxWait() {
  const hash = ref<Address | undefined>(undefined);
  const chainId = useChainId();

  const { refetch } = useWaitForTransactionReceipt({
    chainId: chainId.value,
    confirmations: 3,
    hash,
  });

  async function wait() {
    await sleep(200);
    return await refetch();
  }

  return {
    hash,
    wait,
  };
}
