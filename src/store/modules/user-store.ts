import { store, useTagsViewStore } from "@/store";
import AuthAPI from "@/api/auth";
import type { LoginRequest } from "@/interfaces/auth";
import UserAPI, { type UserInfo } from "@/api/system/user-api";
import { AuthStorage } from "@/utils/auth";
import { usePermissionStoreHook } from "@/store/modules/permission-store";
import { useDictStoreHook } from "@/store/modules/dict-store";
import { cleanupWebSocket } from "@/plugins/websocket";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo>({} as UserInfo);
  const rememberMe = ref(AuthStorage.getRememberMe());

  async function login(payload: LoginRequest): Promise<void> {
    try {
      const result = await AuthAPI.login(payload);
      const { token } = result.data;

      rememberMe.value = payload.remember_me ?? false;
      AuthStorage.setTokens(token, "fake_refresh_token", rememberMe.value);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function getUserInfo(): Promise<UserInfo> {
    try {
      const result = await UserAPI.getInfo();
      const data = result.data;

      if (!data) {
        return Promise.reject("Please log in.");
      }

      Object.assign(userInfo.value, { ...data });

      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function logout(): Promise<void> {
    try {
      await AuthAPI.logout();
    } finally {
      resetAllState();
    }
  }

  const resetAllState = (): void => {
    resetUserState();

    usePermissionStoreHook().resetRouter();
    useDictStoreHook().clearDictCache();
    useTagsViewStore().delAllViews();

    cleanupWebSocket();
    console.log("[UserStore] WebSocket connections cleaned up");
  };

  const resetUserState = (): void => {
    AuthStorage.clearAuth();

    userInfo.value = {} as UserInfo;
  };

  return {
    userInfo,
    rememberMe,
    isLoggedIn: () => !!AuthStorage.getAccessToken(),
    getUserInfo,
    login,
    logout,
    resetAllState,
    resetUserState,
  };
});

/**
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
