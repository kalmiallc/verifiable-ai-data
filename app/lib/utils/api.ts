import { stringify } from 'query-string';
import { removeLastSlash } from '../misc/strings';
import { UserError } from '../types/error';

export const APISettings = {
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }),
  basePath: removeLastSlash(getAppConfig().apiUrl),
};

class Api {
  async post<T>(path: string, data?: any) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'POST',
        body: data ? JSON.stringify(data) : null,
      })
    );
    return this.onResponse<T>(response);
  }

  async get<T>(path: string, query?: { [k: string]: Parameter | Array<Parameter> }, requestOptions?: RequestInit) {
    const q = !query ? '' : '?' + stringify(query, { arrayFormat: 'bracket' });
    const requestData = { method: 'GET', query: q };

    const response = await fetch(APISettings.basePath + path + q, this.onRequest(requestData, requestOptions));
    return this.onResponse<T>(response);
  }

  async put<T>(path: string, data?: any) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'PUT',
        body: data ? JSON.stringify(data) : null,
      })
    );
    return this.onResponse<T>(response);
  }

  async patch<T>(path: string, data?: any) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'PATCH',
        body: data ? JSON.stringify(data) : null,
      })
    );
    return this.onResponse<T>(response);
  }

  async delete<T>(path: string, data?: any) {
    const response = await fetch(
      APISettings.basePath + path,
      this.onRequest({
        method: 'DELETE',
        body: data ? JSON.stringify(data) : null,
        headers: APISettings.headers,
      })
    );
    return this.onResponse<T>(response);
  }

  setBaseUrl(baseUrl: string) {
    APISettings.basePath = baseUrl;
  }

  setToken(token: string) {
    APISettings.headers.set('Authorization', 'Bearer ' + token);
  }

  setFeToken() {
    APISettings.headers.set('x-fe-private-key', getAppConfig().FE_KEY);
  }

  setServerTokenToken(token: string) {
    APISettings.headers.set('x-server-token', token);
  }

  clearToken() {
    APISettings.headers.delete('Authorization');
  }

  backToLogin() {
    const userStore = useUserStore();
    userStore.logout();
    const router = useRouter();
    router.push('/');
  }

  preventForbiddenAccess() {
    // const router = useRouter();
    // router.push({ name: 'dashboard-error' });
  }

  onRequest(request: Request | any, requestOptions: RequestInit = {}) {
    const modifiedRequest = { ...request, ...requestOptions };

    modifiedRequest.headers = APISettings.headers;

    return modifiedRequest;
  }

  async onResponse<T>(response: Response) {
    if (response.status > 250) {
      const error: ApiError = await response.json();

      if (!error.code) {
        error.code = response.status;
      }

      /** Unauthorized or session expired */
      const loginMsgs: string[] = [
        UserError.INVALID_SIGNATURE,
        UserError.USER_INVALID_LOGIN,
        UserError.USER_IS_NOT_AUTHENTICATED,
      ];
      if (
        (response.status === 401 && !loginMsgs.includes(error.message || '')) ||
        (response.status === 500 && error.message === UserError.AUTH_TOKEN_EXPIRED) ||
        (response.status === 500 && error.message === UserError.INVALID_SIGNATURE) ||
        (response.status === 500 && error.message === 'invalid signature') ||
        (response.status === 500 && error.message === UserError.JWT_TOKEN_EXPIRED) ||
        (response.status === 400 && error.message === UserError.USER_DOES_NOT_EXISTS)
      ) {
        setTimeout(() => {
          this.backToLogin();
        }, 2000);
      } else if (response.status === 401) {
        const userStore = useUserStore();
        userStore.logout();
      } else if (response.status === 403) {
        this.preventForbiddenAccess();
      }

      throw error;
    }

    return (await response.json()) as T;
  }
}

export const $api = new Api();
