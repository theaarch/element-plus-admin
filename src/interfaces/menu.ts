import type { MenuTypeEnum } from "@/enums";

export interface MenuVO {
  children?: MenuVO[];
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
}

export interface Menu {
  id?: number | string;
  parent_id?: number | string;
  path?: string;
  component?: string;
  name?: string;
  redirect?: string;
  title?: string;
  icon?: string;
  keep_alive?: boolean;
  always_show?: boolean;
  params?: KeyValue[];
  sort?: number;
  permission?: string;
  type?: MenuTypeEnum;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
  children?: Menu[];
}

interface KeyValue {
  key: string;
  value: string;
}

export interface RouteVO {
  children: RouteVO[];
  component?: string;
  meta?: Meta;
  name?: string;
  path?: string;
  redirect?: string;
}

export interface Meta {
  alwaysShow?: boolean;
  hidden?: boolean;
  icon?: string;
  keepAlive?: boolean;
  title?: string;
}
