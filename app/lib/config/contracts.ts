import { VERIFIER_ABI } from './abi';

/**
 * Contract types.
 */
export enum ContractType {
  VERIFIER = 1,
}

/**
 * Gets contract ABI based on contract type.
 * @param contractType Contract type.
 * @returns Contract ABI.
 */
export function getContractAbi(contractType: ContractType): any {
  switch (contractType) {
    case ContractType.VERIFIER:
      return VERIFIER_ABI;

    default:
      return null;
  }
}
