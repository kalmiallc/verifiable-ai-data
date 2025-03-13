<script lang="ts" setup>
import type { BtnType } from './Btn.vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  done: { type: Boolean, default: false },
  step: { type: Number, default: 1 },
  hideAction: { type: Boolean, default: false },
  loadingAction: { type: Boolean, default: false },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  textAction: { type: String, default: 'Continue' },
  textLoading: { type: String, default: 'Waiting...' },
  textDone: { type: String, default: 'Done' },
});

defineEmits(['action']);

const buttonState = computed<{
  label: string;
  variant?: BtnType;
  class?: string;
}>(() => {
  if (props.done) {
    return {
      label: props.textDone,
      class: 'pointer-events-none',
    };
  }

  if (props.loading) {
    return {
      type: 'secondary',
      label: props.textLoading,
      class: 'pointer-events-none',
    };
  }

  return {
    label: props.textAction,
  };
});
</script>

<template>
  <div class="flex gap-4">
    <!-- Step number / checkmark -->
    <div class="flex-shrink-0 select-none">
      <span
        class="relative block h-[35px] w-[35px] rounded-full after:!rounded-full"
        :class="[done ? 'gradient-border-success' : 'gradient-border-default']"
      >
        <Icon v-if="loading" name="icon/spinner" size="38" class="absolute -left-px -top-px" filled />

        <span
          class="flex h-full w-full items-center justify-center rounded-full"
          :class="done ? $style.badgeDone : 'bg-black-one'"
        >
          <Icon v-if="done" name="icon/check" color="white" />
          <span v-else class="font-sans text-base">{{ step }}</span>
        </span>
      </span>
    </div>

    <div class="w-full">
      <!-- Title -->
      <h4 v-if="title" class="mb-1.5 mt-1 font-sans text-base font-bold" v-html="title"></h4>

      <!-- Description -->
      <p v-if="description" class="font-sans text-xs text-gray" v-html="description"></p>

      <slot />
      <div class="mt-4">
        <Btn
          v-show="!hideAction"
          v-bind="buttonState"
          :disabled="disabled || done"
          :loading="loadingAction"
          @click="$emit('action')"
        >
          {{ buttonState.label }}
        </Btn>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" module>
.badgeDone {
  background: radial-gradient(
    88.81% 88.81% at 8.58% -7.29%,
    #90ba94 0%,
    #4e8d53 10.42%,
    #2d7133 35.94%,
    #25572b 50.56%,
    #15301b 93.46%
  );
}
</style>
