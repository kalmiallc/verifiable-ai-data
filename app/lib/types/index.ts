import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import type { ExportedGlobalComposer, Composer } from 'vue-i18n';
import type { LocaleObject } from '@nuxtjs/i18n';
import type { Address } from 'viem';
import type { DataTableSortState } from 'naive-ui';

export enum SqlModelStatus {
  DRAFT = 1,
  INCOMPLETE = 2,
  INACTIVE = 3,
  ACTIVE = 5,
  BLOCKED = 7,
  ARCHIVED = 8,
  DELETED = 9,
}

export enum ProfileTabs {
  PREDICTIONS = 'Predictions',
  ACTIVITIES = 'Activities',
}

declare global {
  type Prefixed<T, Prefix extends string> = {
    [K in keyof T as `${Prefix}${Uncapitalize<string & K>}`]: T[K];
  };

  type Parameter = string | number | boolean | Address;

  type KeyValue = {
    key: string | number;
    value: string | number;
  };

  type i18nType = ExportedGlobalComposer & Composer<LocaleObject[]>;

  /**
   * Window
   */
  interface Window {
    $message: MessageApiInjection;
    $i18n: i18nType;
    _paq: Array<String[]>;
  }

  /**
   * General Interfaces
   */
  interface GeneralInterface {
    id: number;
    status: number;
    createTime: string;
    updateTime: string;
  }
  interface BaseObjectInterface extends GeneralInterface {
    name: string;
    description: string | null;
  }

  /**
   * Base responses
   */
  type GeneralResponse<T> = {
    data: T;
    id: string;
    status: number;
  };
  type GeneralItemsResponse<T> = {
    data: {
      items: Array<T>;
      total: number;
      page: number;
      limit: number;
    };
    id: string;
    status: number;
  };
  type SuccessResponse = GeneralResponse<{ success: boolean }>;

  interface DeleteResponse {
    data: boolean;
    status: number;
  }

  type FetchParams = {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    loader?: boolean;
    status?: SqlModelStatus;
    sorter?: DataTableSortState;
  } & Record<string, Parameter | undefined | any>;
}
