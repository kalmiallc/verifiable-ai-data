export function getCurrentTime() {
  return Math.floor(new Date().getTime() / 1000);
}

/**
 *
 * @param address
 * @returns
 */
export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function sleep(timeMs = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeMs));
}

export function delay(fn: Function, delay = 500) {
  setTimeout(fn, delay);
}

export const placeholderPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88x8AAv0B/cfFKfIAAAAASUVORK5CYII=';

export function areArraysEqual(a1: any, a2: any, sorted = false) {
  if (!a1 || !a2 || !Array.isArray(a1) || !Array.isArray(a2) || a1.length !== a2.length) {
    return false;
  }

  if (sorted) {
    a1 = [...a1].sort();
    a2 = [...a2].sort();
  }

  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }

  return true;
}

/** Copy text to clipboard */
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      if (!window.$message) return;
      /* Resolved - text copied to clipboard successfully */
      if (window.$i18n?.te('dashboard.clipboard.copied')) {
        window.$message.success(window.$i18n.t('dashboard.clipboard.copied'));
      } else {
        window.$message.success('Text has been copied to clipboard');
      }
    },
    () => {
      if (!window.$message) return;
      /* Rejected - text failed to copy to the clipboard */
      if (window.$i18n?.te('dashboard.clipboard.error')) {
        window.$message.warning(window.$i18n.t('dashboard.clipboard.error'));
      } else {
        window.$message.warning('Failed to copy');
      }
    }
  );
}

export function copyToClipboardWithResponseTexts(text: string, successMsg?: string, errorMsg?: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      /* Resolved - text copied to clipboard successfully */
      if (successMsg) {
        window.$message.success(successMsg);
      } else {
        window.$message.success('Text has been copied to clipboard');
      }
    },
    () => {
      /* Rejected - text failed to copy to the clipboard */
      if (errorMsg) {
        window.$message.warning(errorMsg);
      } else {
        window.$message.warning('Failed to copy');
      }
    }
  );
}

export function formatPrice(price: number, currency = 'usd') {
  const decimals = Math.ceil(price) === price ? 0 : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
  }).format(price);
}
