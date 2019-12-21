import gql from "graphql-tag";
import * as md5 from "md5";
import * as util from "util";

export const calcCacheKey = (parsedBody): string => {
  const baseStr =
    JSON.stringify(parsedBody["query"]) +
    JSON.stringify(parsedBody["variables"]);
  const cacheKey = md5(baseStr);
  return cacheKey;
};
