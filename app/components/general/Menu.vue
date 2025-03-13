<template>
  <div>
    <n-menu
      v-bind="$attrs"
      v-model:value="selectedMenu"
      :render-icon="renderMenuIcon"
      :render-label="renderMenuLabel"
      :render-extra="renderMenuExtra"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { MenuOption } from 'naive-ui';

const props = defineProps({
  sliceName: { type: Boolean, default: false },
});
const route = useRoute();
const selectedMenu = ref<string>(routeNameToKey(route.name?.toString() || ''));

/** Watch route name and refresh selected menu item */
const routeName = computed(() => {
  return route.name?.toString() || '';
});

watch(
  () => routeName.value,
  routeName => {
    selectedMenu.value = routeNameToKey(routeName?.toString() || '');
  }
);

function routeNameToKey(name: string) {
  return props.sliceName ? removeIdOrSlug(name) : name;
}

function removeIdOrSlug(text: string) {
  return text.replace(/(-id|-slug).*/g, '');
}

/**
 * Render functions
 */
function renderMenuLabel(option: MenuOption) {
  if ('disabled' in option && option.disabled) {
    return h('span', { class: 'text-body' }, { default: () => option.label as string });
  } else if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, () => option.label as string);
  } else if ('path' in option) {
    return h(resolveComponent('NuxtLink'), { to: { path: option.path } }, () => option.label as string);
  } else if ('to' in option) {
    return h(resolveComponent('NuxtLink'), { to: { name: option.to } }, () => option.label as string);
  }
  return h('span', { class: 'text' }, { default: () => option.label as string });
}

function renderMenuIcon(option: MenuOption) {
  if ('iconName' in option) {
    return h(resolveComponent('NuxtIcon'), { name: option.iconName, class: 'text-base mx-2' }, '');
  }
  return null;
}

function renderMenuExtra(_option: MenuOption) {
  return null;
}
</script>
