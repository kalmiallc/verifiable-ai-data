/**
 * Error messages
 */
export function contractError(error: any) {
  if (!window.$i18n || !(window.$i18n instanceof Object) || !error) {
    if (error instanceof ReferenceError || error instanceof TypeError) {
      return error.message;
    }
    return error?.message.split(/\r?\n/).splice(0, 1).join() || 'Something went wrong, please try again later.';
  }

  if (error?.code !== 4001) {
    return contractErrorMsg(error);
  }
  return error?.code && window.$i18n.te(`error.contract.${error?.code}`)
    ? window.$i18n.t(`error.${error.message}`)
    : error.message.split(/\r?\n/).splice(0, 1).join();
}

function contractErrorMsg(e: any) {
  const errorData = e?.reason || e?.data?.message || e?.error?.data?.message || e?.error?.message || e?.message || '';

  if (errorData.includes('insufficient funds')) {
    return 'Wallet account does not have enough funds.';
  } else if (errorData.includes('Purchase would exceed max supply')) {
    return 'Tokens depleted. You have requested too many or there is no more supply.';
  } else if (errorData.includes('Wallet already used')) {
    return 'Wallet already used. This token has a limit of mints per wallet.';
  } else if (errorData.includes('Only WL addresses allowed.')) {
    return 'Wallet not on whitelist. Only whitelisted wallet addresses are currently permitted.';
  } else if (errorData.includes('transfer caller is not owner nor approved')) {
    return 'Wallet has not been approved to use this functionality.';
  } else if (errorData.includes('Character with these traits already minted')) {
    return 'A character with selected traits has already been minted.';
  } else if (errorData.includes('valid recovery code')) {
    return 'Problem with embedded wallet';
  } else if (errorData.includes('rejected')) {
    return 'Transaction was rejected.';
  } else if (errorData.includes('Signature expired')) {
    return 'Transaction expired.';
  } else if (errorData.includes('Caller is not the owner of the token')) {
    return 'Wallet is not the owner of the chest.';
  } else if (errorData.includes('amount can be up to 10% of fundingAmountTotal')) {
    return 'Entered amount exceeds maximum';
  } else {
    return 'Blockchain error. Please retry or contact support if the issue persists.';
  }
}

export function apiError(error: ApiError | ReferenceError | TypeError | DOMException | any) {
  // Check error exists and if translation is included
  if (!window.$i18n || !(window.$i18n instanceof Object) || !error) {
    if (error instanceof ReferenceError || error instanceof TypeError) {
      return error.message;
    }
    return 'Internal server error';
  }

  // Check error type
  if (instanceOfApiError(error)) {
    // Beautify API error
    const err = error as ApiError;
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessages = err.errors.map(e => singleErrorMessage(window.$i18n, e.message, e.statusCode || e?.code));
      return [...new Set(errorMessages)].join('\n');
    } else if (err.message) {
      return singleErrorMessage(window.$i18n, err.message, err.code || err.status);
    }
  } else if (error instanceof ReferenceError || error instanceof TypeError) {
    return window.$i18n.te(`error.${error.message}`) ? window.$i18n.t(`error.${error.message}`) : error.message;
  }

  return 'Unknown error';
}

/** Translate single error message */
function singleErrorMessage($i18n: i18nType, message: string, statusCode: number = 0) {
  const code = takeFirstDigitsFromNumber(statusCode);
  if ($i18n.te(`error.${message}`)) {
    return $i18n.t(`error.${message}`);
  } else if ($i18n.te(`error.${statusCode}`)) {
    return $i18n.t(`error.${statusCode}`);
  } else if (code >= 500) {
    return $i18n.t('error.DEFAULT_SYSTEM_ERROR');
  } else if (code >= 400) {
    return $i18n.t('error.BAD_REQUEST');
  }
  return 'Unknown error';
}

/** Check if object is instance of ApiError  */
function instanceOfApiError(object: any): object is ApiError {
  return ('code' in object || 'status' in object) && ('errors' in object || 'message' in object);
}

/** statusCode to HTTP code */
function takeFirstDigitsFromNumber(num: number, numOfDigits: number = 3): number {
  return parseInt(String(num).slice(0, numOfDigits));
}
