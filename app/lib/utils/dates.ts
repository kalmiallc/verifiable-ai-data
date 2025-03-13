/**
 *  Date and time functions
 */
import { DAY_IN_SECONDS, MONTH_IN_SECONDS, YEAR_SECONDS } from '../values/general.values';

/**
 * Time to days and hours and seconds.
 * @param time
 * @returns
 */
export function timeToDaysHoursSeconds(time: String): string {
  if (!time) return '';

  const [d, h, s] = time.split(':');
  if (!d || !h || !s) return `${time}`;

  const days = parseInt(d);
  const hours = parseInt(h);
  const seconds = parseInt(s);

  if (days > 1) {
    return `${days}d`;
  } else if (days > 0 && hours > 1) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${seconds}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return `${days}d ${hours}h ${seconds}s`;
  }
}

export function diffToDaysInDaysHoursMinutes(date: string) {
  const now = new Date();
  const end = new Date(date);
  const diffMs = Number(end) - Number(now);

  if (diffMs <= 0) {
    return '0d 0h 0min';
  }

  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}min`;
}

/**
 * Seconds to days and hours and seconds.
 * @param time
 * @returns
 */
export function secondsToHumanTime(time: number): string {
  const years = Math.floor(time / YEAR_SECONDS);
  const months = Math.floor((time % YEAR_SECONDS) / MONTH_IN_SECONDS);
  const days = Math.floor((time % MONTH_IN_SECONDS) / DAY_IN_SECONDS);
  const hours = Math.floor((time % DAY_IN_SECONDS) / 3600);
  const seconds = time % 3600;

  let result = '';
  if (years > 0) result += `${years}y `;
  if (months > 0) result += `${months}m `;
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (seconds > 0) result += `${seconds}s`;

  return result.trim();
}

/** DateTime to date: "2022-12-13T07:21:50.000Z" -> 13 Dec, 2022  */
export function dateTimeToTimestamp(dateTime: string): number {
  return new Date(dateTime).getTime();
}

/**
 *
 * @param dateTime
 * @returns
 */
export function dateTimeToDate(dateTime: string): string {
  if (!dateTime) return '';

  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-us', options);
}

/**
 *
 * @param dateTime
 * @returns
 */
export function dateTimeToDateAndTime(dateTime: string): string {
  if (!dateTime) return '';

  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleDateString('en-us', options);
}

/**
 * Timestamp in seconds to DateTime
 * @param timestamp
 * @returns
 */
export function timestampToDateAndTime(timestamp: number): string {
  if (!timestamp) return '';

  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleDateString('en-us', options);
}

/**
 *
 * @param dateString
 * @returns
 */
export function toMonthAndYear(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isDatePassedBy(dateTime: string): boolean {
  return dateTimeToTimestamp(dateTime) < Date.now();
}
export function isTimestampPassedBy(timestamp: number): boolean {
  return timestamp < Date.now();
}
export function isTimePassedBy(time: number): boolean {
  return time * 1000 < Date.now();
}
