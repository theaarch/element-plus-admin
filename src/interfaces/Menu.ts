import type { MenuTypeEnum } from "@/enums/system/menu-enum";

export interface RouteMeta {
  title?: string;
  icon?: string;
  hidden?: boolean;
  keepAlive?: boolean;
  alwaysShow?: boolean;

  [key: string]: any;
}

export interface Route {
  path?: string;
  component?: string;
  redirect?: string;
  name?: string;
  meta?: RouteMeta;
  children?: Route[];
}

export interface MenuQuery {
  keywords?: string;
}

export interface MenuFilters {
  name?: string;
}

interface KeyValue {
  key: string;
  value: string;
}

export interface MenuResponse {
  component?: string;
  icon?: string;
  id?: string;
  name?: string;
  parentId?: string;
  perm?: string;
  redirect?: string;
  routeName?: string;
  routePath?: string;
  sort?: number;
  type?: MenuTypeEnum;
  visible?: number;
  children?: MenuResponse[];
}

export interface Menu {
  id?: string;
  parentId?: string;
  name?: string;
  visible: number;
  icon?: string;
  sort?: number;
  routeName?: string;
  routePath?: string;
  component?: string;
  redirect?: string;
  type?: MenuTypeEnum;
  perm?: string;
  keepAlive?: number;
  alwaysShow?: number;
  params?: KeyValue[];
}
