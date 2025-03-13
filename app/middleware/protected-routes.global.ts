import { removeLastSlash } from '~/lib/misc/strings';
import { useUserStore } from '~/stores/user';
interface ProtectedRouteInterface {
  path?: string;
  regex?: RegExp;
  redirect: string;
}
const protectedRoutes: Array<ProtectedRouteInterface> = [{ regex: /^\/dashboard/, redirect: '/login' }];

/**
 * Redirect user to landing page if not logged in and trying to access protected routes
 */
export default defineNuxtRouteMiddleware((to, _from) => {
  const decodedUrl = removeLastSlash(decodeURI(to.path));
  const userStore = useUserStore();

  /** Redirect protected routes */
  for (const protectedRoute of protectedRoutes) {
    if ((!protectedRoute.path && !protectedRoute.regex) || !protectedRoute.redirect) {
      continue;
    }
    if (
      ((protectedRoute.regex && protectedRoute.regex.test(decodedUrl)) || decodedUrl === protectedRoute.path) &&
      !userStore.loggedIn
    ) {
      return navigateTo(protectedRoute.redirect, { redirectCode: 301 });
    }
  }
});
