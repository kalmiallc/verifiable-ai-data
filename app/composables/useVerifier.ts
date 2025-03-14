import { useAccount } from '@wagmi/vue';
import { parseEther } from 'viem';
import { ContractType } from '~/lib/config/contracts';

export default function useVerifier() {
  const { initContract } = useContracts();
  const { isConnected } = useAccount();

  async function verify(answerId: string, question: string) {
    if (!isConnected.value) {
      return;
    }

    const contract = await initContract(ContractType.VERIFIER);
    return await contract.write.submitAnswer([answerId, question], {
      value: parseEther('0.0001'),
    });
  }

  return {
    verify,
  };
}
