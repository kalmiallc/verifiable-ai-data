<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : 'button'"
    v-bind="$attrs"
    :to="to"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    :class="btnClass"
    class=""
    @click="onClick"
  >
    <span v-if="loading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner :size="24" color="#000" />
    </span>
    <span class="inline-block break-keep leading-tight" :class="[innerClass, { 'opacity-0': loading }]">
      <slot />
    </span>
  </component>
</template>

<script lang="ts" setup>
export type BtnType = 'primary' | 'secondary' | 'gradient' | 'link' | 'error';
export type BtnSize = 'small' | 'medium' | 'large';

const props = defineProps({
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  btnClass: { type: [String, Array, Object], default: '' },
  innerClass: { type: [String, Array, Object], default: '' },
  type: { type: String as PropType<BtnType>, default: 'primary' },
  size: { type: String as PropType<BtnSize>, default: 'medium' },
});
const emit = defineEmits(['click']);

const NuxtLink = resolveComponent('NuxtLink');

const sizeClass = computed(() => {
  return props.size === 'small'
    ? 'min-h-10 px-2 py-1 text-sm tracking-[3px]'
    : props.size === 'medium'
      ? 'min-h-12 px-4 py-1 text-base tracking-[4px]'
      : 'min-h-12 px-7 py-1 text-base tracking-[4px]';
});

const btnClass = computed(() => {
  return [
    props.btnClass,
    {
      'pointer-events-none pointer-default': props.disabled || props.loading,
      [sizeClass.value]: props.type !== 'link',
      'font-heading uppercase font-semibold transition-colors duration-200': props.type !== 'link',
      'bg-gradientPurple text-white  hover:bg-none hover:bg-primary-dark transition-none':
        props.type === 'primary' && !props.disabled,
      'g-transparent text-primary border border-primary hover:bg-primary hover:text-white':
        props.type === 'secondary' && !props.disabled,
      'bg-gradientGreen bg-clip-text text-transparent': props.type === 'gradient',
      'text-center rounded-xl': props.type !== 'link',
      'hover:text-primary  !transition-all !duration-200': props.type === 'link',
      'bg-body-dark': props.type !== 'link' && props.disabled,
    },
  ];
});

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    emit('click', event);
  }
}
</script>
