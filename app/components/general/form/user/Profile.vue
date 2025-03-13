<template>
  <n-form ref="formRef" class="w-full max-w-lg" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!--  Username -->
    <n-form-item path="name" :label="'Username'" :label-props="{ for: 'username' }">
      <n-input
        v-model:value="formData.username"
        :input-props="{ id: 'username' }"
        :placeholder="'Username'"
        :loading="loadingForm"
      />
    </n-form-item>

    <!--  Email -->
    <!-- <n-form-item path="email" :label="'Email address'" :label-props="{ for: 'email' }">
      <n-input
        v-model:value="formData.email"
        :input-props="{ id: 'email', type: 'email' }"
        :placeholder="$t('form.placeholder.email', { afna: '@' })"
        :loading="loadingForm"
      />
    </n-form-item> -->

    <!--  Submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" />
      <BasicButton class="mt-2" size="large" type="primary" :loading="loading || loadingForm" @click="handleSubmit">
        Save
      </BasicButton>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { ruleRequired } from '~/lib/misc/validation';
import Endpoints from '~/lib/values/endpoints';

type FormUserProfile = {
  username: string;
  // email: string;
};

const message = useMessage();
const { t } = useI18n();
const userStore = useUserStore();

const loading = ref<boolean>(false);
const loadingForm = ref<boolean>(true);
const formRef = ref<FormInst | null>(null);

const formData = ref<FormUserProfile>({
  username: userStore.user.username,
  // email: userStore.user.email,
});

const rules: FormRules = {
  name: [],
  email: [
    {
      type: 'email',
      message: t('validation.email'),
    },
    ruleRequired(t('validation.emailRequired')),
  ],
};

onMounted(async () => {
  await sleep(500);
  await Promise.all(Object.values(userStore.promises));

  // formData.value.email = userStore.user.email;
  loadingForm.value = false;
});

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      await updateUserProfile();
    }
  });
}
async function updateUserProfile() {
  loading.value = true;

  try {
    const res = await $api.put<UserProfileResponse>(Endpoints.userUpdate, formData.value);

    if (res.data) {
      userStore.saveUser(res.data);
      message.success(t('form.success.profile'));
    }
  } catch (error) {
    message.error(apiError(error));
  }
  loading.value = false;
}
</script>
