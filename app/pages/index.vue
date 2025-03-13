<template>
  <div class="flex items-center justify-center w-[100vw] h-[100vh]">
    <n-card class="bg-grey border-1 !border-grey-lighter w-[600px] h-[88vh]">
      <div
        v-if="verificationLoading"
        class="absolute opacity-60 w-full flex items-center justify-center h-full top-0 left-0 bg-grey-dark z-10 rounded-lg"
      >
        <Spinner />
      </div>
      <div class="flex flex-col h-full">
        <div ref="msgContainer" class="h-[76vh] overflow-y-scroll px-1">
          <div v-for="(message, idx) of messages" :key="idx">
            <div
              v-if="message.role === 'loading'"
              class="loading !border-grey-lighter border-1 w-[60px] px-4 rounded-lg mb-3 text-[25px] leading-none font-bold pb-3"
            ></div>
            <div v-else-if="message.role === 'user'" class="flex w-full">
              <div class="!border-grey-light border-1 ml-auto max-w-[70%] py-3 px-4 bg-grey-dark rounded-lg mb-3">
                {{ message.data }}
              </div>
            </div>
            <div v-else class="flex w-full">
              <div class="!border-grey-lighter border-1 max-w-[70%] p-4 rounded-lg mb-3">
                {{ message.data }}
                <div v-if="message.verified" class="flex w-full mt-3">
                  <div class="flex items-center justify-center p-0 m-0">
                    <div
                      class="font-bold rounded-[20px] py-[4px] px-[8px] text-[14px] leading-4 tracking-[0.04em] bg-statusGreen/20 text-statusGreen flex"
                    >
                      <NuxtIcon class="text-statusGreen text-[14px] mr-1 pt-[1px]" name="icon/complete" />
                      Verified
                    </div>
                  </div>
                  <div
                    v-if="message.txHash"
                    class="mr-[6px] px-1.5 border-1 bg-primary/20 border-primary rounded-[8px] hover:bg-primary ml-auto cursor-pointer"
                    @click="openExplorer(message.txHash)"
                  >
                    Transaction
                  </div>
                </div>
                <div v-else-if="!message.verified && message.source !== 'UNKNOWN'" class="flex w-full mt-3">
                  <div class="flex items-center justify-center p-0 m-0">
                    <div
                      class="font-bold rounded-[20px] py-[4px] px-[8px] text-[14px] leading-4 tracking-[0.04em] bg-statusRed/20 text-statusRed flex"
                    >
                      <NuxtIcon class="text-statusRed text-[14px] mr-1 pt-[1px]" name="icon/flag" />
                      Not verified
                    </div>
                  </div>
                  <div
                    class="mr-[6px] px-1.5 border-1 bg-primary/20 border-primary rounded-[8px] hover:bg-primary ml-auto cursor-pointer"
                    @click="startVerification(message, idx)"
                  >
                    Verify
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto">
          <n-input
            v-model:value="question"
            class="self-end"
            placeholder="Write your question"
            size="large"
            :disabled="questionLoading"
            :loading="questionLoading"
            :maxlength="500"
            @keyup.enter="askQuestion()"
          >
            <template #suffix>
              <NuxtIcon
                v-if="!questionLoading"
                class="text-white text-[20px] cursor-pointer"
                :class="{
                  '!cursor-default': !question,
                  '!opacity-70': !question,
                  'hover:text-primary-bright': question,
                }"
                name="icon/send"
                @click="askQuestion()"
              />
            </template>
          </n-input>
        </div>
      </div>
    </n-card>

    <modal v-model:show="modalWalletSelectVisible" class="w-[270px] border-none">
      <div class="flex flex-col">
        <div class="flex w-full items-center justify-center mb-2">
          <NuxtIcon name="wallet/injected" class="text-primary text-[40px]" />
        </div>
        <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Connect wallet</div>

        <div class="flex flex-col items-center justify-center mt-5 mb-3">
          <WalletEvm :loading="loadingWallet" />
        </div>
      </div>
    </modal>
  </div>

  <modal v-model:show="showSuccessModal" class="w-[320px] border-none">
    <div class="flex flex-col">
      <div class="flex w-full items-center justify-center mb-2">
        <NuxtIcon name="icon/check" class="text-primary text-[40px]" />
      </div>
      <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Success!</div>

      <div class="flex flex-col items-center justify-center mt-5">
        <div class="text-center">You have successfully verified this answer.</div>
      </div>

      <BasicButton
        v-if="transactionHash"
        class="w-full font-bold mt-5"
        :size="'large'"
        @click="openExplorer(transactionHash)"
      >
        Transaction
      </BasicButton>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { useAccount, useAccountEffect } from '@wagmi/vue';
