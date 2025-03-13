<template>
  <n-form ref="formRef" class="inline" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Email - hidden if email provided by props -->
    <div class="mb-8" :class="{ 'absolute invisible': email }">
      <n-form-item path="email" :show-label="false" :show-feedback="false">
        <n-input
          v-model:value="formData.email"
          :input-props="{ type: 'email' }"
          :placeholder="$t('form.placeholder.email', { afna: '@' })"
          clearable
        />
      </n-form-item>
    </div>

    <!--  Btn submit -->
    <n-form-item :show-label="false">
      <Btn v-bind="$attrs" :loading="loading" @click="handleSubmit">
        <slot v-if="$slots.default"></slot>
        <span v-else>Reset Password</span>
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import Endpoints from '~/lib/values/endpoints';

type PasswordResetForm = {
  email: string;
  captcha?: any;
  refCode?: string;
};

const props = defineProps({
  email: { type: String, default: '' },
});

const { t } = useI18n();
const message = useMessage();

const loading = ref<boolean>(false);
const formRef = ref<FormInst | null>(null);
const formData = ref<PasswordResetForm>({
  email: props.email,
  captcha: null,
  refCode: undefined,
});

const rules: FormRules = {
  email: [
    {
      type: 'email',
      message: t('validation.email'),
    },
    {
      required: true,
      message: t('validation.emailRequired'),
    },
  ],
};

function handleSubmit(e: Event | MouseEvent | null) {
  e?.preventDefault();

  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || '')));
    } else if (!formData.value.captcha) {
      loading.value = true;
      // captchaInput.value.execute();
    } else {
      /** Request password change */
      await passwordChangeRequest();
    }
  });
}

async function passwordChangeRequest() {
  loading.value = true;
  try {
    const res = await $api.post<PasswordResetRequestResponse>(Endpoints.passwordResetRequest, formData.value);

    if (res.data) {
      message.success(t('form.success.requestPasswordChange'));
    }
  } catch (error) {
    message.error(apiError(error));
  }
  loading.value = false;
}

function onCaptchaVerify(token: string, eKey: string) {
  formData.value.captcha = { token, eKey };
  handleSubmit(null);
  loading.value = false;
}
</script>
