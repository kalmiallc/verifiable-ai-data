<template>
  <n-radio-group name="table_switch" size="small">
    <n-radio-button class="" key="grid" :value="true">
      <span class="inline-block h-6 flex-cc">
        <NuxtIcon name="icon/grid" filled />
      </span>
    </n-radio-button>
    <n-radio-button class="flex-cc" key="table" :value="false">
      <span class="inline-block h-6 flex-cc">
        <NuxtIcon name="icon/menu" filled />
      </span>
    </n-radio-button>
  </n-radio-group>
</template>

<script lang="ts" setup></script>