import { flareTestnet } from 'viem/chains';
import Endpoints from '~/lib/values/endpoints';

const messageApi = useMessage();
const { isConnected } = useAccount();
const { verify } = useVerifier();
const { ensureCorrectNetwork } = useContracts();
const txWait = useTxWait();

useAccountEffect({
  onConnect: _data => addVerification(),
});

const messages = ref<any[]>([]);
const question = ref('');
const modalWalletSelectVisible = ref(false);
const questionLoading = ref(false);
const loadingWallet = ref(false);
const msgContainer = ref<HTMLDivElement>();
const selectedMessage = ref<any>({});
const selectedMessageIdx = ref<any>(null);
const verificationLoading = ref(false);
const showSuccessModal = ref(false);
const transactionHash = ref('');

async function startVerification(message: any, idx: number) {
  selectedMessage.value = message;
  selectedMessageIdx.value = idx;

  if (!isConnected.value) {
    modalWalletSelectVisible.value = true;
  } else {
    await addVerification();
  }
}

async function askQuestion() {
  if (!question.value) {
    return;
  }

  questionLoading.value = true;
  try {
    messages.value.push({ data: question.value, role: 'user' });
    messages.value.push({ data: '', role: 'loading' });

    setTimeout(() => {
      containerScroll(msgContainer.value?.scrollHeight, true);
    }, 10);

    const res = await $api.post<any>(Endpoints.chat, {
      question: question.value,
    });

    messages.value.pop();
    messages.value.push({ ...res, data: res.answer, role: 'ai' });

    setTimeout(() => {
      containerScroll(msgContainer.value?.scrollHeight, true);
    }, 10);

    question.value = '';
  } catch (error) {
    messages.value.pop();
    messages.value.pop();

    messageApi.error(error);
    console.log(error);
  } finally {
    questionLoading.value = false;
  }
}

function containerScroll(offset?: number, smooth = false) {
  if (msgContainer.value && offset) {
    if (smooth) {
      msgContainer.value.scrollTo({
        top: offset,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      msgContainer.value.scrollTo(0, offset);
    }
  }
}

async function addVerification() {
  modalWalletSelectVisible.value = false;

  verificationLoading.value = true;
  try {
    await ensureCorrectNetwork();

    txWait.hash.value = await verify(selectedMessage.value.hash, selectedMessage.value.question);
    const receipt = await txWait.wait();

    showSuccessModal.value = true;
    transactionHash.value = receipt?.data?.transactionHash || '';

    const res = await $api.post<any>(Endpoints.verify, {
      id: selectedMessage.value.id,
      txHash: transactionHash.value,
    });

    messages.value[selectedMessageIdx.value] = { ...res, data: res.answer, role: 'ai' };
  } catch (error) {
    console.error(error);
    messageApi.error(contractError(error));
  } finally {
    verificationLoading.value = false;
  }
}

function openExplorer(txHash: string) {
  const explorer = flareTestnet.blockExplorers.default.url;

  window.open(`${explorer}/tx/${txHash}`, '_blank');
}
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 1rem;
}

/* Handle */
::-webkit-scrollbar-thumb {
  cursor: pointer;
  background: #b14ab3;
  border-radius: 1rem;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  opacity: 0.7;
}

.loading::after {
  display: inline-block;
  animation: dotty steps(1, end) 1s infinite;
  content: '';
}

@keyframes dotty {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
  100% {
    content: '';
  }
}
</style>
