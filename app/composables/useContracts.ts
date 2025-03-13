import { useChainId, useChains, useConnectorClient, useSwitchChain } from '@wagmi/vue';
import type { Account, Address, Chain, Client, Transport } from 'viem';
import { createPublicClient, getContract, http } from 'viem';
import { ContractType, getContractAbi } from '~/lib/config/contracts';

const contracts = reactive<{ [key: string]: any }>({});
const readContracts = reactive<{ [key: string]: any }>({});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const publicClients = reactive<Record<number, Client<Transport, Chain | undefined, Account | undefined>>>({});

export default function useContracts() {
  const { switchChain } = useSwitchChain();
  const { data: walletClient, refetch } = useConnectorClient();
  const config = useRuntimeConfig();
  const chainId = useChainId();
  const chains = useChains();

  const activeChain = computed(() => chains.value.find(chain => chain.id === chainId.value)) || chains[0];
  const publicClient = createPublicClient({
    chain: activeChain.value,
    transport: http(),
  });

  /**
   *
   * @param contractType
   * @param chainId
   * @returns
   */
  function initReadContract(contractType: ContractType) {
    const address = getContractAddress(contractType);
    if (!address) {
      throw new Error('Address not valid!');
    }

    if (!(address in readContracts)) {
      readContracts[address] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: publicClient,
      });
    }

    return readContracts[address];
  }

  /**
   *
   * @param contractType
   * @returns
   */
  async function initContract(contractType: ContractType) {
    if (!walletClient.value) {
      await refetch();
      await sleep(200);
    }

    if (!walletClient.value) {
      throw new Error('Wallet client not available!');
    }

    const address = getContractAddress(contractType);
    if (!address) {
      throw new Error('Address not valid!');
    }

    if (!(address in contracts)) {
      contracts[address] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: {
          wallet: walletClient.value,
          public: publicClient,
        },
      });
    }

    return contracts[address];
  }

  /**
   *
   * @param retry
   */
  async function ensureCorrectNetwork(retry: number = 0) {
    const desiredChainId = chains.value[0].id;

    switchChain({ chainId: desiredChainId });
    await sleep(100);
    await refetch();
    await sleep(100);

    if (desiredChainId !== chainId.value) {
      if (retry > 5) {
        throw new Error('Failed to switch chain!');
      }
      await sleep(100);
      await ensureCorrectNetwork(retry + 1);
    }
  }

  function resetContracts() {
    Object.keys(contracts).forEach(key => {
      delete contracts[key];
    });
  }

  function getContractAddress(type: ContractType): Address | undefined {
    switch (type) {
      case ContractType.VERIFIER:
        return config.public.VERIFIER_CONTRACT as Address;
    }

    return undefined;
  }

  return {
    contracts,
    activeChain,
    initContract,
    ensureCorrectNetwork,
    getContractAddress,
    initReadContract,
    resetContracts,
  };
}
