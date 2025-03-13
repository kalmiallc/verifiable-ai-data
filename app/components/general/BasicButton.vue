<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : 'button'"
    v-bind="$attrs"
    :to="to"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    :class="btnClass"
    class="inline-block content-center"
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
  selected: { type: Boolean, default: false },
  selectedClass: { type: [String, Array, Object], default: '' },
});
const emit = defineEmits(['click']);

const NuxtLink = resolveComponent('NuxtLink');

const sizeClass = computed(() => {
  return props.size === 'small'
    ? 'min-h-[26px] px-2'
    : props.size === 'medium'
      ? 'min-h-[31px] px-4'
      : 'min-h-[36px] px-7';
});

const btnClass = computed(() => {
  const clsArray = [
    props.btnClass,
    {
      'pointer-events-none pointer-default': props.disabled || props.loading,
      [sizeClass.value]: props.type !== 'link',
      'font-medium text-[14px] leading-[20px] transition-colors duration-200 text-white ': props.type !== 'link',
      'bg-primary hover:bg-primary-hover transition-none': props.type === 'primary' && !props.disabled,
      'bg-primary/20 text-white border-1 border-primary hover:bg-primary hover:text-white':
        props.type === 'secondary' && !props.disabled,
      'bg-gradientGreen bg-clip-text text-transparent': props.type === 'gradient',
      'text-center rounded-[8px]': props.type !== 'link',
      'hover:text-green  !transition-all !duration-200': props.type === 'link',
      '!bg-body-dark': props.type !== 'link' && props.disabled,
    },
  ];

  if (props.selected) {
    clsArray.push(props.selectedClass);
  }

  return clsArray;
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
