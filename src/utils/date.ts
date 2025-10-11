import type { SingleOrRange } from "element-plus";

export const dateTimeRangeDefaultTime = (): SingleOrRange<Date> => [
  new Date(0, 0, 0, 0, 0, 0),
  new Date(0, 0, 0, 23, 59, 59),
];
