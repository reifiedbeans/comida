import _ from "lodash";

import { BadRequestError } from "@/app/_utils/errors";

export enum SearchParamKey {
  SEASON = "season",
}

export type SearchParams = { [key in SearchParamKey]: string | string[] | undefined };

export function getParamValue(key: SearchParamKey, params?: SearchParams) {
  const value = params?.[key];
  if (value === undefined || typeof value === "string") {
    return value;
  } else {
    throw new BadRequestError(`Search param ${key.valueOf()} was passed multiple times`);
  }
}

export function buildParamString(params: { [key in SearchParamKey]: string }) {
  return _.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
