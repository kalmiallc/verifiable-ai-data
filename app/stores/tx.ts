import { defineStore } from 'pinia';
import { WebStorageKeys } from '~/lib/values/general.values';

export interface TransactionInterface {
  createdAt: number; // timestamp
  done: boolean;
  failed: boolean;
  hash: string;
  meta: {
    contract: string;
    ownerWallet: string;
    description?: string;
    misc?: any;
  };
}

export const useTxStore = defineStore('tx', {
  state: () => ({
    transactions: {} as { [k: string]: TransactionInterface },
    pending: [] as string[], // hashes
    usedProvider: null,
  }),

  getters: {
    recentTransactions(state) {
      return Object.values(state.transactions).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    },

    isPending(state) {
      return state.pending && state.pending.length;
    },

    pendingTransactions(state) {
      const pendingTxs = [];
      for (const pending of state.pending) {
        if (pending in state.transactions) {
          pendingTxs.push(state.transactions[pending]);
        }
      }
      console.log(pendingTxs);
      const txs = state.pending
        .filter(pending => pending in state.transactions)
        .map(pending => state.transactions[pending]);
      console.log(txs);
      return pendingTxs;
    },
  },

  actions: {
    /**
     * Add tx to state or update existing tx in state
     */
    upsert(payload: TransactionInterface, addListener = false) {
      this.transactions = {
        ...this.transactions,
        [payload.hash]: payload,
      };

      if (addListener) {
        this.check(payload.hash);
      }
    },

    removePending(hash: string) {
      this.pending = this.pending.filter(x => x !== hash);
    },

    removeTx(hash: string) {
      if (hash in this.transactions) {
        const transactions = { ...this.transactions };
        delete transactions[hash];
        this.transactions = transactions;
      }
    },

    /**
     * Check if transaction is already finalized in vuex.
     * If transaction is not finalized, check if it has been mined,
     * otherwise attach a listener to provider that updates when
     * the transaction is mined.
     */
    async check(hash: string) {
      if (!hash || !(hash in this.transactions) || !this.transactions[hash]) {
        return false;
      }

      const { provider } = this.usedProvider;

      if (provider) {
        const tx = this.transactions[hash];

        // Tx done/pending
        if (tx.done || this.pending.includes(hash)) {
          return true;
        }

        // After 15s (ensure tx gets listed), check if tx exists (could be overwritten by speed up)
        if (new Date().getTime() - tx.createdAt > 15000) {
          const txExists = await provider.getTransaction(hash);
          if (!txExists) {
            this.removePending(hash);
            this.removeTx(hash);
            return true;
          }
        }

        // Try to get receipt (only exists if tx mined)
        const receipt = await provider.getTransactionReceipt(hash);

        if (!receipt) {
          // Tx pending
          this.pending.push(hash);

          // Attach listener to provider
          provider.once(hash, ev => {
            const failed = ev && !isNaN(ev.status) && ev.status === 0;

            /**
             * Finalize transaction
             */
            this.upsert({ ...tx, done: true, failed });
            this.removePending(hash);
          });
        } else {
          if (!receipt.status) {
            // Tx failed
            this.upsert({
              ...tx,
              done: true,
              failed: true,
            });
          } else if (!tx.done) {
            // Tx successfully completed - finalize transaction
            this.upsert({ ...tx, done: true });
          }

          this.removePending(hash);
        }
      }

      return true;
    },

    /**
     * Initiate checks for all transactions - re-set listeners on page reload
     */
    checkAll() {
      for (const hash in this.transactions) {
        this.check(hash);
      }

      return true;
    },
  },

  persist: {
    key: WebStorageKeys.TX_STORE,
    storage: localStorage,
    paths: ['transactions'],
  },
});
