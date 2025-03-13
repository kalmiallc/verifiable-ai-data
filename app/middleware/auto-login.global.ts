import { useUserStore } from '~/stores/user';

interface RouteInterface {
  name: string;
  redirect: string;
}

const authRoutes: Array<RouteInterface> = [
  { name: 'login', redirect: '/' },
  { name: 'register', redirect: '/' },
];

/**
 * Load user data from localStorage into pinia.
 * If no user data in localStorage, logout.
 * Also logout if provider wallet is set and does not match localStorage wallet
 */
export default defineNuxtRouteMiddleware(to => {
  const userStore = useUserStore();

  if (userStore.jwt) {
    // Store already init'ed
    $api.setToken(userStore.jwt);
    return;
  }

  userStore.initUser();
  if (userStore.jwt) {
    /** Redirect auth routes */
    for (const route of authRoutes) {
      if (to.name === route.name) {
        return navigateTo(route.redirect, { redirectCode: 301 });
      }
    }
  } else {
    userStore.logout();
  }
});
