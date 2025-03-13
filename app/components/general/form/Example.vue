<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item path="name" label="Name" :label-props="{ for: 'name' }">
      <n-input
        v-model:value="formData.name"
        :input-props="{ id: 'name' }"
        placeholder="Value"
        clearable
        @keydown.enter.prevent
      />
    </n-form-item>

    <n-form-item path="amount" label="Amount" :label-props="{ for: 'amount' }">
      <n-input-number
        v-model="formData.name"
        :input-props="{ id: 'amount' }"
        placeholder="Value"
        @keydown.enter.prevent
      />
    </n-form-item>

    <n-grid :cols="2" :x-gap="32">
      <n-form-item-gi path="percent" label="percent %" :label-props="{ for: 'percent' }">
        <n-slider
          v-model="formData.percent"
          :step="1"
          :min="0"
          :max="100"
          :format-tooltip="(value: number) => `${value}%`"
        />
      </n-form-item-gi>

      <n-form-item-gi path="range" label="range" :label-props="{ for: 'range' }">
        <n-space vertical>
          <n-slider v-model:value="formData.range" range :step="1" />
          <n-space>
            <n-input-number v-model:value="formData.range[0]" size="small" />
            <n-input-number v-model:value="formData.range[1]" size="small" />
          </n-space>
        </n-space>
      </n-form-item-gi>
    </n-grid>

    <!--  Project submit -->
    <n-form-item>
      <input type="submit" class="hidden" :value="'SUBMIT'" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit"> SUBMIT </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
// import Endpoints from '~/lib/values/endpoints';

type Form = {
  name: string | null;
  amount: number | null;
  percent: number | null;
  range: number[];
};

const { t } = useI18n();
const message = useMessage();

// const emit = defineEmits(['submitActive', 'submitSuccess', 'close']);

/** Form project */
const loading = ref(false);
const formRef = ref<FormInst | null>(null);

const formData = ref<Form>({
  name: null,
  amount: null,
  percent: null,
  range: [1, 19],
});

const rules: FormRules = {
  name: [
    {
      required: true,
      message: t('validation.nameRequired'),
      trigger: 'input',
    },
  ],
  description: [],
};

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      // await createProject();
    }
  });
}
// async function createProject() {
//   loading.value = true;
//   emit('submitActive', true);

//   try {
//     const res = await $api.post<CreateProjectResponse>('', formData.value);

//     if (res.data) {
//       /** Clear all stored data
//       clearAll(); */

//       /** Set new project as current project
//       dataStore.setCurrentProject(res.data.project_uuid); */

//       emit('submitSuccess');
//       emit('submitActive', false);
//     }
//   } catch (error) {
//     message.error(apiError(error));
//   }
//   loading.value = false;
//   emit('submitActive', false);
// }
</script>
