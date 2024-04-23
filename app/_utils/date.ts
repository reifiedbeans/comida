import dayjs, { Dayjs } from "dayjs";

export enum DateFormat {
  MonthDay = "MMMM D",
}

export function formatDate(date: string | Dayjs, format: DateFormat = DateFormat.MonthDay) {
  return dayjs(date).format(format);
}
