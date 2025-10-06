import axios, { type AxiosInstance } from "axios";
import qs from "qs";
import { useUserStoreHook } from "@/store/modules/user-store";
import { AuthStorage } from "@/utils/auth";
import router from "@/router";

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  paramsSerializer: (params) => qs.stringify(params),
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = AuthStorage.getAccessToken();

    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, any>).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      redirectToLogin("Access token expired, please log in.");
    } else if (!error.response) {
      console.error("Network / CORS error", error);
    }

    return Promise.reject(error);
  }
);

let isRedirecting = false;

async function redirectToLogin(message: string = "Please log in"): Promise<void> {
  if (isRedirecting) return;
  isRedirecting = true;

  try {
    ElNotification?.({
      title: "Notice",
      message,
      type: "warning",
      duration: 3000,
    });
  } catch (e) {
    console.error("Notification error:", e);
  }

  try {
    await useUserStoreHook().resetAllState();

    const currentPath = router.currentRoute.value.fullPath;
    await router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  } catch (e) {
    console.error("Redirect to login error:", e);
  } finally {
    isRedirecting = false;
  }
}

export default http;
