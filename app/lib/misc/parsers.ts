/**
 * Parses an input value to a valid integer number.
 * @param input Numeric value.
 */
export function parseToInt(input: any) {
  const value = parseInt(input);

  if (isNaN(value) || !isFinite(value)) {
    throw new Error(`Invalid integer number ${value}`);
  }
  return value;
}

export function formatSeconds(sec: string) {
  let seconds = sec || 0;
  seconds = Number(seconds);
  seconds = Math.abs(seconds);

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [] as string[];

  if (d > 0) {
    parts.push(d + ' day' + (d > 1 ? 's' : ''));
  }

  if (h > 0) {
    parts.push(h + ' hour' + (h > 1 ? 's' : ''));
  }

  if (m > 0 && parts.length < 2) {
    parts.push(m + ' minute' + (m > 1 ? 's' : ''));
  }

  if (s > 0 && parts.length < 2) {
    parts.push(s + ' second' + (s > 1 ? 's' : ''));
  }

  return parts.join(', ');
}
