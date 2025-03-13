<template>
  <n-input type="text" name="search" :placeholder="$t('general.search')" clearable :autosize="true">
    <template #prefix>
      <NuxtIcon name="icon/search" filled />
    </template>
  </n-input>
</template>

<script lang="ts" setup></script>
