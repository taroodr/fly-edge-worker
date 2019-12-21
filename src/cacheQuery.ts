import cache from "@fly/v8env/lib/fly/cache";
import { calcCacheKey } from "./calcCacheKey";
import { calcTagName } from "./calcTagName";
import * as _ from "lodash";

const graphqlEndpointURL =
  "https://swapi-graphql.netlify.com/.netlify/functions/index";
const cacheExpireSeconds = 60;

export const cacheQuery = async function(req: Request) {
  if (req.method === "POST") {
    const body = await req.json();
    const cacheKey = calcCacheKey(body);
    const cachedValue = await cache.getString(cacheKey);

    if (cachedValue) {
      return new Response(cachedValue, {
        headers: { "content-type": "application/json" }
      });
    }

    const response = await fetch(graphqlEndpointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (response.status < 400) {
      const resBody = await response.json();
      const tagNames = calcTagName(body);
      await cache.set(cacheKey, JSON.stringify(resBody), {
        ttl: cacheExpireSeconds,
        tags: ["swapi", ...tagNames]
      });
      return new Response(JSON.stringify(resBody), response);
    }
  }
  return new Response("not found", { status: 404 });
};
