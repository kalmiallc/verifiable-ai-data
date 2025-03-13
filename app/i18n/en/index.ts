import error from './error.json';
import form from './form.json';
import general from './general.json';
import profile from './profile.json';
import validations from './validations.json';
import wallet from './wallet.json';

const messages = {
  ...error,
  ...form,
  ...general,
  ...profile,
  ...validations,
  ...wallet,
};
export default defineI18nLocale(() => messages);
