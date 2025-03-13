export const MINUTE_IN_MS = 60 * 1000; // 1 minute
export const DAY_IN_SECONDS = 24 * 3600; // 1 day
export const MONTH_IN_SECONDS = 30 * 24 * 3600; // 1 month
export const YEAR_SECONDS = 365 * 24 * 3600; // 1 year

export const CACHE_EXPIRATION_IN_MS = 10 * 60 * 1000; // 10 minutes
export const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000; // 1 week in MS
export const ON_CLICK_OPEN = 'onClickOpen';
export const ALL_ITEMS_KEY = 'all';
export const NFT_MAX_SUPPLY = 10000;
export const PAGINATION_LIMIT = 20;
export const PARAMS_ALL_ITEMS = {
  page: 1,
  limit: 1000,
};

export enum PageSize {
  SM = 10,
  BASE = PAGINATION_LIMIT,
  LG = 50,
}

export const WebStorageKeys = {
  USER_STORE: 'len_user_store',
  TX_STORE: 'len_tx_store',
};
export const LS_KEYS = {
  APP_VERSION: 'ignite_market_app_version',
};
