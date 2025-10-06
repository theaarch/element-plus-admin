import type { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import router from "@/router";
import type { Route } from "@/interfaces/menu";
import MenuAPI from "@/api/system/menu-api";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layouts/index.vue");

export const usePermissionStore = defineStore("permission", () => {
  // All routes (static + dynamic)
  const routes = ref<RouteRecordRaw[]>([]);
  const mixLayoutSideMenus = ref<RouteRecordRaw[]>([]);
  const isDynamicRoutesGenerated = ref(false);

  /** Generate dynamic routes */
  const generateRoutes = async (): Promise<RouteRecordRaw[]> => {
    try {
      const result = await MenuAPI.fetchRoutes();
      const processedRoutes = processRoutes(result.data);
      const dynamicRoutes = parseDynamicRoutes(processedRoutes);

      routes.value = [...constantRoutes, ...dynamicRoutes];

      isDynamicRoutesGenerated.value = true;

      return dynamicRoutes;
    } catch (error) {
      console.error("❌ Failed to generate routes:", error);
      isDynamicRoutesGenerated.value = false;
      throw error;
    }
  };

  /** Set side menus for mixed layout */
  const setMixLayoutSideMenus = (parentPath: string) => {
    const parentMenu = routes.value.find((item) => item.path === parentPath);

    mixLayoutSideMenus.value = parentMenu?.children || [];
  };

  /** Reset router state */
  const resetRouter = () => {
    const constantRouteNames = new Set(constantRoutes.map((route) => route.name).filter(Boolean));

    routes.value.forEach((route) => {
      if (route.name && !constantRouteNames.has(route.name)) {
        router.removeRoute(route.name);
      }
    });

    routes.value = [...constantRoutes];
    mixLayoutSideMenus.value = [];
    isDynamicRoutesGenerated.value = false;
  };

  return {
    routes,
    mixLayoutSideMenus,
    isDynamicRoutesGenerated,
    generateRoutes,
    setMixLayoutSideMenus,
    resetRouter,
  };
});

/** Parse backend routes into Vue Router routes */
const parseDynamicRoutes = (rawRoutes: Route[]): RouteRecordRaw[] => {
  const parsedRoutes: RouteRecordRaw[] = [];

  rawRoutes.forEach((route) => {
    const normalizedRoute = { ...route } as RouteRecordRaw;

    if (route.component) {
      normalizedRoute.component =
        route.component?.toString() === "Layout"
          ? Layout
          : modules[`../../views/${route.component}.vue`] || modules[`../../views/error/404.vue`];
    } else {
      normalizedRoute.component = undefined;
    }

    if (route.children?.length) {
      normalizedRoute.children = parseDynamicRoutes(route.children);
    }

    parsedRoutes.push(normalizedRoute);
  });

  return parsedRoutes;
};

/** Process routes to remove Layout for intermediate nodes */
const processRoutes = (routes: Route[], isTopLevel = true): Route[] => {
  return routes.map(({ component, children, ...rest }) => ({
    ...rest,
    component: isTopLevel || component !== "Layout" ? component : undefined,
    children: children && children.length > 0 ? processRoutes(children, false) : children,
  }));
};

/** Hook for usage outside component */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
