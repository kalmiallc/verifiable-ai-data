import { useAccount } from '@wagmi/vue';
import { ContractType } from '~/lib/config/contracts';

export default function useVerifier() {
  const { initContract } = useContracts();
  const { isConnected } = useAccount();

  async function verify(answerId: string, question: string) {
    if (!isConnected.value) {
      return;
    }

    const contract = await initContract(ContractType.VERIFIER);
    const submitCost = await contract.read.submitCost();

    return await contract.write.submitAnswer([answerId, question], {
      value: submitCost,
    });
  }

  return {
    verify,
  };
}
