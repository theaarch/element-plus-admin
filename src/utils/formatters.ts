import { dayjs } from "element-plus";

export const formatDatetime = (row: any, column: any, cellValue: any) => {
  if (!cellValue) return "";
  return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
};

export const defaultTimes = () => {
  return [new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)];
};
