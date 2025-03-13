<template>
  <CardDark>
    <n-form ref="formRef" class="w-full max-w-lg" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
      <!--  Email -->
      <n-form-item path="email" :label="$t('form.label.email')" :label-props="{ for: 'email' }">
        <n-input
          v-model:value="formData.email"
          :input-props="{ id: 'email', type: 'email' }"
          :placeholder="$t('form.placeholder.email', { afna: '@' })"
          :loading="loading"
        />
      </n-form-item>

      <!--  Submit -->
      <n-form-item :show-label="false">
        <input type="submit" class="hidden" :value="$t('form.save')" />
        <Btn class="mt-2" size="large" type="primary" :loading="loading" @click="handleSubmit">
          {{ $t('form.save') }}
        </Btn>
      </n-form-item>
    </n-form>
  </CardDark>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { ruleRequired } from '~/lib/misc/validation';
import Endpoints from '~/lib/values/endpoints';

type FormUserProfile = {
  email: string;
};

const message = useMessage();
const { t } = useI18n();
const userStore = useUserStore();

const loading = ref<boolean>(true);
const formRef = ref<FormInst | null>(null);

const formData = ref<FormUserProfile>({
  email: userStore.user.email,
});

const rules: FormRules = {
  email: [
    ruleRequired(t('validation.emailRequired')),
    {
      type: 'email',
      message: t('validation.email'),
    },
  ],
};

onMounted(async () => {
  await sleep(200);
  await Promise.all(Object.values(userStore.promises));

  if (!formData.value.email) {
    formData.value.email = userStore.user.email;
  }
  loading.value = false;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      await updateEmail();
    }
  });
}
async function updateEmail() {
  loading.value = true;

  try {
    await $api.post<UserProfileResponse>(Endpoints.changeMailRequest, formData.value);

    message.success(t('form.success.emailChangeRequest'));
  } catch (error) {
    message.error(apiError(error));
  }
  loading.value = false;
}
</script>
