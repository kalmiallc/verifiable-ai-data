export function toHtmlNewlines(text: string, breaks = '<br/>') {
  if (!text) {
    return '';
  }

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\r?\n)|↵/g, breaks);
}

export function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function shortHash(val: string) {
  if (!val || val.length <= 10) {
    return val;
  }
  return `${val.slice(0, 6)}...${val.slice(-4)}`;
}

export function removeLastSlash(val: string) {
  return val.replace(/\/$/, '');
}

export function zeroPad(num: string | number, size = 2) {
  let nums = num.toString();
  while (nums.length < size) {
    nums = '0' + num;
  }
  return nums;
}

export function equalsIgnoreCase(str1?: string, str2?: string) {
  return (
    str1 &&
    str2 &&
    str1.localeCompare(str2, undefined, {
      sensitivity: 'base',
    }) === 0
  );
}

/**
 * Return values separated by dash. If values are same, return only one value
 */
export function getOneOrRange(val1: number | string, val2: number | string) {
  if (val1 === val2) {
    return val1;
  }
  return val1 + '-' + val2;
}

export function getCompactValue(value: number | string, decimals = 2) {
  if (typeof value === 'string') {
    value = +value;
  }

  if (isNaN(value)) {
    return value;
  }

  if (value > 1000000) {
    return `${getFixed(value / 1000000, 3, false, true)}M`;
  } else if (value > 10000) {
    return `${getFixed(value / 1000, 2, false, true)}K`;
  }

  return `${getFixed(value, decimals)}`;
}

export function truncateWallet(source: string, partLength: number = 4): string {
  return source && source.length > 9
    ? source.slice(0, partLength) + '…' + source.slice(source.length - partLength, source.length)
    : source;
}

export function truncateCid(source: string, partLength: number = 4): string {
  return source && source.length > 9 ? source.slice(0, partLength) + '…' : source;
}

export function hideSecret(source: string, partLength: number = 4): string {
  return source && source.length > partLength
    ? '•'.repeat(source.length - partLength) + source.slice(source.length - partLength, source.length)
    : source;
}

export function toStr(s?: any) {
  return s ? s.toString() : '';
}

/** Read file content */
export const readFileContent = file => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
};
