<template>
  <n-form v-if="!isWalletRegister" ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Register password -->
    <n-form-item path="password" :label="$t('form.label.password', { length: 12 })" :label-props="{ for: 'password' }">
      <n-input
        v-model:value="formData.password"
        type="password"
        show-password-on="click"
        :input-props="{ id: 'password', autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.complexPassword')"
        @input="handlePasswordInput"
        @keydown.enter.prevent
      />
    </n-form-item>

    <!--  Register reenter password -->
    <n-form-item
      ref="rPasswordFormItemRef"
      path="reenteredPassword"
      :label="$t('form.label.confirmPassword')"
      :label-props="{ for: 'confirmPassword' }"
    >
      <n-input
        v-model:value="formData.reenteredPassword"
        :disabled="!formData.password"
        type="password"
        show-password-on="click"
        :input-props="{ id: 'confirmPassword', autocomplete: 'off' }"
        :placeholder="$t('form.placeholder.reenterPassword')"
      />
    </n-form-item>

    <!--  Register submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.proceed')" />
      <Btn type="primary" size="large" class="mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormItemInst, FormItemRule, FormRules, FormValidationError } from 'naive-ui';
import { ruleRequired } from '~/lib/misc/validation';

type FormRegister = {
  password: string | null;
  reenteredPassword: string | null;
};

const props = defineProps({
  resetPassword: { type: Boolean, default: false },
  token: { type: String, default: '' },
});
const emit = defineEmits(['submitSuccess']);

const { t } = useI18n();
const { query } = useRoute();
const message = useMessage();
const userStore = useUserStore();

const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);

const isWalletRegister = computed(() => query.walletLogin === 'true');

const formData = ref<FormRegister>({
  password: null,
  reenteredPassword: null,
});

const rules: FormRules = {
  password: [
    ruleRequired(t('validation.passwordRequired')),
    {
      min: 12,
      message: t('validation.passwordMinLength', { length: 12 }),
      trigger: ['input', 'blur'],
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: t('validation.passwordReenterRequired'),
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordSame,
      message: t('validation.passwordReenterSame'),
      trigger: ['blur', 'password-input'],
    },
  ],
};

onMounted(() => {
  if (isWalletRegister.value) {
    register();
  }
});

// Custom validations
function validatePasswordSame(_: FormItemRule, value: string): boolean {
  return value === formData.value.password;
}

function handlePasswordInput() {
  if (formData.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
  }
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.resetPassword) {
      await submitResetPassword();
    } else {
      await register();
    }
  });
}

/** Register (create new user) */
async function register() {
  loading.value = true;

  try {
    const res = await $api.post<RegisterResponse>('', {
      password: formData.value.password,
      token: props.token || query.token || userStore.jwt,
    });

    userStore.saveUser(res.data);
  } catch (error) {
    message.error(apiError(error));
  }
  loading.value = false;
}

/** Reset password (on page reset-password or in dashboard) */
async function submitResetPassword() {
  loading.value = true;

  try {
    const res = await $api.post<PasswordResetResponse>('', {
      password: formData.value.password,
      token: props.token || query.token || userStore.jwt,
    });

    if (res.data) {
      emit('submitSuccess');
    }
  } catch (error) {
    message.error(apiError(error));
  }
  loading.value = false;
}
</script>
