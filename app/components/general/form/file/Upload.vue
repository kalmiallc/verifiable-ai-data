<template>
  <div
    v-cloak
    class="min-h-48 w-full p-6 bg-bg-light border-2 border-dashed border-grey text-center cursor-pointer rounded-lg"
    :class="{ '!border-yellow': dragging }"
    @dragover.prevent
    @dragover="dragging = true"
    @dragleave="dragging = false"
    @click="selectFile"
    @drop.prevent="onFileDrag"
  >
    <div class="h-full flex-cc flex-col gap-2 text-white">
      <NuxtIcon name="icon/upload" class="icon-auto inline-block" filled />
      <h4 v-if="uploadedFile">{{ uploadedFile.name }}</h4>
      <h4 v-else>Upload file</h4>
    </div>

    <input ref="input" type="file" class="border-2 hidden" @change="onFileClick" :multiple="multiple" />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['file-uploaded']);
const props = defineProps({
  multiple: { type: Boolean, default: false },
});

const message = useMessage();
const uploadedFile = ref<File>();
const input = ref<HTMLInputElement | null>(null);
const dragging = ref<boolean | number>(false);

const selectFile = () => {
  input.value?.click();
};

const onFileDrag = (e: DragEvent) => {
  dragging.value = false;
  props.multiple ? processFiles(e.dataTransfer?.files) : processFile(e.dataTransfer?.files[0]);
};

const onFileClick = (e: Event) => {
  const target = e.target as HTMLInputElement;
  props.multiple ? processFiles(target.files) : processFile(target.files?.[0]);
};

const processFile = async (file?: File | null) => {
  console.log(file);
  if (!file) {
    message.warning('Please upload file');
    return;
  }

  uploadedFile.value = file;
  emit('file-uploaded', file);
};
const processFiles = async (files?: FileList | null) => {
  console.log(files);
};
</script>
