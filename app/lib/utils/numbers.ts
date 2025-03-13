export const randomNumbers = (count: number): number => {
  return Math.floor(Math.random() * 10 ** count);
};

export const randomBigInt = (count: number): bigint => {
  return BigInt(Math.floor(Math.random() * 10 ** count));
};

/**
 *  Format numbers
 */
export function numToBigInt(input: number) {
  return BigInt(input * 10 ** 18);
}

export function bigIntToNum(input: bigint | string | number, decimals: number = 18) {
  return Number(BigInt(input) / 10n ** BigInt(decimals));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * min/max inclusive
 */
export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isNumeric(n: any): n is number | string {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function intVal(n: number | string): number {
  return typeof n === 'number' ? n : parseInt(n, 10);
}

/**
 * To fixed and back to number to remove decimal when 0. eg 10.00 -> 10
 */
export function getFixed(num: number | string, places = 2, round = false, roundToDecimals = false) {
  if (!num) {
    num = 0;
  }

  if (typeof num !== 'number') {
    num = parseFloat(num);
  }

  if (roundToDecimals) {
    num = Math.floor(num * 10 * Math.pow(10, places)) / (10 * Math.pow(10, places));
  } else if (round) {
    return Math.round(num);
  }

  if (!places) {
    places = 0;
  }

  return parseFloat(num.toFixed(places));
}

export function formatTokenAmount(num: number, decimals: number = 4) {
  return formatNumber(+(num / 10 ** 6).toFixed(decimals));
}
